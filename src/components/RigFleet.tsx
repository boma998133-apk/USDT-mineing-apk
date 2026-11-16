import React, { useState } from 'react';
import { Server, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { RIG_TIERS } from '../data/rigs';
import type { MiningState } from '../types/mining';

interface RigFleetProps {
  state: MiningState;
  onBuyRig: (rigId: string) => { ok: boolean; error?: string };
}

const RigImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-[#16202C] to-[#0D131B] text-slate-400">
        <Server className="h-10 w-10 text-emerald-400/80" />
        <span className="mt-2 text-xs font-medium text-slate-300">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="aspect-[4/3] w-full object-cover"
    />
  );
};

export const RigFleet: React.FC<RigFleetProps> = ({ state, onBuyRig }) => {
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handlePurchase = (rigId: string, name: string) => {
    const res = onBuyRig(rigId);
    if (res.ok) {
      setFeedback({
        type: 'success',
        message: `Added ${name} to your active simulation fleet.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Unable to add hardware unit.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Virtual Rig Fleet
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Reinvest simulated USDT yields to scale your virtual hash rate.
          </p>
        </div>
        <div className="text-right">
          <span className="block text-xs text-slate-400">Available Balance</span>
          <span className="font-mono text-lg font-semibold text-white tabular-nums">
            {state.balance.toFixed(4)} <span className="text-emerald-400">USDT</span>
          </span>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {RIG_TIERS.map((rig) => {
          const owned = state.rigsOwned[rig.id] ?? 0;
          const canAfford = state.balance >= rig.upgradeCost;

          return (
            <article
              key={rig.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121922]"
            >
              <div className="relative overflow-hidden bg-[#0D131B]">
                <RigImage src={rig.imageUrl} alt={rig.name} />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs text-slate-400">
                    {rig.tierLabel} · Owned: <span className="font-mono text-slate-200 tabular-nums">{owned}</span>
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-white">
                    {rig.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {rig.description}
                  </p>

                  <dl className="mt-4 divide-y divide-white/[0.06] border-t border-white/[0.06] text-xs">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-400">Hashrate</dt>
                      <dd className="font-mono font-medium text-white tabular-nums">
                        {rig.hashrateGH.toFixed(1)} GH/s
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-400">Hourly Yield</dt>
                      <dd className="font-mono font-medium text-emerald-400 tabular-nums">
                        +{rig.usdtPerHour.toFixed(4)} USDT/hr
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-400">Power Rating</dt>
                      <dd className="font-mono font-medium text-slate-300 tabular-nums">
                        {rig.powerWatts} W
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => handlePurchase(rig.id, rig.name)}
                  className={`mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] whitespace-nowrap ${
                    canAfford
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'border border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.08]'
                  }`}
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>Add Unit · {rig.upgradeCost.toFixed(2)} USDT</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
