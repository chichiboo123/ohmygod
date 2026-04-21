'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { titleKey: 'help.step1Title', descKey: 'help.step1Desc', emoji: '⚙️', bg: 'bg-violet-100', text: 'text-violet-600' },
  { titleKey: 'help.step2Title', descKey: 'help.step2Desc', emoji: '🗺️', bg: 'bg-blue-100', text: 'text-blue-600' },
  { titleKey: 'help.step3Title', descKey: 'help.step3Desc', emoji: '🃏', bg: 'bg-orange-100', text: 'text-orange-600' },
  { titleKey: 'help.step4Title', descKey: 'help.step4Desc', emoji: '🎮', bg: 'bg-green-100', text: 'text-green-600' },
  { titleKey: 'help.step5Title', descKey: 'help.step5Desc', emoji: '📤', bg: 'bg-pink-100', text: 'text-pink-600' },
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t('help.title')}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-border">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b-2 border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">❓</span>
            <h2 className="font-title text-2xl text-primary">{t('help.title')}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t('help.close')}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <div className="bg-primary-light rounded-2xl p-4 text-center">
            <span className="text-3xl block mb-1">🎉</span>
            <p className="font-bold text-lg text-primary">
              {t('help.welcome')}
            </p>
            <p className="text-sm text-muted mt-1">{t('help.followSteps')}</p>
          </div>

          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary/30 transition-colors"
            >
              <div className={`shrink-0 w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center text-3xl`}>
                {step.emoji}
              </div>
              <div>
                <h3 className={`font-bold text-base ${step.text}`}>{t(step.titleKey)}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl border-t-2 border-border px-6 py-4">
          <button
            onClick={onClose}
            aria-label={t('help.close')}
            className="btn-bounce w-full py-3.5 bg-primary text-white rounded-xl text-base font-bold hover:bg-primary-hover transition-colors shadow-md"
          >
            {t('help.ctaStart')}
          </button>
        </div>
      </div>
    </div>
  );
}
