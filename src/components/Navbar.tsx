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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="material-icons text-primary" style={{ fontSize: 24 }}>casino</span>
            <span className="font-bold text-base sm:text-lg text-foreground">
              {t('app.title')}
            </span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex items-center gap-1">
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
                <span className="material-icons" style={{ fontSize: 18 }}>{tab.icon}</span>
                <span className="hidden md:inline">{t(tab.label)}</span>
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-lg text-sm border border-border hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="hidden sm:inline text-xs">{currentLang.label}</span>
                <span className="material-icons" style={{ fontSize: 16 }}>expand_more</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-20 min-w-[140px]">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
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

            {/* Help */}
            <button
              onClick={onHelpOpen}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-lg text-sm border border-border hover:bg-slate-50 transition-colors"
              title={t('nav.help')}
            >
              <span className="material-icons" style={{ fontSize: 18 }}>help_outline</span>
              <span className="hidden sm:inline text-xs">{t('nav.help')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center p-1.5 rounded-lg border border-border hover:bg-slate-50"
            >
              <span className="material-icons" style={{ fontSize: 20 }}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border py-2 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-slate-100'
                }`}
              >
                <span className="material-icons" style={{ fontSize: 18 }}>{tab.icon}</span>
                {t(tab.label)}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
