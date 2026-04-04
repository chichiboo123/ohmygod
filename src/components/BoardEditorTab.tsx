'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';

export default function BoardEditorTab() {
  const { t } = useTranslation();
  const {
    settings,
    tiles,
    updateSettings,
    updateTile,
    addTile,
    removeTile,
    shuffleTiles,
    regenerateTiles,
  } = useGameStore();

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">grid_on</span>
          <h2 className="text-xl font-bold">{t('board.title')}</h2>
          <span className="text-xs text-muted bg-slate-100 px-2 py-0.5 rounded-full">
            {tiles.length} tiles
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={regenerateTiles}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons" style={{ fontSize: 16 }}>refresh</span>
            {t('board.autoGenerate')}
          </button>
          <button
            onClick={shuffleTiles}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            <span className="material-icons" style={{ fontSize: 16 }}>shuffle</span>
            {t('board.shuffle')}
          </button>
          <button
            onClick={addTile}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-success text-white hover:opacity-90 transition-colors"
          >
            <span className="material-icons" style={{ fontSize: 16 }}>add</span>
            {t('board.addTile')}
          </button>
        </div>
      </div>

      {/* Multiplier Ratio */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="text-sm font-medium">{t('board.multiplierRatio')}</label>
            <p className="text-xs text-muted">
              Tier 1 × {settings.multiplierRatio.toFixed(1)} = Tier 2 &nbsp;|&nbsp;
              Tier 2 × {settings.multiplierRatio.toFixed(1)} = Full Control
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
              className="w-32 accent-primary"
            />
            <span className="text-sm font-mono font-bold text-primary w-10 text-center">
              ×{settings.multiplierRatio.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((tile, idx) => (
          <div
            key={tile.id}
            className={`board-tile bg-white rounded-xl border-2 p-4 space-y-3 ${
              tile.isFixed ? 'border-warning bg-amber-50/50' : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted">#{idx + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateTile(tile.id, { isFixed: !tile.isFixed })}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    tile.isFixed
                      ? 'bg-warning/20 text-warning'
                      : 'bg-slate-100 text-muted hover:bg-slate-200'
                  }`}
                >
                  <span className="material-icons" style={{ fontSize: 12 }}>
                    {tile.isFixed ? 'lock' : 'lock_open'}
                  </span>
                  {tile.isFixed ? t('board.fixed') : t('board.movable')}
                </button>
                {!tile.isFixed && (
                  <button
                    onClick={() => removeTile(tile.id)}
                    className="p-0.5 rounded text-danger/60 hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <span className="material-icons" style={{ fontSize: 16 }}>delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <input
              type="text"
              value={tile.name}
              onChange={(e) => updateTile(tile.id, { name: e.target.value })}
              placeholder={t('board.tileNamePlaceholder')}
              className="w-full px-2.5 py-1.5 border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />

            {/* Costs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-muted mb-0.5">{t('board.tier1')}</label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={tile.tier1}
                  onChange={(e) => {
                    const val = Math.round((parseInt(e.target.value) || 0) / 10) * 10;
                    updateTile(tile.id, { tier1: Math.max(0, val) });
                  }}
                  className="w-full px-2 py-1 border border-border rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-[10px] text-muted mb-0.5">{t('board.tier2')}</label>
                <div className="w-full px-2 py-1 border border-border rounded text-xs text-center bg-slate-50 text-muted">
                  {tile.tier2}
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-muted mb-0.5">{t('board.fullControl')}</label>
                <div className="w-full px-2 py-1 border border-border rounded text-xs text-center bg-slate-50 text-muted">
                  {tile.fullControl}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
