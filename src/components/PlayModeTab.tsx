'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore, THEME_CONFIGS } from '@/store/gameStore';
import { createBoardGrid } from '@/store/boardLayout';
import { useEffect, useRef, useState } from 'react';

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
    setTimeout(() => setShowEvent(false), 3000);
  };

  const themeConfig = THEME_CONFIGS[settings.theme];
  const currentPlayer = playState.players[playState.currentPlayerIndex];
  const { boardWidth, boardHeight } = settings;
  const grid = createBoardGrid(boardWidth, boardHeight);

  // Not started
  if (!playState.isPlaying && !playState.isGameOver) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-icons text-primary">play_circle</span>
          <h2 className="text-lg sm:text-xl font-bold">{t('play.title')}</h2>
        </div>
        <div className="bg-white rounded-xl border border-border p-8 sm:p-12 text-center space-y-4">
          <span className="material-icons text-muted" style={{ fontSize: 64 }}>sports_esports</span>
          <p className="text-muted text-sm">
            {tiles.length > 0 ? t('play.notStarted') : t('play.designFirst')}
          </p>
          {tiles.length > 0 && (
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              <span className="material-icons">play_arrow</span>
              {t('play.start')}
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
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">play_circle</span>
          <h2 className="text-lg sm:text-xl font-bold">{t('play.title')}</h2>
          {settings.title && (
            <span className="text-xs text-muted bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline">
              {settings.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={toggleAutoMode}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
              playState.isAutoMode
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-warning bg-warning/5 text-warning'
            }`}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>
              {playState.isAutoMode ? 'smart_toy' : 'pan_tool'}
            </span>
            <span className="hidden sm:inline">
              {playState.isAutoMode ? t('play.autoMode') : t('play.manualMode')}
            </span>
          </button>
          {playState.isPaused ? (
            <button onClick={resumeGame} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-success text-white">
              <span className="material-icons" style={{ fontSize: 14 }}>play_arrow</span>
              <span className="hidden sm:inline">{t('play.resume')}</span>
            </button>
          ) : (
            <button onClick={pauseGame} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-warning text-white">
              <span className="material-icons" style={{ fontSize: 14 }}>pause</span>
              <span className="hidden sm:inline">{t('play.pause')}</span>
            </button>
          )}
          <button onClick={resetGame} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-danger text-white">
            <span className="material-icons" style={{ fontSize: 14 }}>stop</span>
            <span className="hidden sm:inline">{t('play.reset')}</span>
          </button>
        </div>
      </div>

      {/* Game Over */}
      {playState.isGameOver && (
        <div className="bg-gradient-to-r from-primary to-purple-500 rounded-xl p-4 sm:p-6 text-white text-center space-y-2">
          <span className="material-icons" style={{ fontSize: 48 }}>emoji_events</span>
          <h3 className="text-xl sm:text-2xl font-bold">{t('play.gameOver')}</h3>
          {playState.winner && (
            <p className="text-base sm:text-lg">
              {t('play.winner', { name: playState.winner.name })} — {playState.winner.score} {settings.currency}
            </p>
          )}
          <button onClick={resetGame} className="mt-3 px-4 py-2 bg-white text-primary rounded-lg font-medium text-sm">
            {t('play.reset')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Board */}
        <div className="lg:col-span-2 space-y-3">
          <div className={`bg-gradient-to-br ${themeConfig.gradient} rounded-xl border border-border p-3 sm:p-4`}>
            {/* Timer */}
            {settings.gameOverCondition === 'timeLimit' && (
              <div className="flex items-center justify-center gap-2 mb-3 text-sm font-mono">
                <span className="material-icons text-danger" style={{ fontSize: 18 }}>timer</span>
                <span className={playState.timeRemaining < 30 ? 'text-danger font-bold' : ''}>
                  {t('play.timeRemaining')}: {Math.floor(playState.timeRemaining / 60)}:{String(playState.timeRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Rectangular Board */}
            <div className="board-wrapper">
              <div
                className="grid gap-1 sm:gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
                  maxWidth: Math.min(boardWidth * 72, 560),
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
                        className={`relative aspect-square rounded-md sm:rounded-lg flex flex-col items-center justify-center border-2 p-0.5 ${
                          tile.isFixed
                            ? 'bg-amber-100 border-amber-300'
                            : isOwned
                            ? ''
                            : 'bg-white border-border'
                        }`}
                        style={
                          isOwned && ownerPlayer
                            ? { borderColor: ownerPlayer.color, backgroundColor: `${ownerPlayer.color}15` }
                            : undefined
                        }
                      >
                        <span className={`text-[7px] sm:text-[9px] font-medium leading-tight line-clamp-1 w-full text-center ${themeConfig.textDark ? 'text-white' : ''}`}>
                          {tile.name}
                        </span>
                        {tile.tier1 > 0 && (
                          <span className="text-[6px] sm:text-[8px] text-muted font-mono">{tile.tier1}</span>
                        )}
                        {playersHere.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                            {playersHere.map((p) => (
                              <div
                                key={p.id}
                                className="player-token w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white shadow-sm flex items-center justify-center"
                                style={{ backgroundColor: p.color }}
                              >
                                <span className="text-white text-[5px] sm:text-[7px] font-bold">{p.id + 1}</span>
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
            <div className="bg-white rounded-xl border border-border p-3 sm:p-4">
              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                {currentPlayer && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" style={{ backgroundColor: currentPlayer.color }} />
                    <span className="text-xs sm:text-sm font-medium">
                      {t('play.currentTurn')}: {currentPlayer.name}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleRollDice}
                  disabled={playState.isPaused || playState.isGameOver || diceAnimating}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 text-sm"
                >
                  <span className={`material-icons ${diceAnimating ? 'dice-rolling' : ''}`} style={{ fontSize: 20 }}>casino</span>
                  {t('play.rollDice')}
                </button>

                {playState.diceResult.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {playState.diceResult.map((val, i) => (
                      <div key={i} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-base sm:text-lg font-bold">
                        {val}
                      </div>
                    ))}
                    {playState.diceResult.length > 1 && (
                      <span className="text-xs text-muted">= {playState.diceResult.reduce((a, b) => a + b, 0)}</span>
                    )}
                  </div>
                )}

                <button
                  onClick={handleDrawEvent}
                  disabled={playState.isPaused || playState.isGameOver}
                  className="flex items-center gap-1 px-3 py-2 border border-border rounded-xl text-xs sm:text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <span className="material-icons" style={{ fontSize: 18 }}>style</span>
                  <span className="hidden sm:inline">{t('play.drawEvent')}</span>
                </button>

                {!playState.isAutoMode && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => movePlayer(-1)} className="px-2 py-1.5 border border-border rounded-lg text-xs hover:bg-slate-50">
                      <span className="material-icons" style={{ fontSize: 14 }}>arrow_back</span>
                    </button>
                    <button onClick={() => movePlayer(1)} className="px-2 py-1.5 border border-border rounded-lg text-xs hover:bg-slate-50">
                      <span className="material-icons" style={{ fontSize: 14 }}>arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>

              {showEvent && playState.lastEventCard && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-primary/30 rounded-xl p-4 text-center max-w-xs">
                    <span className="text-3xl">{playState.lastEventCard.emoji}</span>
                    <h4 className="font-bold text-sm mt-1">{playState.lastEventCard.title}</h4>
                    <p className="text-xs text-muted">{playState.lastEventCard.mission}</p>
                    <p className={`text-sm font-bold mt-1 ${playState.lastEventCard.value >= 0 ? 'text-success' : 'text-danger'}`}>
                      {playState.lastEventCard.value >= 0 ? '+' : ''}{playState.lastEventCard.value} {settings.currency}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div>
          <div className="bg-white rounded-xl border border-border p-3 sm:p-4 space-y-3 sticky top-20">
            <h3 className="font-bold text-sm flex items-center gap-1">
              <span className="material-icons text-primary" style={{ fontSize: 18 }}>leaderboard</span>
              {t('play.scoreboard')}
            </h3>
            <div className="space-y-2">
              {[...playState.players]
                .sort((a, b) => b.score - a.score)
                .map((player, rank) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg border transition-all ${
                      player.isEliminated
                        ? 'bg-slate-50 border-border opacity-50'
                        : playState.currentPlayerIndex === player.id
                        ? 'bg-primary/5 border-primary/30'
                        : 'border-border'
                    }`}
                  >
                    <span className="text-xs font-mono text-muted w-4">{rank + 1}</span>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shrink-0" style={{ backgroundColor: player.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium truncate">
                          {player.name}{player.isEliminated && ' ✗'}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold">{player.score} {settings.currency}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-muted mt-0.5">
                        <span>{t('play.position')}: {player.position}</span>
                        <span>{t('play.laps')}: {player.laps}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-2 border-t border-border space-y-1 text-[11px] text-muted">
              <div className="flex justify-between">
                <span>{t('settings.gameOverCondition')}</span>
                <span>{t(`settings.conditions.${settings.gameOverCondition}`)}</span>
              </div>
              {settings.gameOverCondition !== 'survival' && (
                <div className="flex justify-between">
                  <span>{t('settings.conditionValue')}</span>
                  <span>{settings.conditionValue}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('settings.lapReward')}</span>
                <span>{settings.lapReward} {settings.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
