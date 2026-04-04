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
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">grid_on</span>
          <h2 className="text-lg sm:text-xl font-bold">{t('board.title')}</h2>
          <span className="text-xs text-muted bg-slate-100 px-2 py-0.5 rounded-full">
            {tiles.length} tiles · {boardWidth}×{boardHeight}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={regenerateTiles}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons" style={{ fontSize: 16 }}>refresh</span>
            <span className="hidden sm:inline">{t('board.autoGenerate')}</span>
          </button>
          <button
            onClick={shuffleTiles}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            <span className="material-icons" style={{ fontSize: 16 }}>shuffle</span>
            {t('board.shuffle')}
          </button>
        </div>
      </div>

      {/* Multiplier Ratio */}
      <div className="bg-white rounded-xl border border-border p-3 sm:p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium">{t('board.multiplierRatio')}</label>
            <p className="text-xs text-muted">
              T1 × {settings.multiplierRatio.toFixed(1)} = T2 · T2 × {settings.multiplierRatio.toFixed(1)} = Full
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
              className="w-28 sm:w-32 accent-primary"
            />
            <span className="text-sm font-mono font-bold text-primary w-10 text-center">
              ×{settings.multiplierRatio.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Visual Board (WYSIWYG) */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 rounded-xl border border-border p-3 sm:p-4">
            <div className="board-wrapper">
              <div
                className="grid gap-1 sm:gap-1.5 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
                  maxWidth: Math.min(boardWidth * 80, 600),
                }}
              >
                {grid.map((row, r) =>
                  row.map((tileIdx, c) => {
                    if (tileIdx === null) {
                      // Inner empty cell
                      return (
                        <div
                          key={`${r}-${c}`}
                          className="aspect-square rounded-md"
                        />
                      );
                    }

                    const tile = tiles[tileIdx];
                    if (!tile) return <div key={`${r}-${c}`} />;

                    const isSelected = tile.id === selectedTileId;

                    return (
                      <button
                        key={tile.id}
                        onClick={() => setSelectedTileId(isSelected ? null : tile.id)}
                        className={`board-tile aspect-square rounded-md sm:rounded-lg border-2 flex flex-col items-center justify-center p-0.5 sm:p-1 text-center transition-all cursor-pointer ${getTileColor(tile, tileIdx)} ${
                          isSelected ? 'ring-2 ring-primary ring-offset-1 border-primary scale-105 z-10' : ''
                        }`}
                      >
                        <span className="text-[7px] sm:text-[9px] font-semibold leading-tight line-clamp-1 w-full">
                          {tile.name}
                        </span>
                        {tile.tier1 > 0 && (
                          <span className="text-[6px] sm:text-[8px] text-muted font-mono">
                            {tile.tier1}
                          </span>
                        )}
                        {tile.isFixed && (
                          <span className="material-icons text-warning" style={{ fontSize: 8 }}>lock</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">
              {t('board.tileNamePlaceholder')} — click a tile to edit
            </p>
          </div>
        </div>

        {/* Edit Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-border p-4 sticky top-20 space-y-4">
            {selectedTile ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center gap-1.5">
                    <span className="material-icons text-primary" style={{ fontSize: 18 }}>edit</span>
                    Tile #{selectedIdx + 1}
                  </h3>
                  <button
                    onClick={() => setSelectedTileId(null)}
                    className="p-1 rounded hover:bg-slate-100"
                  >
                    <span className="material-icons text-muted" style={{ fontSize: 18 }}>close</span>
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">{t('board.tileName')}</label>
                  <input
                    type="text"
                    value={selectedTile.name}
                    onChange={(e) => updateTile(selectedTile.id, { name: e.target.value })}
                    placeholder={t('board.tileNamePlaceholder')}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Fixed/Movable Toggle */}
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    {t('board.fixed')} / {t('board.movable')}
                  </label>
                  <button
                    onClick={() => updateTile(selectedTile.id, { isFixed: !selectedTile.isFixed })}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all ${
                      selectedTile.isFixed
                        ? 'border-warning bg-warning/10 text-warning'
                        : 'border-border bg-slate-50 text-muted hover:border-muted'
                    }`}
                  >
                    <span className="material-icons" style={{ fontSize: 16 }}>
                      {selectedTile.isFixed ? 'lock' : 'lock_open'}
                    </span>
                    {selectedTile.isFixed ? t('board.fixed') : t('board.movable')}
                  </button>
                </div>

                {/* Tier Costs */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">{t('board.tier1')}</label>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={selectedTile.tier1}
                      onChange={(e) => {
                        const val = Math.round((parseInt(e.target.value) || 0) / 10) * 10;
                        updateTile(selectedTile.id, { tier1: Math.max(0, val) });
                      }}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-muted mb-0.5">
                        {t('board.tier2')} <span className="text-[9px]">({t('board.autoCalculated')})</span>
                      </label>
                      <div className="px-3 py-2 border border-border rounded-lg text-sm text-center bg-slate-50 text-muted font-mono">
                        {selectedTile.tier2}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted mb-0.5">
                        {t('board.fullControl')} <span className="text-[9px]">({t('board.autoCalculated')})</span>
                      </label>
                      <div className="px-3 py-2 border border-border rounded-lg text-sm text-center bg-slate-50 text-muted font-mono">
                        {selectedTile.fullControl}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <span className="material-icons text-muted/40" style={{ fontSize: 48 }}>touch_app</span>
                <p className="text-sm text-muted mt-2">Select a tile on the board to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
