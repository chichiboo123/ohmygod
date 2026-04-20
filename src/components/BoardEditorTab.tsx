'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore, Tile } from '@/store/gameStore';
import { createBoardGrid } from '@/store/boardLayout';
import { useState } from 'react';

export default function BoardEditorTab() {
  const { t } = useTranslation();
  const {
    settings,
    tiles,
    updateSettings,
    updateTile,
    shuffleTiles,
    regenerateTiles,
  } = useGameStore();

  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const selectedTile = tiles.find((t) => t.id === selectedTileId) || null;
  const selectedIdx = selectedTile ? tiles.indexOf(selectedTile) : -1;

  const { boardWidth, boardHeight } = settings;
  const grid = createBoardGrid(boardWidth, boardHeight);

  const getTileColor = (tile: Tile, idx: number) => {
    if (idx === 0) return 'bg-amber-200 border-amber-400';
    if (tile.isFixed) return 'bg-amber-100 border-amber-300';
    return 'bg-white border-border hover:border-primary/50';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🗺️</span>
          <div>
            <h2 className="font-title text-2xl text-primary">{t('board.title')}</h2>
            <p className="text-sm text-muted">
              보드판의 칸을 눌러서 이름과 비용을 바꿔봐요!
              <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                {tiles.length}칸 · {boardWidth}×{boardHeight}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={regenerateTiles}
            className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-border hover:bg-slate-50 transition-colors"
          >
            <span className="text-lg">🔄</span>
            <span className="hidden sm:inline">자동 생성</span>
          </button>
          <button
            onClick={shuffleTiles}
            className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-md"
          >
            <span className="text-lg">🔀</span>
            랜덤 섞기
          </button>
        </div>
      </div>

      {/* Cost Multiplier */}
      <div className="bg-white rounded-2xl border-2 border-border p-4 card-fun">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bold text-sm">📈 비용 배율</p>
            <p className="text-xs text-muted mt-0.5">
              1단계 비용을 기준으로 2단계, 완전지배 비용이 자동으로 계산돼요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1.1}
              max={3.0}
              step={0.1}
              value={settings.multiplierRatio}
              onChange={(e) => updateSettings({ multiplierRatio: parseFloat(e.target.value) })}
              className="w-28 sm:w-36 accent-primary"
            />
            <span className="text-lg font-bold text-primary w-14 text-center bg-primary-light px-2 py-1 rounded-lg">
              ×{settings.multiplierRatio.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Visual Board */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-border p-4">
            <div className="board-wrapper">
              <div
                className="grid gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
                  maxWidth: Math.min(boardWidth * 88, 640),
                }}
              >
                {grid.map((row, r) =>
                  row.map((tileIdx, c) => {
                    if (tileIdx === null) {
                      return <div key={`${r}-${c}`} className="aspect-square rounded-lg" />;
                    }

                    const tile = tiles[tileIdx];
                    if (!tile) return <div key={`${r}-${c}`} />;

                    const isSelected = tile.id === selectedTileId;

                    return (
                      <button
                        key={tile.id}
                        onClick={() => setSelectedTileId(isSelected ? null : tile.id)}
                        className={`board-tile aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-0.5 sm:p-1 text-center transition-all cursor-pointer ${getTileColor(tile, tileIdx)} ${
                          isSelected ? 'ring-3 ring-primary ring-offset-2 border-primary scale-110 z-10 shadow-lg' : ''
                        }`}
                      >
                        <span className="text-[8px] sm:text-[10px] font-bold leading-tight line-clamp-2 w-full text-center">
                          {tileIdx === 0 ? '🏁' : tile.name}
                        </span>
                        {tile.tier1 > 0 && (
                          <span className="text-[7px] sm:text-[9px] text-slate-500 font-mono">
                            {tile.tier1}
                          </span>
                        )}
                        {tile.isFixed && tileIdx !== 0 && (
                          <span className="text-[8px]">🔒</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <p className="text-xs text-muted text-center mt-3 font-medium">
              👆 칸을 눌러서 이름과 비용을 편집해보세요!
            </p>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border-2 border-border p-4 sticky top-20 space-y-4 card-fun">
            {selectedTile ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span className="text-xl">✏️</span>
                    {selectedIdx + 1}번 칸 편집
                  </h3>
                  <button
                    onClick={() => setSelectedTileId(null)}
                    className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    🏷️ 칸 이름
                  </label>
                  <input
                    type="text"
                    value={selectedTile.name}
                    onChange={(e) => updateTile(selectedTile.id, { name: e.target.value })}
                    placeholder="칸 이름을 써봐요"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Fixed/Movable Toggle */}
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    🔒 칸 종류
                  </label>
                  <button
                    onClick={() => updateTile(selectedTile.id, { isFixed: !selectedTile.isFixed })}
                    className={`btn-bounce w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedTile.isFixed
                        ? 'border-warning bg-warning/10 text-warning'
                        : 'border-border bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">{selectedTile.isFixed ? '🔒' : '🔓'}</span>
                    {selectedTile.isFixed ? '고정 칸 (섞여도 안 움직여요)' : '일반 칸 (랜덤으로 섞여요)'}
                  </button>
                </div>

                {/* Tier Costs */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-600">💰 구매 비용</label>
                  <div>
                    <p className="text-xs text-muted mb-1.5 font-medium">1단계 비용 (처음 살 때)</p>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={selectedTile.tier1}
                      onChange={(e) => {
                        const val = Math.round((parseInt(e.target.value) || 0) / 10) * 10;
                        updateTile(selectedTile.id, { tier1: Math.max(0, val) });
                      }}
                      className="w-full px-4 py-3 border-2 border-border rounded-xl text-base text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted mb-1.5 font-medium">2단계 비용 (자동 계산)</p>
                      <div className="px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-base text-center bg-slate-50 text-slate-400 font-bold">
                        {selectedTile.tier2}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1.5 font-medium">독점 비용 (자동 계산)</p>
                      <div className="px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-base text-center bg-slate-50 text-slate-400 font-bold">
                        {selectedTile.fullControl}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl block mb-3">👆</span>
                <p className="text-base font-bold text-slate-500">보드판에서 칸을 눌러보세요!</p>
                <p className="text-sm text-muted mt-1">이름과 비용을 편집할 수 있어요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
