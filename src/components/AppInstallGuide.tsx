import React, { useState } from 'react';
import { Smartphone, ShieldCheck, HardDrive, RotateCcw } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface AppInstallGuideProps {
  onResetSimulation: () => void;
}

export const AppInstallGuide: React.FC<AppInstallGuideProps> = ({
  onResetSimulation,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    onResetSimulation();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          Install Mobile App (PWA)
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Add USDT mineing directly to your Android or iOS home screen for a full-screen app experience without downloading an untrusted APK file.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#121922] p-6 sm:p-8 lg:col-span-7">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Smartphone className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-white">
              Direct Home Screen Installation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              USDT mineing is packaged as a Progressive Web App (PWA) with standalone display mode, offline service worker caching, and persistent local state—delivering native Android app ergonomics straight from your browser.
            </p>

            <dl className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.06] text-sm">
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-400">Display Mode</dt>
                <dd className="font-mono text-white">Standalone Full-Screen</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-400">Offline Support</dt>
                <dd className="font-mono text-emerald-400">Workbox Precached</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-slate-400">Data Storage</dt>
                <dd className="font-mono text-white">Device LocalStorage</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            <PWAInstallButton variant="card" />
          </div>
        </section>

        <section className="flex flex-col justify-between space-y-6 rounded-2xl border border-white/[0.08] bg-[#121922] p-6 sm:p-8 lg:col-span-5">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Transparent Simulation Notice
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  USDT (Tether) is a fiat-collateralized stablecoin issued on blockchains and cannot be mined via Proof-of-Work on mobile devices. All hash rates, yields, hardware rigs, and transfers in USDT mineing are simulated locally for interactive demonstration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-white/[0.07] pt-5">
              <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Local Device Persistence
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Your mining balance, elapsed cycle progress, and owned rigs are stored locally on this device. Resetting restores the starter 2.00 USDT credit and single Cloud Node S1.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.07] pt-5">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span>Reset Simulator Data</span>
              </button>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-amber-300">
                  Confirm resetting your virtual balance, rigs, and ledger?
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[44px] rounded-xl border border-white/10 bg-white/[0.05] text-xs font-medium text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] rounded-xl bg-rose-500 text-xs font-semibold text-white hover:bg-rose-400"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
