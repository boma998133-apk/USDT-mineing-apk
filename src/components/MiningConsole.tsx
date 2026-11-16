import React from 'react';
import {
  Play,
  Pause,
  ArrowDownToLine,
  Zap,
  CalendarCheck2,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { DAILY_BONUS_USDT, RIG_TIERS } from '../data/rigs';
import type { MiningState, TabId } from '../types/mining';

interface MiningConsoleProps {
  state: MiningState;
  derived: {
    totalHashrateGH: number;
    totalPowerWatts: number;
    totalRigCount: number;
    baseRatePerHour: number;
    effectiveRatePerHour: number;
    isBoostActive: boolean;
    boostRemainingSec: number;
    boostCooldownSec: number;
    sessionRemainingSec: number;
    sessionProgress: number;
    canClaimDailyBonus: boolean;
  };
  onToggleMining: () => void;
  onClaimYield: () => void;
  onActivateBoost: () => void;
  onClaimDailyBonus: () => void;
  onNavigate: (tab: TabId) => void;
}

function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const MiningConsole: React.FC<MiningConsoleProps> = ({
  state,
  derived,
  onToggleMining,
  onClaimYield,
  onActivateBoost,
  onClaimDailyBonus,
  onNavigate,
}) => {
  const ringRadius = 74;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset =
    ringCircumference * (1 - (state.isMining ? derived.sessionProgress : 0));

  const dailyProjected = derived.baseRatePerHour * 24;
  const weeklyProjected = dailyProjected * 7;
  const monthlyProjected = dailyProjected * 30;
  const hasClaimable = state.pendingYield >= 0.000001;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Primary Focal Anchor: Mining Core & Balance */}
        <section className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#121922] p-6 sm:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Mining Console
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                {state.isMining ? 'Cycle Active' : 'Standby'} ·{' '}
                {derived.isBoostActive ? '2x Overclock Active' : 'Standard Clock'} ·{' '}
                Virtual Simulation
              </p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-400">Wallet Balance</span>
              <span className="font-mono text-lg font-semibold text-white tabular-nums sm:text-xl">
                {state.balance.toFixed(4)} <span className="text-emerald-400">USDT</span>
              </span>
            </div>
          </div>

          {/* Center SVG Yield Ring */}
          <div className="my-7 flex flex-col items-center justify-center sm:my-8">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180" aria-hidden="true">
                <circle
                  cx="90"
                  cy="90"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="10"
                />
                <circle
                  cx="90"
                  cy="90"
                  r={ringRadius}
                  fill="none"
                  stroke={derived.isBoostActive ? '#34D399' : '#14B885'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-medium text-slate-400">Pending Yield</span>
                <span className="mt-1 font-mono text-2xl font-semibold tracking-tight text-white tabular-nums">
                  {state.pendingYield.toFixed(6)}
                </span>
                <span className="mt-0.5 font-mono text-xs font-medium text-emerald-400 tabular-nums">
                  USDT
                </span>
                <span className="mt-2 font-mono text-xs text-slate-400 tabular-nums">
                  {state.isMining
                    ? `${formatDuration(derived.sessionRemainingSec)} left`
                    : '4h cycle ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Primary & Secondary Action Row */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onToggleMining}
              className={`inline-flex min-h-[48px] flex-1 items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap ${
                state.isMining
                  ? 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {state.isMining ? (
                <>
                  <Pause className="h-4 w-4 shrink-0" />
                  <span>Pause Mining</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 shrink-0 fill-current" />
                  <span>Start Mining</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClaimYield}
              disabled={!hasClaimable}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-white/[0.03] disabled:text-slate-500 whitespace-nowrap"
            >
              <ArrowDownToLine className="h-4 w-4 shrink-0" />
              <span>Claim Yield</span>
            </button>
          </div>
        </section>

        {/* Right Column: Boost, Daily Streak & Yield Projections */}
        <section className="flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.08] bg-[#121922] p-6 sm:p-8 lg:col-span-5">
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Boost & Daily Rewards
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Accelerate simulated output or claim your daily streak allocation.
            </p>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={onActivateBoost}
                disabled={derived.isBoostActive || derived.boostCooldownSec > 0}
                className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#18222E] px-4 py-3 text-left transition hover:border-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-65"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-white truncate">
                      2x Overclock Boost
                    </span>
                    <span className="block text-xs text-slate-400 truncate">
                      {derived.isBoostActive
                        ? `Active · ${formatDuration(derived.boostRemainingSec)} remaining`
                        : derived.boostCooldownSec > 0
                        ? `Cooldown · ${formatDuration(derived.boostCooldownSec)}`
                        : 'Double hash rate for 15 minutes'}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                  {derived.isBoostActive
                    ? '2.0x'
                    : derived.boostCooldownSec > 0
                    ? 'Wait'
                    : 'Activate'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClaimDailyBonus}
                disabled={!derived.canClaimDailyBonus}
                className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#18222E] px-4 py-3 text-left transition hover:border-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-65"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-slate-200">
                    <CalendarCheck2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-white truncate">
                      Daily Check-in Credit
                    </span>
                    <span className="block text-xs text-slate-400 truncate">
                      Streak: {state.streakDays} {state.streakDays === 1 ? 'day' : 'days'} ·{' '}
                      {derived.canClaimDailyBonus ? 'Available today' : 'Claimed today'}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                  {derived.canClaimDailyBonus ? `+${DAILY_BONUS_USDT.toFixed(2)}` : 'Done'}
                </span>
              </button>
            </div>
          </div>

          {/* Yield Forecast Table */}
          <div className="border-t border-white/[0.07] pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Projected Fleet Yield</h3>
              <button
                type="button"
                onClick={() => onNavigate('rigs')}
                className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition whitespace-nowrap"
              >
                <span>Upgrade Rigs</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <dl className="mt-3 divide-y divide-white/[0.06] text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-400">24-Hour Estimate</dt>
                <dd className="font-mono font-medium text-white tabular-nums">
                  {dailyProjected.toFixed(4)} USDT
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-400">7-Day Estimate</dt>
                <dd className="font-mono font-medium text-white tabular-nums">
                  {weeklyProjected.toFixed(4)} USDT
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-slate-400">30-Day Estimate</dt>
                <dd className="font-mono font-medium text-emerald-400 tabular-nums">
                  {monthlyProjected.toFixed(4)} USDT
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      {/* 4-Metric Telemetry Strip */}
      <section aria-label="Mining telemetry" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#121922] p-4 sm:p-5">
          <span className="text-xs text-slate-400">Total Hashrate</span>
          <p className="mt-1.5 font-mono text-xl font-semibold text-white tabular-nums sm:text-2xl">
            {(derived.isBoostActive
              ? derived.totalHashrateGH * 2
              : derived.totalHashrateGH
            ).toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">GH/s</span>
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121922] p-4 sm:p-5">
          <span className="text-xs text-slate-400">Effective Yield</span>
          <p className="mt-1.5 font-mono text-xl font-semibold text-emerald-400 tabular-nums sm:text-2xl">
            {derived.effectiveRatePerHour.toFixed(4)}{' '}
            <span className="text-xs font-normal text-slate-400">USDT/hr</span>
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121922] p-4 sm:p-5">
          <span className="text-xs text-slate-400">Active Fleet</span>
          <p className="mt-1.5 font-mono text-xl font-semibold text-white tabular-nums sm:text-2xl">
            {derived.totalRigCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              {derived.totalRigCount === 1 ? 'Unit' : 'Units'}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#121922] p-4 sm:p-5">
          <span className="text-xs text-slate-400">Lifetime Mined</span>
          <p className="mt-1.5 font-mono text-xl font-semibold text-white tabular-nums sm:text-2xl">
            {state.totalMined.toFixed(4)}{' '}
            <span className="text-xs font-normal text-slate-400">USDT</span>
          </p>
        </div>
      </section>

      {/* Active Rig Breakdown Summary */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#121922] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h2 className="font-display text-sm font-semibold text-white">
              Deployed Virtual Hardware
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400 tabular-nums">
            Total Draw: {derived.totalPowerWatts} W
          </span>
        </div>

        <div className="mt-4 divide-y divide-white/[0.06]">
          {RIG_TIERS.map((rig) => {
            const count = state.rigsOwned[rig.id] ?? 0;
            return (
              <div
                key={rig.id}
                className="flex min-h-[56px] items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{rig.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {rig.hashrateGH.toFixed(1)} GH/s · {rig.usdtPerHour.toFixed(4)} USDT/hr
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono text-sm font-semibold text-white tabular-nums">
                    {count} {count === 1 ? 'unit' : 'units'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        Educational cloud mining simulator · Virtual USDT balances and yields have no monetary value.
      </p>
    </div>
  );
};
