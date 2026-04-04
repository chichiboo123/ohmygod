'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore, Theme, GameOverCondition } from '@/store/gameStore';
import { UNIQUE_BOARD_SIZES } from '@/store/boardLayout';

const THEMES: Theme[] = ['default', 'forest', 'space', 'city', 'ocean', 'desert'];
const CONDITIONS: GameOverCondition[] = ['timeLimit', 'maxLaps', 'targetCurrency', 'survival'];

const THEME_EMOJIS: Record<Theme, string> = {
  default: '🎮', forest: '🌲', space: '🚀', city: '🏙️', ocean: '🌊', desert: '🏜️',
};

export default function SettingsTab() {
  const { t } = useTranslation();
  const { settings, updateSettings, setBoardDimensions } = useGameStore();

  const conditionLabel = (c: GameOverCondition) => {
    switch (c) {
      case 'timeLimit': return t('settings.conditionTimeSec');
      case 'maxLaps': return t('settings.conditionLaps');
      case 'targetCurrency': return t('settings.conditionAmount');
      case 'survival': return t('settings.conditionValue');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-icons text-primary">settings</span>
        <h2 className="text-lg sm:text-xl font-bold">{t('settings.title')}</h2>
      </div>

      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 space-y-5">
        {/* Game Title */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('settings.gameTitle')}</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder={t('settings.gameTitlePlaceholder')}
            className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('settings.theme')}</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => updateSettings({ theme })}
                className={`flex flex-col items-center gap-1 p-2.5 sm:p-3 rounded-lg border-2 transition-all text-xs ${
                  settings.theme === theme
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border hover:border-muted'
                }`}
              >
                <span className="text-xl">{THEME_EMOJIS[theme]}</span>
                <span>{t(`settings.themes.${theme}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Board Size Dropdown & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.boardSize')}</label>
            <select
              value={`${settings.boardWidth}x${settings.boardHeight}`}
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                setBoardDimensions(w, h);
              }}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              {UNIQUE_BOARD_SIZES.map((s) => (
                <option key={`${s.width}x${s.height}`} value={`${s.width}x${s.height}`}>
                  {s.total} tiles ({s.width} × {s.height})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted mt-1">
              {settings.boardWidth} × {settings.boardHeight} = {settings.boardSize} tiles
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.currency')}</label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              placeholder={t('settings.currencyPlaceholder')}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Players & Lap Reward */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.players')}</label>
            <input
              type="number"
              min={2}
              max={10}
              value={settings.players}
              onChange={(e) => updateSettings({ players: Math.max(2, Math.min(10, parseInt(e.target.value) || 2)) })}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.lapReward')}</label>
            <input
              type="number"
              min={0}
              step={10}
              value={settings.lapReward}
              onChange={(e) => updateSettings({ lapReward: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Dice */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.diceCount')}</label>
            <select
              value={settings.diceCount}
              onChange={(e) => updateSettings({ diceCount: parseInt(e.target.value) as 1 | 2 })}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('settings.diceFaces')}</label>
            <input
              type="number"
              min={2}
              max={20}
              value={settings.diceFaces}
              onChange={(e) => updateSettings({ diceFaces: Math.max(2, Math.min(20, parseInt(e.target.value) || 6)) })}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        {/* Game Over Condition */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">{t('settings.gameOverCondition')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CONDITIONS.map((cond) => (
              <button
                key={cond}
                onClick={() => updateSettings({ gameOverCondition: cond })}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium border-2 transition-all ${
                  settings.gameOverCondition === cond
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-muted'
                }`}
              >
                {t(`settings.conditions.${cond}`)}
              </button>
            ))}
          </div>
          {settings.gameOverCondition !== 'survival' && (
            <div>
              <label className="block text-xs text-muted mb-1">
                {conditionLabel(settings.gameOverCondition)}
              </label>
              <input
                type="number"
                min={1}
                value={settings.conditionValue}
                onChange={(e) => updateSettings({ conditionValue: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Player Preview */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('settings.players')} - Preview</label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: settings.players }, (_, i) => {
              const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: colors[i % colors.length] }}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>person</span>
                  P{i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
