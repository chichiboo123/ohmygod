'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

interface NavbarProps {
  onHelpOpen: () => void;
}

const TABS = [
  { id: 'settings', emoji: '⚙️', icon: 'settings', label: 'nav.settings', step: 1 },
  { id: 'board', emoji: '🗺️', icon: 'grid_on', label: 'nav.boardEditor', step: 2 },
  { id: 'cards', emoji: '🃏', icon: 'style', label: 'nav.eventCards', step: 3 },
  { id: 'play', emoji: '🎮', icon: 'play_circle', label: 'nav.playMode', step: 4 },
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
    <nav className="bg-white border-b-4 border-primary sticky top-0 z-50 shadow-md" aria-label={t('nav.mainNavigation')}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">🎲</span>
            <div>
              <span className="font-title text-xl sm:text-2xl text-primary leading-none block">
                {t('app.title')}
              </span>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex items-center gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'text-slate-500 hover:bg-primary-light hover:text-primary'
                }`}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className="hidden md:inline">{t(tab.label)}</span>
                <span
                  className={`hidden md:inline-flex w-5 h-5 rounded-full text-[10px] font-bold items-center justify-center ${
                    activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {tab.step}
                </span>
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-label={t('nav.language')}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 border-border hover:bg-slate-50 transition-colors font-medium"
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="hidden sm:inline text-sm">{currentLang.label}</span>
                <span className="material-icons text-muted" style={{ fontSize: 18 }}>expand_more</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border-2 border-border rounded-xl shadow-xl z-20 min-w-[150px] overflow-hidden">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        role="menuitemradio"
                        aria-checked={i18n.language === lang.code}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-primary-light transition-colors ${
                          i18n.language === lang.code ? 'text-primary bg-primary-light' : 'text-foreground'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
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
              aria-label={t('nav.help')}
              className="btn-bounce flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border-2 border-border hover:bg-yellow-50 hover:border-yellow-300 transition-colors font-medium"
              title={t('nav.help')}
            >
              <span className="text-lg">❓</span>
              <span className="hidden sm:inline text-sm">{t('nav.help')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={mobileMenuOpen}
              className="sm:hidden flex items-center justify-center w-11 h-11 rounded-xl border-2 border-border hover:bg-slate-50 transition-colors"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t-2 border-border py-3 flex flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-bold transition-all w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-primary-light hover:text-primary'
                }`}
              >
                <span className="text-2xl">{tab.emoji}</span>
                <span className="flex-1">{t(tab.label)}</span>
                <span
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.step}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
