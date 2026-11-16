export type TabId = 'mine' | 'rigs' | 'wallet' | 'install';

export type NetworkId = 'TRC-20' | 'ERC-20' | 'TON' | 'BEP-20';

export interface RigTier {
  id: string;
  name: string;
  tierLabel: string;
  hashrateGH: number;
  usdtPerHour: number;
  powerWatts: number;
  upgradeCost: number;
  imageUrl: string;
  description: string;
}

export type LedgerEntryType = 'claim' | 'upgrade' | 'bonus' | 'withdraw_sim';

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  amount: number;
  description: string;
  network?: NetworkId;
  address?: string;
  timestamp: number;
  status: 'Confirmed' | 'Simulated';
}

export interface MiningState {
  balance: number;
  pendingYield: number;
  totalMined: number;
  isMining: boolean;
  sessionStartedAt: number | null;
  sessionEndsAt: number | null;
  boostEndsAt: number | null;
  boostCooldownEndsAt: number | null;
  lastTickAt: number;
  rigsOwned: Record<string, number>;
  streakDays: number;
  lastBonusDate: string | null;
  selectedNetwork: NetworkId;
  ledger: LedgerEntry[];
}
