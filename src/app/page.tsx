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

function AppContent() {
  const { activeTab, loadFromShareable, setActiveTab } = useGameStore();
  const [helpOpen, setHelpOpen] = useState(false);

  // Check for shared data in URL
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

      <main className="flex-1 p-4 md:p-6">
        {/* Export/Import bar - always visible */}
        <div className="max-w-6xl mx-auto mb-4">
          <ExportImport />
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'board' && <BoardEditorTab />}
          {activeTab === 'cards' && <EventCardsTab />}
          {activeTab === 'play' && <PlayModeTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-muted border-t border-border bg-white">
        게임의 신 (Oh My God) — Board Game Creator
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
