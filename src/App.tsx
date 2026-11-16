import { useState } from 'react';
import { Pickaxe, Server, Wallet, Smartphone } from 'lucide-react';
import { useMiningEngine } from './hooks/useMiningEngine';
import { MiningConsole } from './components/MiningConsole';
import { RigFleet } from './components/RigFleet';
import { WalletLedger } from './components/WalletLedger';
import { AppInstallGuide } from './components/AppInstallGuide';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import type { TabId } from './types/mining';

const NAV_ITEMS: { id: TabId; label: string; mobileLabel: string; icon: typeof Pickaxe }[] = [
  { id: 'mine', label: 'Mining', mobileLabel: 'Mining', icon: Pickaxe },
  { id: 'rigs', label: 'Rig Fleet', mobileLabel: 'Rigs', icon: Server },
  { id: 'wallet', label: 'Wallet', mobileLabel: 'Wallet', icon: Wallet },
  { id: 'install', label: 'Install App', mobileLabel: 'App', icon: Smartphone },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('mine');
  const {
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
  } = useMiningEngine();

  return (
    <div className="min-h-screen bg-[#0B1016] text-slate-100">
      {/* Top Bar: 3-zone contract on desktop, compact 52px bar on mobile */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#0B1016]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 md:h-16 lg:px-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('mine')}
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
          >
            USDT mineing
          </button>

          {/* Zone 2: Clean single-line text navigation (Desktop/Tablet) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded ${
                    isActive
                      ? 'text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <PWAInstallButton variant="header" />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-6 md:pb-12 lg:px-8">
        {activeTab === 'mine' && (
          <MiningConsole
            state={state}
            derived={derived}
            onToggleMining={toggleMining}
            onClaimYield={claimYield}
            onActivateBoost={activateBoost}
            onClaimDailyBonus={claimDailyBonus}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'rigs' && (
          <RigFleet state={state} onBuyRig={buyRig} />
        )}

        {activeTab === 'wallet' && (
          <WalletLedger
            state={state}
            onSelectNetwork={setSelectedNetwork}
            onSimulateTransfer={simulateTransfer}
          />
        )}

        {activeTab === 'install' && (
          <AppInstallGuide onResetSimulation={resetSimulation} />
        )}
      </main>

      {/* Mobile Bottom Thumb-Zone Navigation (hidden on md+) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#0B1016]/95 backdrop-blur-md pb-safe md:hidden"
      >
        <div className="grid h-16 grid-cols-4 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <OfflineIndicator />
    </div>
  );
}
