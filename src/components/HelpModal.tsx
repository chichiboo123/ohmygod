'use client';

import { useTranslation } from 'react-i18next';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { titleKey: 'help.step1Title', descKey: 'help.step1Desc', icon: 'settings' },
  { titleKey: 'help.step2Title', descKey: 'help.step2Desc', icon: 'grid_on' },
  { titleKey: 'help.step3Title', descKey: 'help.step3Desc', icon: 'style' },
  { titleKey: 'help.step4Title', descKey: 'help.step4Desc', icon: 'play_circle' },
  { titleKey: 'help.step5Title', descKey: 'help.step5Desc', icon: 'share' },
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons text-primary">help</span>
            <h2 className="text-lg font-bold">{t('help.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-primary font-semibold text-center text-lg">
            {t('help.welcome')}
          </p>

          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-border"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-primary" style={{ fontSize: 20 }}>
                  {step.icon}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t(step.titleKey)}</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-border px-6 py-3">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
