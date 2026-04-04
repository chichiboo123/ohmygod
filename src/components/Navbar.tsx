'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

interface NavbarProps {
  onHelpOpen: () => void;
}

const TABS = [
  { id: 'settings', icon: 'settings', label: 'nav.settings' },
  { id: 'board', icon: 'grid_on', label: 'nav.boardEditor' },
  { id: 'cards', icon: 'style', label: 'nav.eventCards' },
  { id: 'play', icon: 'play_circle', label: 'nav.playMode' },
];

const LANGUAGES = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function Navbar({ onHelpOpen }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { activeTab, setActiveTab } = useGameStore();
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="material-icons text-primary" style={{ fontSize: 28 }}>
              casino
            </span>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              {t('app.title')}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-slate-100 hover:text-foreground'
                }`}
              >
                <span className="material-icons" style={{ fontSize: 18 }}>
                  {tab.icon}
                </span>
                <span className="hidden md:inline">{t(tab.label)}</span>
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm border border-border hover:bg-slate-50 transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline text-xs">{currentLang.label}</span>
                <span className="material-icons" style={{ fontSize: 16 }}>
                  expand_more
                </span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-20 min-w-[140px]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          i18n.language === lang.code ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={onHelpOpen}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm border border-border hover:bg-slate-50 transition-colors"
              title={t('nav.help')}
            >
              <span className="material-icons" style={{ fontSize: 18 }}>
                help_outline
              </span>
              <span className="hidden sm:inline text-xs">{t('nav.help')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
