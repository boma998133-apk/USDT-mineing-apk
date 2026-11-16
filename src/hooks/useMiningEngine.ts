import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BOOST_COOLDOWN_MS,
  BOOST_DURATION_MS,
  DAILY_BONUS_USDT,
  RIG_TIERS,
  SESSION_DURATION_MS,
} from '../data/rigs';
import type { LedgerEntry, MiningState, NetworkId } from '../types/mining';

const STORAGE_KEY = 'tethermint_sim_state_v1';

function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function createInitialState(): MiningState {
  const now = Date.now();
  return {
    balance: 2.0,
    pendingYield: 0,
    totalMined: 0,
    isMining: false,
    sessionStartedAt: null,
    sessionEndsAt: null,
    boostEndsAt: null,
    boostCooldownEndsAt: null,
    lastTickAt: now,
    rigsOwned: {
      'cloud-node': 1,
      'asic-pro': 0,
      'cluster-vault': 0,
    },
    streakDays: 0,
    lastBonusDate: null,
    selectedNetwork: 'TRC-20',
    ledger: [
      {
        id: 'init-credit',
        type: 'bonus',
        amount: 2.0,
        description: 'Simulator Starter Credit & Cloud Node S1',
        timestamp: now,
        status: 'Simulated',
      },
    ],
  };
}

function calculateRatePerHour(rigsOwned: Record<string, number>): number {
  return RIG_TIERS.reduce((sum, rig) => {
    const qty = rigsOwned[rig.id] ?? 0;
    return sum + rig.usdtPerHour * qty;
  }, 0);
}

function computeElapsedYield(
  state: MiningState,
  fromMs: number,
  toMs: number
): number {
  if (!state.isMining || !state.sessionEndsAt || toMs <= fromMs) return 0;
  const effectiveEnd = Math.min(toMs, state.sessionEndsAt);
  if (effectiveEnd <= fromMs) return 0;

  const basePerSec = calculateRatePerHour(state.rigsOwned) / 3600;
  const totalElapsedSec = (effectiveEnd - fromMs) / 1000;

  let boostedSec = 0;
  if (state.boostEndsAt && state.boostEndsAt > fromMs) {
    const boostEnd = Math.min(effectiveEnd, state.boostEndsAt);
    boostedSec = Math.max(0, (boostEnd - fromMs) / 1000);
  }

  const normalSec = Math.max(0, totalElapsedSec - boostedSec);
  return normalSec * basePerSec + boostedSec * basePerSec * 2;
}

function loadPersistedState(): MiningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as MiningState;
    const now = Date.now();
    const catchup = computeElapsedYield(parsed, parsed.lastTickAt || now, now);
    const sessionStillActive =
      parsed.isMining && parsed.sessionEndsAt !== null && now < parsed.sessionEndsAt;

    return {
      ...createInitialState(),
      ...parsed,
      pendingYield: (parsed.pendingYield || 0) + catchup,
      totalMined: (parsed.totalMined || 0) + catchup,
      isMining: sessionStillActive,
      sessionStartedAt: sessionStillActive ? parsed.sessionStartedAt : null,
      sessionEndsAt: sessionStillActive ? parsed.sessionEndsAt : null,
      lastTickAt: now,
    };
  } catch {
    return createInitialState();
  }
}

export function useMiningEngine() {
  const [state, setState] = useState<MiningState>(() => loadPersistedState());
  const [now, setNow] = useState<number>(() => Date.now());

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  // 1-second deterministic engine tick
  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      setState((prev) => {
        if (!prev.isMining) {
          if (current - prev.lastTickAt > 5000) {
            return { ...prev, lastTickAt: current };
          }
          return prev;
        }

        const earned = computeElapsedYield(prev, prev.lastTickAt, current);
        const sessionExpired =
          prev.sessionEndsAt !== null && current >= prev.sessionEndsAt;

        return {
          ...prev,
          pendingYield: prev.pendingYield + earned,
          totalMined: prev.totalMined + earned,
          isMining: !sessionExpired,
          sessionStartedAt: sessionExpired ? null : prev.sessionStartedAt,
          sessionEndsAt: sessionExpired ? null : prev.sessionEndsAt,
          lastTickAt: current,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const derived = useMemo(() => {
    const totalHashrateGH = RIG_TIERS.reduce(
      (sum, rig) => sum + rig.hashrateGH * (state.rigsOwned[rig.id] ?? 0),
      0
    );
    const totalPowerWatts = RIG_TIERS.reduce(
      (sum, rig) => sum + rig.powerWatts * (state.rigsOwned[rig.id] ?? 0),
      0
    );
    const totalRigCount = Object.values(state.rigsOwned).reduce((a, b) => a + b, 0);
    const baseRatePerHour = calculateRatePerHour(state.rigsOwned);
    const isBoostActive = state.boostEndsAt !== null && now < state.boostEndsAt;
    const effectiveRatePerHour = isBoostActive ? baseRatePerHour * 2 : baseRatePerHour;

    const boostRemainingSec = isBoostActive && state.boostEndsAt
      ? Math.max(0, Math.ceil((state.boostEndsAt - now) / 1000))
      : 0;

    const boostCooldownSec =
      !isBoostActive && state.boostCooldownEndsAt && now < state.boostCooldownEndsAt
        ? Math.max(0, Math.ceil((state.boostCooldownEndsAt - now) / 1000))
        : 0;

    const sessionRemainingSec =
      state.isMining && state.sessionEndsAt
        ? Math.max(0, Math.ceil((state.sessionEndsAt - now) / 1000))
        : 0;

    const sessionProgress =
      state.isMining && state.sessionStartedAt && state.sessionEndsAt
        ? Math.min(
            1,
            Math.max(
              0,
              (now - state.sessionStartedAt) /
                (state.sessionEndsAt - state.sessionStartedAt)
            )
          )
        : 0;

    const today = getTodayDateString();
    const canClaimDailyBonus = state.lastBonusDate !== today;

    return {
      totalHashrateGH,
      totalPowerWatts,
      totalRigCount,
      baseRatePerHour,
      effectiveRatePerHour,
      isBoostActive,
      boostRemainingSec,
      boostCooldownSec,
      sessionRemainingSec,
      sessionProgress,
      canClaimDailyBonus,
    };
  }, [state, now]);

  const toggleMining = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setState((prev) => {
      if (prev.isMining) {
        const earned = computeElapsedYield(prev, prev.lastTickAt, current);
        return {
          ...prev,
          pendingYield: prev.pendingYield + earned,
          totalMined: prev.totalMined + earned,
          isMining: false,
          sessionStartedAt: null,
          sessionEndsAt: null,
          lastTickAt: current,
        };
      }
      return {
        ...prev,
        isMining: true,
        sessionStartedAt: current,
        sessionEndsAt: current + SESSION_DURATION_MS,
        lastTickAt: current,
      };
    });
  }, []);

  const claimYield = useCallback(() => {
    const current = Date.now();
    setState((prev) => {
      const earned = computeElapsedYield(prev, prev.lastTickAt, current);
      const claimable = prev.pendingYield + earned;
      if (claimable <= 0.000001) return prev;

      const entry: LedgerEntry = {
        id: `claim-${current}`,
        type: 'claim',
        amount: claimable,
        description: 'Mining Yield Claimed to Wallet',
        timestamp: current,
        status: 'Simulated',
      };

      return {
        ...prev,
        balance: prev.balance + claimable,
        pendingYield: 0,
        totalMined: prev.totalMined + earned,
        lastTickAt: current,
        ledger: [entry, ...prev.ledger].slice(0, 60),
      };
    });
  }, []);

  const activateBoost = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setState((prev) => {
      const isCurrentlyBoosted = prev.boostEndsAt !== null && current < prev.boostEndsAt;
      const inCooldown =
        prev.boostCooldownEndsAt !== null && current < prev.boostCooldownEndsAt;
      if (isCurrentlyBoosted || inCooldown) return prev;

      return {
        ...prev,
        boostEndsAt: current + BOOST_DURATION_MS,
        boostCooldownEndsAt: current + BOOST_DURATION_MS + BOOST_COOLDOWN_MS,
      };
    });
  }, []);

  const claimDailyBonus = useCallback(() => {
    const current = Date.now();
    const today = getTodayDateString();
    setState((prev) => {
      if (prev.lastBonusDate === today) return prev;
      const entry: LedgerEntry = {
        id: `bonus-${current}`,
        type: 'bonus',
        amount: DAILY_BONUS_USDT,
        description: `Daily Check-in Bonus (Day ${prev.streakDays + 1})`,
        timestamp: current,
        status: 'Simulated',
      };
      return {
        ...prev,
        balance: prev.balance + DAILY_BONUS_USDT,
        streakDays: prev.streakDays + 1,
        lastBonusDate: today,
        ledger: [entry, ...prev.ledger].slice(0, 60),
      };
    });
  }, []);

  const buyRig = useCallback((rigId: string): { ok: boolean; error?: string } => {
    const tier = RIG_TIERS.find((r) => r.id === rigId);
    if (!tier) return { ok: false, error: 'Unknown hardware tier.' };

    let result: { ok: boolean; error?: string } = { ok: true };
    const current = Date.now();

    setState((prev) => {
      if (prev.balance < tier.upgradeCost) {
        result = {
          ok: false,
          error: `Need ${tier.upgradeCost.toFixed(2)} USDT in wallet balance.`,
        };
        return prev;
      }

      const entry: LedgerEntry = {
        id: `rig-${current}`,
        type: 'upgrade',
        amount: -tier.upgradeCost,
        description: `Added ${tier.name} (+${tier.hashrateGH} GH/s)`,
        timestamp: current,
        status: 'Simulated',
      };

      return {
        ...prev,
        balance: prev.balance - tier.upgradeCost,
        rigsOwned: {
          ...prev.rigsOwned,
          [tier.id]: (prev.rigsOwned[tier.id] ?? 0) + 1,
        },
        ledger: [entry, ...prev.ledger].slice(0, 60),
      };
    });

    return result;
  }, []);

  const setSelectedNetwork = useCallback((network: NetworkId) => {
    setState((prev) => ({ ...prev, selectedNetwork: network }));
  }, []);

  const simulateTransfer = useCallback(
    (
      address: string,
      amount: number,
      network: NetworkId
    ): { ok: boolean; error?: string } => {
      const trimmed = address.trim();
      if (trimmed.length < 12) {
        return {
          ok: false,
          error: 'Enter a valid destination wallet address (at least 12 characters).',
        };
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, error: 'Enter a valid simulated transfer amount.' };
      }

      let outcome: { ok: boolean; error?: string } = { ok: true };
      const current = Date.now();

      setState((prev) => {
        if (amount > prev.balance) {
          outcome = { ok: false, error: 'Insufficient simulated USDT balance.' };
          return prev;
        }
        const shortAddr = `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
        const entry: LedgerEntry = {
          id: `sim-tx-${current}`,
          type: 'withdraw_sim',
          amount: -amount,
          description: `Simulated ${network} Transfer to ${shortAddr}`,
          network,
          address: trimmed,
          timestamp: current,
          status: 'Simulated',
        };

        return {
          ...prev,
          balance: prev.balance - amount,
          ledger: [entry, ...prev.ledger].slice(0, 60),
        };
      });

      return outcome;
    },
    []
  );

  const resetSimulation = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    setNow(Date.now());
  }, []);

  return {
    state,
    derived,
    toggleMining,
    claimYield,
    activateBoost,
    claimDailyBonus,
    buyRig,
    setSelectedNetwork,
    simulateTransfer,
    resetSimulation,
  };
}
