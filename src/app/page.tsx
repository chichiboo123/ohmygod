'use client';

import { useState, useEffect } from 'react';
import I18nProvider from '@/components/I18nProvider';
import Navbar from '@/components/Navbar';
import HelpModal from '@/components/HelpModal';
import SettingsTab from '@/components/SettingsTab';
import BoardEditorTab from '@/components/BoardEditorTab';
import EventCardsTab from '@/components/EventCardsTab';
import PlayModeTab from '@/components/PlayModeTab';
import ExportImport from '@/components/ExportImport';
import { useGameStore } from '@/store/gameStore';
import { useTranslation } from 'react-i18next';

const STEP_GUIDE = [
  { id: 'settings', emoji: '⚙️', labelKey: 'nav.settings', color: 'bg-violet-500' },
  { id: 'board', emoji: '🗺️', labelKey: 'nav.boardEditor', color: 'bg-blue-500' },
  { id: 'cards', emoji: '🃏', labelKey: 'nav.eventCards', color: 'bg-orange-500' },
  { id: 'play', emoji: '🎮', labelKey: 'nav.playMode', color: 'bg-green-500' },
];

function AppContent() {
  const { t } = useTranslation();
  const { activeTab, loadFromShareable, setActiveTab } = useGameStore();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(data)));
        loadFromShareable(decoded);
        setActiveTab('play');
      } catch {
        // Invalid data, ignore
      }
    }
  }, [loadFromShareable, setActiveTab]);

  const currentStep = STEP_GUIDE.findIndex((s) => s.id === activeTab) + 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onHelpOpen={() => setHelpOpen(true)} />

      <main className="flex-1 px-3 pt-4 pb-6 md:px-5 md:pt-5">
        {/* Step Progress Bar */}
        <div className="max-w-6xl mx-auto mb-4">
          <div className="flex items-center gap-1 bg-white rounded-2xl border-2 border-border p-2 shadow-sm">
            {STEP_GUIDE.map((step, i) => {
              const stepNum = i + 1;
              const isActive = step.id === activeTab;
              const isDone = STEP_GUIDE.findIndex((s) => s.id === activeTab) > i;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`btn-bounce flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? `${step.color} text-white shadow-md`
                      : isDone
                      ? 'bg-slate-100 text-slate-500'
                      : 'hover:bg-slate-50 text-slate-400'
                  }`}
                >
                  <span className="text-base sm:text-xl">{step.emoji}</span>
                  <span className="hidden sm:inline">{t(step.labelKey)}</span>
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isActive ? 'bg-white/30' : isDone ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isDone && !isActive ? '✓' : stepNum}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted mt-1.5 font-medium">
            {t('common.stepProgress', { current: currentStep, total: STEP_GUIDE.length })}
          </p>
        </div>

        {/* Export/Import bar */}
        <div className="max-w-6xl mx-auto mb-4 hidden sm:block">
          <ExportImport />
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <div className="sm:hidden mb-4">
            <ExportImport />
          </div>
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'board' && <BoardEditorTab />}
          {activeTab === 'cards' && <EventCardsTab />}
          {activeTab === 'play' && <PlayModeTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-muted border-t-2 border-border bg-white">
        <span className="text-lg">🎲</span>{' '}
        <span className="font-title text-primary">게임의 신</span>
        {' '}— 나만의 보드게임 만들기 🎉
      </footer>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
