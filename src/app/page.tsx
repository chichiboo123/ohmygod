'use client';

import { useState, useEffect } from 'react';
import I18nProvider from '@/components/I18nProvider';
import Navbar from '@/components/Navbar';
import HelpModal from '@/components/HelpModal';
import SettingsTab from '@/components/SettingsTab';
import BoardEditorTab from '@/components/BoardEditorTab';
import EventCardsTab from '@/components/EventCardsTab';
import PlayModeTab from '@/components/PlayModeTab';
import { useGameStore } from '@/store/gameStore';

function AppContent() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onHelpOpen={() => setHelpOpen(true)} />

      <main className="flex-1 px-3 pt-4 pb-6 md:px-5 md:pt-5">
        {/* Tab Content */}
        <div className="tab-content">
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
