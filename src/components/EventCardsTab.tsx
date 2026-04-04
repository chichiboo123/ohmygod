'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

const EMOJI_OPTIONS = [
  '🎲', '💰', '🎁', '💎', '⚡', '🔥', '❄️', '🌟', '🎯', '🃏',
  '🏆', '💣', '🎪', '🎭', '🎨', '🎵', '🍀', '👑', '🦄', '🌈',
  '🚀', '⭐', '💫', '🎉', '🎊', '🏅', '💝', '🔮', '🧲', '🎸',
];

export default function EventCardsTab() {
  const { t } = useTranslation();
  const { cards, addCard, updateCard, removeCard, settings } = useGameStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">style</span>
          <h2 className="text-xl font-bold">{t('cards.title')}</h2>
          <span className="text-xs text-muted bg-slate-100 px-2 py-0.5 rounded-full">
            {cards.length} cards
          </span>
        </div>
        <button
          onClick={addCard}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          <span className="material-icons" style={{ fontSize: 16 }}>add</span>
          {t('cards.addCard')}
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <span className="material-icons text-muted mb-3" style={{ fontSize: 48 }}>style</span>
          <p className="text-muted text-sm">{t('cards.noCards')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-border p-5 space-y-4">
              {/* Card Editor */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Emoji Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setEmojiPickerOpen(emojiPickerOpen === card.id ? null : card.id)}
                      className="w-12 h-12 rounded-xl border-2 border-border flex items-center justify-center text-2xl hover:border-primary transition-colors"
                    >
                      {card.emoji}
                    </button>
                    {emojiPickerOpen === card.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setEmojiPickerOpen(null)} />
                        <div className="absolute left-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20 p-2 grid grid-cols-6 gap-1 w-[220px]">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                updateCard(card.id, { emoji });
                                setEmojiPickerOpen(null);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(card.id, { title: e.target.value })}
                      placeholder={t('cards.cardTitlePlaceholder')}
                      className="w-full px-2.5 py-1 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeCard(card.id)}
                  className="p-1 rounded text-danger/60 hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <span className="material-icons" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>

              {/* Mission */}
              <div>
                <label className="block text-xs text-muted mb-1">{t('cards.mission')}</label>
                <textarea
                  value={card.mission}
                  onChange={(e) => updateCard(card.id, { mission: e.target.value })}
                  placeholder={t('cards.missionPlaceholder')}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              {/* Value & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">
                    {t('cards.currencyValue')} ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step={10}
                    value={card.value}
                    onChange={(e) => updateCard(card.id, { value: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className={`text-[10px] mt-0.5 inline-block ${card.value >= 0 ? 'text-success' : 'text-danger'}`}>
                    {card.value >= 0 ? `+${card.value} (${t('cards.positive')})` : `${card.value} (${t('cards.negative')})`}
                  </span>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">{t('cards.backColor')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={card.color}
                      onChange={(e) => updateCard(card.id, { color: e.target.value })}
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                    />
                    <span className="text-xs font-mono text-muted">{card.color}</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-xs text-muted mb-2">{t('cards.preview')}</label>
                <div className="flex gap-3">
                  {/* Front */}
                  <div className="w-24 h-32 rounded-xl border-2 border-border bg-white flex flex-col items-center justify-center p-2 shadow-sm">
                    <span className="text-2xl mb-1">{card.emoji}</span>
                    <span className="text-[9px] font-medium text-center leading-tight line-clamp-2">
                      {card.title || '...'}
                    </span>
                    <span className={`text-[9px] font-bold mt-1 ${card.value >= 0 ? 'text-success' : 'text-danger'}`}>
                      {card.value >= 0 ? '+' : ''}{card.value}
                    </span>
                  </div>
                  {/* Back */}
                  <div
                    className="w-24 h-32 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: card.color }}
                  >
                    <span className="text-white text-3xl">?</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
