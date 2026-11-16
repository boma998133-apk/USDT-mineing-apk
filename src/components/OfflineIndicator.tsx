import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-2.5 rounded-xl border border-amber-400/30 bg-amber-950/95 px-4 py-2.5 text-xs font-medium text-amber-200 shadow-lg backdrop-blur-md lg:bottom-6 lg:left-auto lg:right-6"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-400" />
      <span>Offline Mode — Cached mining engine and local ledger active.</span>
    </div>
  );
};
