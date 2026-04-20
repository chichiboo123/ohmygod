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
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-border p-4">
      <h3 className="font-bold text-sm flex items-center gap-2 mb-3 text-slate-600">
        <span className="text-lg">📦</span>
        게임 저장 / 불러오기
      </h3>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-border hover:bg-slate-50 transition-colors"
        >
          <span>💾</span>
          저장하기
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-border hover:bg-slate-50 transition-colors"
        >
          <span>📂</span>
          불러오기
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
          className="btn-bounce flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
        >
          <span>{copied ? '✅' : '🔗'}</span>
          {copied ? '복사됐어요!' : '링크 공유'}
        </button>
      </div>

      {message && (
        <div
          className={`mt-3 text-sm px-4 py-2.5 rounded-xl font-medium ${
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
