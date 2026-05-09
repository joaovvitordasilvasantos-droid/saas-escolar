import { useMemo, useState } from 'react';

const SECTION_STYLES = {
  diagnostico: {
    keywords: ['DIAGNÓSTICO', 'SITUAÇÃO ATUAL', 'DIAGNOSE', 'SITUAÇÃO', 'RESUMO ACADÊMICO', 'RELATÓRIO PEDAGÓGICO'],
    emoji: '📊', bg: '#EFF6FF', border: '#1A3C6E',
    headerBg: '#DBEAFE', headerColor: '#1A3C6E', bulletColor: '#1A3C6E',
  },
  riscos: {
    keywords: ['RISCO', 'ALERTA', 'ATENÇÃO', 'ALERTAS'],
    emoji: '⚠️', bg: '#FEF2F2', border: '#EF4444',
    headerBg: '#FEE2E2', headerColor: '#991B1B', bulletColor: '#EF4444',
  },
  oportunidades: {
    keywords: ['OPORTUNIDADE', 'TENDÊNCIA', 'POSITIVO', 'DESENVOLVIMENTO PEDAGÓGICO'],
    emoji: '📈', bg: '#F0FDF4', border: '#0FA77B',
    headerBg: '#D1FAE5', headerColor: '#065F46', bulletColor: '#0FA77B',
  },
  acoes: {
    keywords: ['AÇÃO', 'AÇÕES', 'RECOMENDAÇÃO', 'RECOMENDAÇÕES', 'PASSO A PASSO', 'PRIORITÁRIA'],
    emoji: '🎯', bg: '#FFFBEB', border: '#F59E0B',
    headerBg: '#FEF3C7', headerColor: '#92400E', bulletColor: '#F59E0B',
  },
  dica: {
    keywords: ['DICA', 'INSIGHT', 'EXTRA'],
    emoji: '💡', bg: '#F5F3FF', border: '#8B5CF6',
    headerBg: '#EDE9FE', headerColor: '#5B21B6', bulletColor: '#8B5CF6',
  },
  orientacao: {
    keywords: ['ORIENTAÇÃO PRINCIPAL', 'ORIENTAÇÃO'],
    emoji: '🎯', bg: '#EFF6FF', border: '#1A3C6E',
    headerBg: '#DBEAFE', headerColor: '#1A3C6E', bulletColor: '#1A3C6E',
  },
  default: {
    keywords: [],
    emoji: '📋', bg: '#F8FAFF', border: '#E2E8F0',
    headerBg: '#F1F5F9', headerColor: '#475569', bulletColor: '#64748B',
  },
};

function detectSectionStyle(title) {
  const upper = title.toUpperCase();
  for (const [, style] of Object.entries(SECTION_STYLES)) {
    if (style.keywords.some(kw => upper.includes(kw))) return style;
  }
  return SECTION_STYLES.default;
}

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 600, color: '#1A3C6E' }}>{part}</strong>
      : part
  );
}

function cleanListPrefix(line) {
  return line.replace(/^[\s]*[-*•]\s+/, '').replace(/^[\s]*\d+\.\s+/, '').trim();
}

function isListItem(line) {
  return /^[\s]*[-*•]\s+/.test(line);
}

function isSectionHeader(line) {
  if (!line.trim()) return false;
  if (/^#{1,3}\s/.test(line)) return true;
  // qualquer emoji no início (range amplo)
  if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s/u.test(line)) return true;
  // linha numerada "1. TEXTO EM MAIÚSCULAS"
  if (/^\d+\.\s+[A-ZÁÀÂÃÉÊÍÓÔÚÇ][A-ZÁÀÂÃÉÊÍÓÔÚÇ ]{2,}:?\s*$/.test(line)) return true;
  // linha toda em maiúsculas com mais de uma palavra OU terminando em ":"
  if (/^[A-ZÁÀÂÃÉÊÍÓÔÚÇ][A-ZÁÀÂÃÉÊÍÓÔÚÇ ]{3,}:?\s*$/.test(line)) {
    const t = line.trim();
    if (t.includes(' ') || t.endsWith(':')) return true;
  }
  return false;
}

function cleanSectionTitle(line) {
  return line
    .replace(/^#{1,3}\s+/, '')
    .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s+/u, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/:$/, '')
    .trim();
}

function parseTextToSections(texto) {
  if (!texto) return [];
  const lines = texto.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || /^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      if (currentSection && currentSection.paragraphs.length > 0)
        currentSection.paragraphs.push(null);
      continue;
    }

    if (isSectionHeader(trimmed)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: cleanSectionTitle(trimmed),
        style: detectSectionStyle(cleanSectionTitle(trimmed)),
        items: [], paragraphs: [],
      };
    } else if (isListItem(trimmed)) {
      if (!currentSection)
        currentSection = { title: '', style: SECTION_STYLES.default, items: [], paragraphs: [] };
      currentSection.items.push(cleanListPrefix(trimmed));
    } else {
      if (!currentSection)
        currentSection = { title: '', style: SECTION_STYLES.default, items: [], paragraphs: [] };
      currentSection.paragraphs.push(trimmed);
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections.filter(s => s.items.length > 0 || s.paragraphs.filter(Boolean).length > 0 || s.title);
}

export function AILoading({ subtexto = 'Processando dados...' }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8FAFF, #EFF6FF)',
      border: '1px solid #BFDBFE', borderRadius: '16px',
      padding: '3rem 2rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '1.5rem', minHeight: '280px', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes luminaPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.55; transform:scale(0.9); }
        }
        @keyframes aiProgressBar {
          0% { width:0% }
          20% { width:30% }
          60% { width:70% }
          85% { width:88% }
          100% { width:95% }
        }
        @keyframes aiStepIn {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes aiSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
      `}</style>

      <div style={{ animation: 'luminaPulse 1.8s ease-in-out infinite' }}>
        <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
          <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="#1A3C6E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="28" cy="10" r="3.5" fill="#F59E0B"/>
          <line x1="4" y1="26" x2="28" y2="26" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1A3C6E', margin: 0 }}>
          Lumina IA está analisando...
        </p>
        <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0.25rem 0 0' }}>{subtexto}</p>
      </div>

      <div style={{ width: '100%', maxWidth: '260px', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #1A3C6E, #F59E0B)',
          borderRadius: '999px',
          animation: 'aiProgressBar 4s ease-out forwards',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignSelf: 'flex-start', paddingLeft: '1rem' }}>
        {[
          { label: 'Coletando dados',    delay: '0s',    icon: '✓', spin: false },
          { label: 'Analisando padrões', delay: '1s',    icon: '✓', spin: false },
          { label: 'Gerando insights',   delay: '2s',    icon: '⟳', spin: true  },
        ].map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.78rem', color: '#1A3C6E', fontWeight: 600,
            opacity: 0,
            animation: `aiStepIn 0.35s ease both`,
            animationDelay: step.delay,
          }}>
            <span style={{
              display: 'inline-block',
              animation: step.spin ? 'aiSpin 1s linear infinite' : 'none',
            }}>{step.icon}</span>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ section, index }) {
  const { style, title, items, paragraphs } = section;
  const hasItems = items.length > 0;
  const hasParagraphs = paragraphs.filter(Boolean).length > 0;

  return (
    <div style={{
      borderRadius: '12px', border: `1px solid ${style.border}`,
      marginBottom: '1rem', overflow: 'hidden',
      animation: 'aiCardIn 0.4s ease both',
      animationDelay: `${index * 80}ms`,
    }}>
      {title && (
        <div style={{
          padding: '0.65rem 1.25rem',
          backgroundColor: style.headerBg, color: style.headerColor,
          fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '1.5px', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1rem' }}>{style.emoji}</span>
          {title}
        </div>
      )}

      <div style={{ backgroundColor: style.bg }}>
        {hasParagraphs && (
          <div style={{ padding: hasItems ? '1rem 1.25rem 0.5rem' : '1rem 1.25rem' }}>
            {paragraphs.map((p, i) =>
              p === null
                ? <div key={i} style={{ height: '0.5rem' }} />
                : <p key={i} style={{ fontSize: '1rem', color: '#1E293B', lineHeight: 1.75, margin: 0, marginBottom: '0.4rem' }}>
                    {parseBold(p)}
                  </p>
            )}
          </div>
        )}

        {hasItems && (
          <ul style={{ listStyle: 'none', margin: 0, padding: '0.75rem 1.25rem 1rem' }}>
            {items.map((item, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.45rem 0',
                borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: style.bulletColor, flexShrink: 0, marginTop: '0.45rem',
                }} />
                <span style={{ fontSize: '1rem', color: '#1E293B', lineHeight: 1.65 }}>
                  {parseBold(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const TIPO_LABELS = {
  financeiro: 'Análise Financeira',
  predict:    'Análise Preditiva',
  coach:      'Orientação Pedagógica',
  boletim:    'Carta Pedagógica',
  relatorio:  'Relatório Pedagógico',
};

function ReportHeader({ tipo }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.6rem 1rem', borderRadius: '10px',
      backgroundColor: '#F8FAFF', border: '1px solid #E2E8F0', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
          <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="#1A3C6E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="28" cy="10" r="3.5" fill="#F59E0B"/>
        </svg>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A3C6E' }}>
          ✨ {TIPO_LABELS[tipo] || 'Análise'} gerada por Lumina IA
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
          {new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <span style={{
          fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px',
          padding: '2px 8px', borderRadius: '999px',
          backgroundColor: '#1A3C6E', color: '#FFFFFF',
        }}>IA</span>
      </div>
    </div>
  );
}

function ActionButtons({ texto, onSalvar }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(texto || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.45rem 0.9rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
    border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF',
    color: '#475569', transition: 'background 0.15s',
  };

  const hover = (e) => { e.currentTarget.style.backgroundColor = '#F8FAFF'; };
  const leave = (e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
      <button style={base} onMouseEnter={hover} onMouseLeave={leave} onClick={() => window.print()}>
        🖨️ Imprimir
      </button>
      <button
        style={{ ...base, color: copied ? '#0FA77B' : '#475569', borderColor: copied ? '#0FA77B' : '#E2E8F0' }}
        onMouseEnter={hover} onMouseLeave={leave} onClick={handleCopy}
      >
        {copied ? '✓ Copiado!' : '📋 Copiar'}
      </button>
      {onSalvar && (
        <button style={base} onMouseEnter={hover} onMouseLeave={leave} onClick={onSalvar}>
          💾 Salvar
        </button>
      )}
    </div>
  );
}

function BoletimCard({ texto, bimestre }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: '12px',
      border: '1px solid #E2E8F0', overflow: 'hidden',
      animation: 'aiCardIn 0.4s ease both',
    }}>
      {/* Cabeçalho timbrado */}
      <div style={{ padding: '1.5rem 1.75rem 1rem', backgroundColor: '#FAFBFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="#1A3C6E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="28" cy="10" r="3.5" fill="#F59E0B"/>
            </svg>
            <div>
              <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A3C6E', margin: 0, letterSpacing: '0.5px' }}>LUMINA</p>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '1px 0 0' }}>Gestão Pedagógica</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            {bimestre && <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '2px 0 0' }}>{bimestre}</p>}
          </div>
        </div>
        <div style={{ marginTop: '1rem', height: '2px', background: 'linear-gradient(90deg, #1A3C6E, #F59E0B 50%, #0FA77B)', borderRadius: '2px' }} />
      </div>

      <div style={{ padding: '1.5rem 1.75rem' }}>
        <p style={{
          fontSize: '1.05rem', color: '#1E293B', lineHeight: 1.85,
          fontFamily: 'Georgia, "Times New Roman", serif',
          whiteSpace: 'pre-wrap', margin: 0,
        }}>
          {texto}
        </p>
      </div>

      <div style={{ padding: '0.75rem 1.75rem 1.25rem', borderTop: '1px solid #F1F5F9', textAlign: 'right' }}>
        <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#64748B', margin: 0 }}>
          Equipe Pedagógica Lumina
        </p>
      </div>
    </div>
  );
}

export default function AIReportCard({ texto, tipo = 'relatorio', onSalvar, showActions = true, bimestre }) {
  const sections = useMemo(() => parseTextToSections(texto), [texto]);

  if (!texto) return null;

  return (
    <div>
      <style>{`
        @keyframes aiCardIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <ReportHeader tipo={tipo} />

      {tipo === 'boletim'
        ? <BoletimCard texto={texto} bimestre={bimestre} />
        : sections.map((section, i) => <SectionCard key={i} section={section} index={i} />)
      }

      {showActions && <ActionButtons texto={texto} onSalvar={onSalvar} />}
    </div>
  );
}
