'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useRef, useState } from 'react';

export default function ExportImport() {
  const { t } = useTranslation();
  const { exportJSON, importJSON, getShareableState } = useGameStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ohmygod-game.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importJSON(text);
      setMessage({
        type: success ? 'success' : 'error',
        text: success ? '✅ 게임을 불러왔어요!' : '❌ 파일이 올바르지 않아요.',
      });
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleShareLink = () => {
    const state = getShareableState();
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        if (shareInputRef.current) {
          shareInputRef.current.value = url;
          shareInputRef.current.select();
        }
        setMessage({
          type: 'error',
          text: t('export.copyFailed'),
        });
        setTimeout(() => setMessage(null), 4000);
      });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={t('export.exportTitle')}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="btn-bounce flex items-center justify-center w-11 h-11 rounded-xl border-2 border-border hover:bg-slate-50 transition-colors"
        title={t('export.exportTitle')}
      >
        <span className="text-lg">📦</span>
      </button>
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white rounded-xl border-2 border-border shadow-xl p-2 space-y-1">
            <button
              onClick={() => {
                handleExport();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50"
            >
              <span>💾</span>
              {t('export.saveGame')}
            </button>
            <button
              onClick={() => {
                fileRef.current?.click();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50"
            >
              <span>📂</span>
              {t('export.importJSON')}
            </button>
            <button
              onClick={() => {
                handleShareLink();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-light text-primary"
            >
              <span>{copied ? '✅' : '🔗'}</span>
              {copied ? t('export.copied') : t('export.shareLink')}
            </button>
          </div>
        </>
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <input
        ref={shareInputRef}
        readOnly
        aria-label={t('export.shareLink')}
        className="sr-only"
        placeholder={t('export.copyFallback')}
      />

      {message && (
        <div
          className={`absolute right-0 top-full mt-2 z-30 w-72 text-sm px-4 py-2.5 rounded-xl font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border-2 border-green-200'
              : 'bg-red-50 text-red-700 border-2 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
