import React, { useState } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled && variant === 'header') {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'unavailable') {
        setShowGuideModal(true);
      }
      return;
    }
    setShowGuideModal(true);
  };

  if (isInstalled && variant === 'card') {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300">
        <Smartphone className="h-4 w-4 shrink-0" />
        <span>Installed as Standalone App</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          variant === 'header'
            ? 'inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap shrink-0'
            : 'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 whitespace-nowrap shrink-0'
        }
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>{isInstallable ? 'Install App' : isIOS ? 'Add to iPhone' : 'Install App'}</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-white/10 bg-[#121922] p-6 text-slate-100 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-700 sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="pwa-install-title"
                  className="font-display text-lg font-semibold text-white"
                >
                  Install USDT mineing
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Launch full-screen on Android, iOS, or desktop without sideloading an APK.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close installation guide"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-300">
              {isIOS ? (
                <div className="space-y-3 rounded-xl border border-white/10 bg-[#0B1016] p-4">
                  <p className="font-medium text-white">iPhone & iPad (Safari)</p>
                  <ol className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <Share className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Tap the <strong>Share</strong> icon in the Safari toolbar.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <PlusSquare className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-white/10 bg-[#0B1016] p-4">
                  <p className="font-medium text-white">
                    {isAndroid ? 'Android (Chrome / Edge)' : 'Chrome / Edge / Android'}
                  </p>
                  <ol className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <MoreVertical className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>
                        Open the browser menu (<strong>⋮</strong>) or address-bar install icon.
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Smartphone className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>
                        Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
              <p className="text-xs text-slate-400">
                Runs offline via service worker cache with local state persistence.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-5 min-h-[44px] w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
