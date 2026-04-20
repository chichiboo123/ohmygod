'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

const EMOJI_OPTIONS = [
  '🎲', '💰', '🎁', '💎', '⚡', '🔥', '❄️', '🌟', '🎯', '🃏',
  '🏆', '💣', '🎪', '🎭', '🎨', '🎵', '🍀', '👑', '🦄', '🌈',
  '🚀', '⭐', '💫', '🎉', '🎊', '🏅', '💝', '🔮', '🧲', '🎸',
  '🐶', '🐱', '🐸', '🦊', '🐼', '🌸', '🍭', '🍕', '🍦', '🎠',
];

export default function EventCardsTab() {
  const { t } = useTranslation();
  const { cards, addCard, updateCard, removeCard, settings } = useGameStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🃏</span>
          <div>
            <h2 className="font-title text-2xl text-primary">{t('cards.title')}</h2>
            <p className="text-sm text-muted">
              재미있는 이벤트 카드를 만들어봐요!
              <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                {cards.length}장
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={addCard}
          className="btn-bounce flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-md"
        >
          <span className="text-lg">➕</span>
          카드 추가
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-border p-12 text-center card-fun">
          <span className="text-7xl block mb-4">🃏</span>
          <p className="text-lg font-bold text-slate-500 mb-2">아직 카드가 없어요!</p>
          <p className="text-sm text-muted mb-5">위의 '카드 추가' 버튼을 눌러보세요</p>
          <button
            onClick={addCard}
            className="btn-bounce inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold bg-primary text-white hover:bg-primary-hover shadow-md"
          >
            <span className="text-xl">➕</span>
            첫 번째 카드 만들기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border-2 border-border p-5 space-y-4 card-fun">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Emoji Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setEmojiPickerOpen(emojiPickerOpen === card.id ? null : card.id)}
                      className="btn-bounce w-14 h-14 rounded-xl border-2 border-border flex items-center justify-center text-3xl hover:border-primary hover:scale-110 transition-all shadow-sm"
                    >
                      {card.emoji}
                    </button>
                    {emojiPickerOpen === card.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setEmojiPickerOpen(null)} />
                        <div className="absolute left-0 top-full mt-2 bg-white border-2 border-border rounded-2xl shadow-xl z-20 p-3 grid grid-cols-5 gap-1.5 w-[260px]">
                          <p className="col-span-5 text-xs font-bold text-muted mb-1 text-center">이모지 골라봐요!</p>
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                updateCard(card.id, { emoji });
                                setEmojiPickerOpen(null);
                              }}
                              className="btn-bounce w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-light text-2xl transition-colors"
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
                      placeholder="카드 이름을 써봐요"
                      className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeCard(card.id)}
                  className="ml-2 w-10 h-10 rounded-xl text-danger/60 hover:text-danger hover:bg-danger/10 flex items-center justify-center transition-colors text-xl"
                >
                  🗑️
                </button>
              </div>

              {/* Mission */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">
                  📋 미션/행동 설명
                </label>
                <textarea
                  value={card.mission}
                  onChange={(e) => updateCard(card.id, { mission: e.target.value })}
                  placeholder="어떤 미션인지 설명해봐요! (예: 춤을 춰야 해요!)"
                  rows={2}
                  className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              {/* Value & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    {card.value >= 0 ? '🎁 받는 보상' : '💸 내는 벌금'} ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step={10}
                    value={card.value}
                    onChange={(e) => updateCard(card.id, { value: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-base font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <span className={`text-xs mt-1 inline-block font-bold ${card.value >= 0 ? 'text-success' : 'text-danger'}`}>
                    {card.value >= 0
                      ? `✅ +${card.value} 받아요!`
                      : `❌ ${card.value} 내야 해요`}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    🎨 카드 뒷면 색깔
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={card.color}
                      onChange={(e) => updateCard(card.id, { color: e.target.value })}
                      className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
                    />
                    <span className="text-xs font-mono text-muted bg-slate-50 px-2 py-1 rounded-lg">{card.color}</span>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-3">👀 미리보기</label>
                <div className="flex gap-4 items-end">
                  {/* Front */}
                  <div className="flex-1">
                    <p className="text-xs text-muted text-center mb-1 font-medium">앞면</p>
                    <div className="w-full max-w-[120px] mx-auto aspect-[3/4] rounded-xl border-2 border-border bg-white flex flex-col items-center justify-center p-3 shadow-sm">
                      <span className="text-3xl mb-2">{card.emoji}</span>
                      <span className="text-xs font-bold text-center leading-tight line-clamp-2">
                        {card.title || '카드 이름'}
                      </span>
                      <span className={`text-sm font-bold mt-2 ${card.value >= 0 ? 'text-success' : 'text-danger'}`}>
                        {card.value >= 0 ? '+' : ''}{card.value}
                      </span>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="flex-1">
                    <p className="text-xs text-muted text-center mb-1 font-medium">뒷면</p>
                    <div
                      className="w-full max-w-[120px] mx-auto aspect-[3/4] rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: card.color }}
                    >
                      <span className="text-4xl">❓</span>
                    </div>
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
