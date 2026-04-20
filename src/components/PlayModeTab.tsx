'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore, THEME_CONFIGS } from '@/store/gameStore';
import { createBoardGrid } from '@/store/boardLayout';
import { useEffect, useRef, useState } from 'react';

const PLAYER_EMOJIS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🩷', '🩵', '🟠', '🔵', '🟩'];

export default function PlayModeTab() {
  const { t } = useTranslation();
  const {
    settings,
    tiles,
    playState,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    rollDice,
    drawEventCard,
    toggleAutoMode,
    movePlayer,
    tickTimer,
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [diceAnimating, setDiceAnimating] = useState(false);
  const [showEvent, setShowEvent] = useState(false);

  useEffect(() => {
    if (playState.isPlaying && !playState.isPaused && settings.gameOverCondition === 'timeLimit') {
      timerRef.current = setInterval(() => tickTimer(), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playState.isPlaying, playState.isPaused, settings.gameOverCondition, tickTimer]);

  const handleRollDice = () => {
    setDiceAnimating(true);
    setTimeout(() => { rollDice(); setDiceAnimating(false); }, 500);
  };

  const handleDrawEvent = () => {
    drawEventCard();
    setShowEvent(true);
    setTimeout(() => setShowEvent(false), 4000);
  };

  const themeConfig = THEME_CONFIGS[settings.theme];
  const currentPlayer = playState.players[playState.currentPlayerIndex];
  const { boardWidth, boardHeight } = settings;
  const grid = createBoardGrid(boardWidth, boardHeight);

  // Not started
  if (!playState.isPlaying && !playState.isGameOver) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">🎮</span>
          <h2 className="font-title text-2xl text-primary">{t('play.title')}</h2>
        </div>
        <div className="bg-white rounded-2xl border-2 border-border p-8 sm:p-12 text-center space-y-5 card-fun">
          <span className="text-8xl block">🎮</span>
          <div>
            <p className="text-lg font-bold text-slate-600 mb-2">
              {tiles.length > 0 ? '게임 시작 준비가 됐어요!' : '먼저 기본 설정에서 게임을 만들어봐요!'}
            </p>
            <p className="text-sm text-muted">
              {tiles.length > 0
                ? `${settings.players}명의 플레이어가 함께 즐길 준비가 됐어요 🎉`
                : '⚙️ 기본 설정 → 🗺️ 보드판 편집 → 🃏 이벤트 카드 순서로 만들어봐요!'}
            </p>
          </div>
          {tiles.length > 0 && (
            <button
              onClick={startGame}
              className="btn-bounce inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-2xl text-lg font-bold hover:bg-green-600 transition-colors shadow-lg"
            >
              <span className="text-2xl">▶️</span>
              게임 시작!
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h2 className="font-title text-xl sm:text-2xl text-primary">{t('play.title')}</h2>
            {settings.title && (
              <p className="text-sm text-muted font-medium">{settings.title}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleAutoMode}
            className={`btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${
              playState.isAutoMode
                ? 'border-primary bg-primary-light text-primary'
                : 'border-warning bg-warning/10 text-warning'
            }`}
          >
            <span className="text-lg">{playState.isAutoMode ? '🤖' : '✋'}</span>
            <span className="hidden sm:inline">
              {playState.isAutoMode ? '자동 모드' : '수동 모드'}
            </span>
          </button>
          {playState.isPaused ? (
            <button onClick={resumeGame} className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-green-500 text-white shadow-md">
              <span className="text-lg">▶️</span>
              <span className="hidden sm:inline">계속하기</span>
            </button>
          ) : (
            <button onClick={pauseGame} className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-warning text-white shadow-md">
              <span className="text-lg">⏸️</span>
              <span className="hidden sm:inline">일시정지</span>
            </button>
          )}
          <button onClick={resetGame} className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-danger text-white shadow-md">
            <span className="text-lg">⏹️</span>
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>
      </div>

      {/* Game Over Banner */}
      {playState.isGameOver && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white text-center space-y-3">
          <span className="text-7xl star-pop block">🏆</span>
          <h3 className="font-title text-3xl sm:text-4xl">{t('play.gameOver')}</h3>
          {playState.winner && (
            <p className="text-lg sm:text-xl font-bold">
              🎉 {playState.winner.name} 우승! — {playState.winner.score} {settings.currency}
            </p>
          )}
          <button
            onClick={resetGame}
            className="btn-bounce mt-3 px-6 py-3 bg-white text-primary rounded-xl font-bold text-base shadow-md"
          >
            🔄 다시 하기
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Board */}
        <div className="lg:col-span-2 space-y-3">
          <div className={`bg-gradient-to-br ${themeConfig.gradient} rounded-2xl border-2 border-border p-4`}>
            {/* Timer */}
            {settings.gameOverCondition === 'timeLimit' && (
              <div className="flex items-center justify-center gap-2 mb-4 bg-white/70 rounded-xl py-2 px-4">
                <span className="text-2xl">⏱️</span>
                <span className={`text-lg font-bold font-mono ${playState.timeRemaining < 30 ? 'text-danger' : 'text-foreground'}`}>
                  {Math.floor(playState.timeRemaining / 60)}:{String(playState.timeRemaining % 60).padStart(2, '0')}
                </span>
                {playState.timeRemaining < 30 && (
                  <span className="text-danger text-sm font-bold animate-pulse">빨리빨리!</span>
                )}
              </div>
            )}

            {/* Board Grid */}
            <div className="board-wrapper">
              <div
                className="grid gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
                  maxWidth: Math.min(boardWidth * 76, 580),
                }}
              >
                {grid.map((row, r) =>
                  row.map((tileIdx, c) => {
                    if (tileIdx === null) {
                      return <div key={`${r}-${c}`} className="aspect-square" />;
                    }

                    const tile = tiles[tileIdx];
                    if (!tile) return <div key={`${r}-${c}`} />;

                    const playersHere = playState.players.filter(
                      (p) => p.position === tileIdx && !p.isEliminated
                    );
                    const isOwned = tile.owner !== null;
                    const ownerPlayer = isOwned ? playState.players.find((p) => p.id === tile.owner) : null;

                    return (
                      <div
                        key={tile.id}
                        className={`relative aspect-square rounded-lg flex flex-col items-center justify-center border-2 p-0.5 ${
                          tile.isFixed
                            ? 'bg-amber-100 border-amber-300'
                            : isOwned
                            ? ''
                            : 'bg-white border-border'
                        }`}
                        style={
                          isOwned && ownerPlayer
                            ? { borderColor: ownerPlayer.color, backgroundColor: `${ownerPlayer.color}20` }
                            : undefined
                        }
                      >
                        <span className={`text-[8px] sm:text-[10px] font-bold leading-tight line-clamp-1 w-full text-center ${themeConfig.textDark ? 'text-white' : ''}`}>
                          {tileIdx === 0 ? '🏁' : tile.name}
                        </span>
                        {tile.tier1 > 0 && (
                          <span className="text-[7px] sm:text-[9px] text-slate-500 font-mono">{tile.tier1}</span>
                        )}
                        {playersHere.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                            {playersHere.map((p) => (
                              <div
                                key={p.id}
                                className="player-token w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                                style={{ backgroundColor: p.color }}
                              >
                                <span className="text-white text-[8px] sm:text-[10px] font-bold">{p.id + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Dice & Actions */}
          {!playState.isGameOver && (
            <div className="bg-white rounded-2xl border-2 border-border p-4 card-fun">
              {/* Current Player Banner */}
              {currentPlayer && (
                <div
                  className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl text-white font-bold"
                  style={{ backgroundColor: currentPlayer.color }}
                >
                  <span className="text-2xl">{PLAYER_EMOJIS[currentPlayer.id % PLAYER_EMOJIS.length]}</span>
                  <span className="text-base">{currentPlayer.name}의 차례!</span>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                {/* Roll Dice Button */}
                <button
                  onClick={handleRollDice}
                  disabled={playState.isPaused || playState.isGameOver || diceAnimating}
                  className="btn-bounce flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-lg"
                >
                  <span className={`text-2xl ${diceAnimating ? 'dice-rolling inline-block' : ''}`}>🎲</span>
                  주사위 굴리기!
                </button>

                {/* Dice Result */}
                {playState.diceResult.length > 0 && (
                  <div className="flex items-center gap-2">
                    {playState.diceResult.map((val, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md"
                      >
                        {val}
                      </div>
                    ))}
                    {playState.diceResult.length > 1 && (
                      <div className="flex flex-col items-center">
                        <span className="text-muted text-sm">=</span>
                        <span className="text-xl font-bold text-primary">
                          {playState.diceResult.reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Draw Event Card */}
                <button
                  onClick={handleDrawEvent}
                  disabled={playState.isPaused || playState.isGameOver}
                  className="btn-bounce flex items-center gap-2 px-4 py-3 border-2 border-orange-300 bg-orange-50 rounded-xl text-sm sm:text-base font-bold text-orange-600 hover:bg-orange-100 disabled:opacity-50 transition-colors"
                >
                  <span className="text-xl">🃏</span>
                  <span className="hidden sm:inline">이벤트 카드</span>
                  <span className="sm:hidden">카드</span>
                </button>

                {/* Manual Move Buttons */}
                {!playState.isAutoMode && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => movePlayer(-1)}
                      className="btn-bounce w-11 h-11 border-2 border-border rounded-xl hover:bg-slate-50 flex items-center justify-center text-xl transition-colors"
                    >
                      ◀️
                    </button>
                    <button
                      onClick={() => movePlayer(1)}
                      className="btn-bounce w-11 h-11 border-2 border-border rounded-xl hover:bg-slate-50 flex items-center justify-center text-xl transition-colors"
                    >
                      ▶️
                    </button>
                  </div>
                )}
              </div>

              {/* Event Card Popup */}
              {showEvent && playState.lastEventCard && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-primary/30 rounded-2xl p-5 text-center max-w-sm shadow-lg">
                    <span className="text-5xl block mb-2">{playState.lastEventCard.emoji}</span>
                    <h4 className="font-bold text-lg mt-1">{playState.lastEventCard.title}</h4>
                    <p className="text-sm text-muted mt-1">{playState.lastEventCard.mission}</p>
                    <p className={`text-xl font-bold mt-2 ${playState.lastEventCard.value >= 0 ? 'text-success' : 'text-danger'}`}>
                      {playState.lastEventCard.value >= 0 ? '🎁 +' : '💸 '}{playState.lastEventCard.value} {settings.currency}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div>
          <div className="bg-white rounded-2xl border-2 border-border p-4 space-y-3 sticky top-20 card-fun">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span className="text-xl">🏅</span>
              점수판
            </h3>
            <div className="space-y-2">
              {[...playState.players]
                .sort((a, b) => b.score - a.score)
                .map((player, rank) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl border-2 transition-all ${
                      player.isEliminated
                        ? 'bg-slate-50 border-border opacity-50'
                        : playState.currentPlayerIndex === player.id
                        ? 'bg-primary/5 border-primary/40 shadow-sm'
                        : 'border-border'
                    }`}
                  >
                    <span className="text-lg font-bold w-6 text-center">
                      {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}`}
                    </span>
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: player.color }}>
                      {player.id + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold truncate">
                          {player.name}{player.isEliminated && ' ❌'}
                          {playState.currentPlayerIndex === player.id && !player.isEliminated && ' 👈'}
                        </span>
                        <span className="text-sm font-bold text-primary ml-1 shrink-0">
                          {player.score} {settings.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5 font-medium">
                        <span>📍 {player.position}번 칸</span>
                        <span>🔄 {player.laps}바퀴</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t-2 border-border space-y-2 text-sm">
              <div className="flex justify-between font-medium">
                <span className="text-muted">🏁 게임 종료 조건</span>
                <span className="font-bold">{t(`settings.conditions.${settings.gameOverCondition}`)}</span>
              </div>
              {settings.gameOverCondition !== 'survival' && (
                <div className="flex justify-between font-medium">
                  <span className="text-muted">🎯 목표 값</span>
                  <span className="font-bold">{settings.conditionValue}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span className="text-muted">🎁 한 바퀴 보상</span>
                <span className="font-bold">{settings.lapReward} {settings.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
