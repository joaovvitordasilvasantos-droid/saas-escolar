import React from 'react';

export default function Placeholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed">
      <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">construction</span>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-500 mt-2">Esta tela está em desenvolvimento e será migrada em breve.</p>
    </div>
  );
}
