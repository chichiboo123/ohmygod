'use client';

import { useTranslation } from 'react-i18next';
import { useGameStore } from '@/store/gameStore';
import { useRef, useState } from 'react';

export default function ExportImport() {
  const { t } = useTranslation();
  const { exportJSON, importJSON, getShareableState } = useGameStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

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
        text: success ? t('export.importSuccess') : t('export.importError'),
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
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h3 className="font-bold text-sm flex items-center gap-1 mb-3">
        <span className="material-icons text-primary" style={{ fontSize: 18 }}>
          import_export
        </span>
        {t('export.exportTitle')}
      </h3>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons" style={{ fontSize: 16 }}>download</span>
          {t('export.exportJSON')}
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons" style={{ fontSize: 16 }}>upload</span>
          {t('export.importJSON')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleShareLink}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
        >
          <span className="material-icons" style={{ fontSize: 16 }}>
            {copied ? 'check' : 'link'}
          </span>
          {copied ? t('export.copied') : t('export.shareLink')}
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 text-xs px-3 py-1.5 rounded-lg ${
            message.type === 'success'
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
