function LuminaArcIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="#F59E0B" />
      <line x1="4" y1="26" x2="28" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function RightBar() {
  return (
    <aside
      className="fixed right-0 top-0 h-screen w-14 z-50 flex flex-col items-center py-7 gap-4"
      style={{
        backgroundColor: 'var(--color-primary)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Ícone */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <LuminaArcIcon size={22} />
      </div>

      {/* Linha separadora */}
      <div className="w-5 flex-shrink-0" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Nome vertical */}
      <span
        className="text-white font-outfit font-bold tracking-[0.35em] text-sm flex-1 flex items-center select-none"
        style={{ writingMode: 'vertical-lr' }}
      >
        LUMINA
      </span>

      {/* Ponto âmbar */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: '#F59E0B' }}
      />
    </aside>
  );
}
