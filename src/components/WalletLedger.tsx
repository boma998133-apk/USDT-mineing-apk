import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import type { LedgerEntryType, MiningState, NetworkId } from '../types/mining';

interface WalletLedgerProps {
  state: MiningState;
  onSelectNetwork: (network: NetworkId) => void;
  onSimulateTransfer: (
    address: string,
    amount: number,
    network: NetworkId
  ) => { ok: boolean; error?: string };
}

const NETWORKS: NetworkId[] = ['TRC-20', 'ERC-20', 'TON', 'BEP-20'];

const SAMPLE_ADDRESSES: Record<NetworkId, string> = {
  'TRC-20': 'TX9kSimDemoAddress7824pQr9vLm2k',
  'ERC-20': '0x71C7SimDemoWallet9304f8bA219e',
  TON: 'UQSimDemoTonWalletAddress8821k',
  'BEP-20': '0x94B2SimDemoBscAddress1024c481',
};

type FilterType = 'all' | LedgerEntryType;

export const WalletLedger: React.FC<WalletLedgerProps> = ({
  state,
  onSelectNetwork,
  onSimulateTransfer,
}) => {
  const [address, setAddress] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number.parseFloat(amountInput);
    const res = onSimulateTransfer(address, parsedAmount, state.selectedNetwork);
    if (res.ok) {
      setFeedback({
        type: 'success',
        message: `Recorded simulated ${state.selectedNetwork} transfer of ${parsedAmount.toFixed(
          4
        )} USDT.`,
      });
      setAmountInput('');
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Transfer simulation failed.',
      });
    }
  };

  const filteredLedger = state.ledger.filter((item) =>
    filter === 'all' ? true : item.type === filter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          Simulated Wallet & Ledger
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Test network routing and track local mining activity. No real cryptocurrency is transferred.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Balance & Simulated Transfer Form */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#121922] p-6 lg:col-span-5">
          <div className="border-b border-white/[0.07] pb-5">
            <span className="text-xs text-slate-400">Simulated Wallet Balance</span>
            <p className="mt-1 font-mono text-3xl font-semibold text-white tabular-nums">
              {state.balance.toFixed(4)} <span className="text-lg text-emerald-400">USDT</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Pending Unclaimed: <span className="font-mono text-slate-200 tabular-nums">{state.pendingYield.toFixed(6)} USDT</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <span className="block text-xs font-medium text-slate-300">
                Simulated Network
              </span>
              <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-xl bg-[#0B1016] p-1">
                {NETWORKS.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => onSelectNetwork(net)}
                    className={`min-h-[40px] rounded-lg px-2 py-1.5 font-mono text-xs font-medium transition whitespace-nowrap ${
                      state.selectedNetwork === net
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sim-address"
                  className="block text-xs font-medium text-slate-300"
                >
                  Destination Address ({state.selectedNetwork})
                </label>
                <button
                  type="button"
                  onClick={() => setAddress(SAMPLE_ADDRESSES[state.selectedNetwork])}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Fill Demo Address
                </button>
              </div>
              <input
                id="sim-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`Enter ${state.selectedNetwork} wallet address`}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0B1016] px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="sim-amount"
                  className="block text-xs font-medium text-slate-300"
                >
                  Amount (USDT)
                </label>
                <button
                  type="button"
                  onClick={() => setAmountInput(state.balance.toFixed(4))}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Use Max
                </button>
              </div>
              <input
                id="sim-amount"
                type="number"
                step="0.0001"
                min="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0.0000"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-white/10 bg-[#0B1016] px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 tabular-nums focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {feedback && (
              <div
                role="status"
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                  feedback.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] whitespace-nowrap"
            >
              Simulate Transfer
            </button>
          </form>
        </section>

        {/* Right: Activity Ledger */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#121922] p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-white">
              Activity Ledger
            </h2>
            <div className="flex items-center gap-1 rounded-xl bg-[#0B1016] p-1">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'claim', label: 'Claims' },
                  { id: 'upgrade', label: 'Rigs' },
                  { id: 'withdraw_sim', label: 'Transfers' },
                ] as { id: FilterType; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-medium transition whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-[#1B2533] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredLedger.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No activity recorded in this category yet.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-white/[0.06]">
              {filteredLedger.map((entry) => {
                const isPositive = entry.amount >= 0;
                return (
                  <div
                    key={entry.id}
                    className="flex min-h-[60px] items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          entry.type === 'upgrade'
                            ? 'bg-white/[0.06] text-slate-300'
                            : isPositive
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-white/[0.06] text-slate-300'
                        }`}
                      >
                        {entry.type === 'upgrade' ? (
                          <Cpu className="h-4 w-4" />
                        ) : isPositive ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {entry.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(entry.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          · {entry.status}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`font-mono text-sm font-semibold tabular-nums ${
                          isPositive ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {entry.amount.toFixed(4)} USDT
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
