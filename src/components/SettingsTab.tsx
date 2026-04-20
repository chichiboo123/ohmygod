'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore, Theme, GameOverCondition } from '@/store/gameStore';
import { UNIQUE_BOARD_SIZES } from '@/store/boardLayout';

const THEMES: Theme[] = ['default', 'forest', 'space', 'city', 'ocean', 'desert'];
const CONDITIONS: GameOverCondition[] = ['timeLimit', 'maxLaps', 'targetCurrency', 'survival'];

const THEME_EMOJIS: Record<Theme, string> = {
  default: '🎮', forest: '🌲', space: '🚀', city: '🏙️', ocean: '🌊', desert: '🏜️',
};

const CONDITION_EMOJIS: Record<GameOverCondition, string> = {
  timeLimit: '⏰', maxLaps: '🔄', targetCurrency: '💰', survival: '🏆',
};

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];
const PLAYER_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🩷', '🩵', '🟠', '🔵', '🟩'];

function SectionCard({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-border p-5 space-y-4 card-fun">
      <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
        <span className="text-xl">{emoji}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-slate-600 mb-2">{children}</label>;
}

const inputClass = "w-full px-4 py-3 border-2 border-border rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

export default function SettingsTab() {
  const { t } = useTranslation();
  const { settings, updateSettings, setBoardDimensions } = useGameStore();

  const conditionLabel = (c: GameOverCondition) => {
    switch (c) {
      case 'timeLimit': return '⏱️ 시간 (초)';
      case 'maxLaps': return '🔄 바퀴 수';
      case 'targetCurrency': return '💰 목표 금액';
      case 'survival': return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">⚙️</span>
        <div>
          <h2 className="font-title text-2xl text-primary">{t('settings.title')}</h2>
          <p className="text-sm text-muted">게임을 어떻게 만들지 정해봐요!</p>
        </div>
      </div>

      {/* Game Title */}
      <SectionCard emoji="✏️" title="게임 이름">
        <input
          type="text"
          value={settings.title}
          onChange={(e) => updateSettings({ title: e.target.value })}
          placeholder="내 멋진 보드게임 이름을 써봐요!"
          className={inputClass}
        />
      </SectionCard>

      {/* Theme */}
      <SectionCard emoji="🎨" title="배경 테마 고르기">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => updateSettings({ theme })}
              className={`btn-bounce flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-bold ${
                settings.theme === theme
                  ? 'border-primary bg-primary-light text-primary shadow-md scale-105'
                  : 'border-border hover:border-primary/40 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
              <span>{t(`settings.themes.${theme}`)}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Board Size & Currency */}
      <SectionCard emoji="📐" title="보드 크기와 화폐">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>🗺️ 보드판 크기</Label>
            <select
              value={`${settings.boardWidth}x${settings.boardHeight}`}
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                setBoardDimensions(w, h);
              }}
              className={inputClass + ' bg-white'}
            >
              {UNIQUE_BOARD_SIZES.map((s) => (
                <option key={`${s.width}x${s.height}`} value={`${s.width}x${s.height}`}>
                  칸 {s.total}개 ({s.width} × {s.height})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted mt-1.5 font-medium">
              📏 {settings.boardWidth} × {settings.boardHeight} = 총 {settings.boardSize}칸
            </p>
          </div>
          <div>
            <Label>💵 화폐 이름 (예: 별, 동전, 초코)</Label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              placeholder="예: 별, 동전, 초코"
              className={inputClass}
            />
          </div>
        </div>
      </SectionCard>

      {/* Players & Lap Reward */}
      <SectionCard emoji="👥" title="플레이어 설정">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>👫 함께 할 친구 수 (2~10명)</Label>
            <input
              type="number"
              min={2}
              max={10}
              value={settings.players}
              onChange={(e) => updateSettings({ players: Math.max(2, Math.min(10, parseInt(e.target.value) || 2)) })}
              className={inputClass + ' text-center text-xl font-bold'}
            />
          </div>
          <div>
            <Label>🎁 한 바퀴 돌면 받는 보상</Label>
            <input
              type="number"
              min={0}
              step={10}
              value={settings.lapReward}
              onChange={(e) => updateSettings({ lapReward: parseInt(e.target.value) || 0 })}
              className={inputClass + ' text-center text-xl font-bold'}
            />
          </div>
        </div>

        {/* Player Preview */}
        <div>
          <p className="text-sm font-bold text-slate-600 mb-2">🎭 플레이어 미리보기</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: settings.players }, (_, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-sm font-bold shadow-sm"
                style={{ backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
              >
                <span>{PLAYER_EMOJIS[i % PLAYER_EMOJIS.length]}</span>
                플레이어 {i + 1}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Dice */}
      <SectionCard emoji="🎲" title="주사위 설정">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>🎲 주사위 몇 개?</Label>
            <select
              value={settings.diceCount}
              onChange={(e) => updateSettings({ diceCount: parseInt(e.target.value) as 1 | 2 })}
              className={inputClass + ' bg-white'}
            >
              <option value={1}>🎲 주사위 1개</option>
              <option value={2}>🎲🎲 주사위 2개</option>
            </select>
          </div>
          <div>
            <Label>🔢 주사위 면 수 (2~20)</Label>
            <input
              type="number"
              min={2}
              max={20}
              value={settings.diceFaces}
              onChange={(e) => updateSettings({ diceFaces: Math.max(2, Math.min(20, parseInt(e.target.value) || 6)) })}
              className={inputClass + ' text-center text-xl font-bold'}
            />
          </div>
        </div>
      </SectionCard>

      {/* Game Over Condition */}
      <SectionCard emoji="🏁" title="게임 끝내는 방법">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => updateSettings({ gameOverCondition: cond })}
              className={`btn-bounce flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                settings.gameOverCondition === cond
                  ? 'border-primary bg-primary-light text-primary shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{CONDITION_EMOJIS[cond]}</span>
              {t(`settings.conditions.${cond}`)}
            </button>
          ))}
        </div>
        {settings.gameOverCondition !== 'survival' && (
          <div>
            <Label>{conditionLabel(settings.gameOverCondition)}</Label>
            <input
              type="number"
              min={1}
              value={settings.conditionValue}
              onChange={(e) => updateSettings({ conditionValue: Math.max(1, parseInt(e.target.value) || 1) })}
              className={inputClass + ' text-center text-xl font-bold'}
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
