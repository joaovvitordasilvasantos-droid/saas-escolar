import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

const BIMESTRES = [
  { label: '1º Bim', value: '1º Bimestre' },
  { label: '2º Bim', value: '2º Bimestre' },
  { label: '3º Bim', value: '3º Bimestre' },
  { label: '4º Bim', value: '4º Bimestre' },
];

const AULAS_POR_DISCIPLINA = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNota(valor) {
  const n = parseFloat(valor);
  return isNaN(n) ? null : n;
}

function getNotaCor(nota) {
  if (nota === null) return '#94A3B8';
  if (nota >= 7.5) return '#0FA77B';
  if (nota >= 6.0) return '#F59E0B';
  return '#EF4444';
}

function getNotaBadge(nota) {
  if (nota === null) return null;
  if (nota >= 9.0) return { label: 'ótimo', bg: '#D1FAE5', cor: '#065F46' };
  if (nota >= 7.5) return { label: 'bom', bg: '#D1FAE5', cor: '#065F46' };
  if (nota >= 6.0) return { label: 'regular', bg: '#FEF3C7', cor: '#92400E' };
  return { label: 'atenção', bg: '#FEE2E2', cor: '#991B1B' };
}

function calcMedia(notasAluno) {
  const vals = notasAluno.map(n => parseNota(n.valor)).filter(v => v !== null);
  if (!vals.length) return null;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function calcFreq(notasAluno) {
  if (!notasAluno.length) return null;
  const totalAulas = notasAluno.length * AULAS_POR_DISCIPLINA;
  const totalFaltas = notasAluno.reduce((s, n) => s + (parseInt(n.faltas) || 0), 0);
  return Math.max(0, ((totalAulas - totalFaltas) / totalAulas) * 100);
}

function calcAtividades(atividadesAluno) {
  const total = atividadesAluno.length;
  const entregues = atividadesAluno.filter(
    a => a.statusEntrega === 'Entregue no prazo' || a.statusEntrega === 'Entregue com atraso'
  ).length;
  return { entregues, total };
}

function getSituacao(media, freq) {
  if (media === null && freq === null) return null;
  const m = media ?? 0;
  const f = freq ?? 100;
  if (m >= 7 && f >= 75) return { label: '✅ Aprovado', short: 'ótimo', bg: 'rgba(15,167,123,0.15)', cor: '#0FA77B' };
  if (m < 5 || f < 60) return { label: '🔴 Risco', short: 'risco', bg: 'rgba(239,68,68,0.15)', cor: '#EF4444' };
  return { label: '🟡 Atenção', short: 'atenção', bg: 'rgba(245,158,11,0.15)', cor: '#F59E0B' };
}

function iniciais(nome) {
  if (!nome) return '?';
  const parts = nome.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

// ─── Ícone Lumina ──────────────────────────────────────────────────────────────

function LuminaArcSmall() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="#F59E0B" />
    </svg>
  );
}

// ─── Estado Vazio ──────────────────────────────────────────────────────────────

function EstadoVazio({ icone = 'person_search', texto = 'Selecione um aluno para ver o desempenho' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#F8FAFF', borderRadius: 12, border: '1px solid #E2E8F0', gap: 12 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#CBD5E1' }}>{icone}</span>
      <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>{texto}</p>
    </div>
  );
}

// ─── Métrica do Banner ─────────────────────────────────────────────────────────

function Metrica({ valor, label, cor }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <p style={{ color: cor, fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{valor}</p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, marginTop: 2 }}>{label}</p>
    </div>
  );
}

// ─── Seção 2 · Banner do Aluno ────────────────────────────────────────────────

function BannerAluno({ aluno, turmaNome, bimestreLabel, notasAluno, atividadesAluno }) {
  const media = calcMedia(notasAluno);
  const freq = calcFreq(notasAluno);
  const { entregues, total: totalAtv } = calcAtividades(atividadesAluno);
  const situacao = getSituacao(media, freq);

  return (
    <div style={{ background: 'linear-gradient(135deg, #1A3C6E, #2A5298)', borderRadius: 16, padding: '1.5rem', position: 'relative', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      {situacao && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.3rem 0.75rem', borderRadius: 8, background: situacao.bg, color: situacao.cor, fontSize: 13, fontWeight: 700 }}>
          {situacao.label}
        </div>
      )}

      {/* Avatar + Nome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#F59E0B', fontSize: 20, fontWeight: 700 }}>{iniciais(aluno.nome)}</span>
        </div>
        <div>
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>{aluno.nome}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{turmaNome} · {bimestreLabel}</p>
        </div>
      </div>

      {/* Métricas */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginLeft: 'auto', flexWrap: 'wrap', paddingRight: situacao ? '8rem' : '1rem' }}>
        <Metrica valor={media !== null ? media.toFixed(1) : '—'} label="média geral" cor="#F59E0B" />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', margin: '0 1.25rem', height: 40 }} />
        <Metrica valor={freq !== null ? freq.toFixed(0) + '%' : '—'} label="frequência" cor="#0FA77B" />
        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', margin: '0 1.25rem', height: 40 }} />
        <Metrica valor={totalAtv > 0 ? `${entregues}/${totalAtv}` : '—'} label="atividades" cor="#fff" />
      </div>
    </div>
  );
}

// ─── Seção 3 · Boletim Visual ─────────────────────────────────────────────────

function BoletimVisual({ aluno, notasAluno, bimestreLabel }) {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const disciplinas = [...new Set(notasAluno.map(n => n.disciplina))].sort();
  const freq = calcFreq(notasAluno);

  const copiarResumo = () => {
    const media = calcMedia(notasAluno);
    const linhas = [`Boletim de ${aluno.nome} — ${bimestreLabel}`, ''];
    disciplinas.forEach(d => {
      const n = notasAluno.find(x => x.disciplina === d);
      const val = parseNota(n?.valor);
      linhas.push(`${d}: ${val !== null ? val.toFixed(1) : '—'}`);
    });
    if (freq !== null) linhas.push(`\nFrequência: ${freq.toFixed(0)}%`);
    if (media !== null) linhas.push(`Média Geral: ${media.toFixed(1)}`);
    navigator.clipboard.writeText(linhas.join('\n'));
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header navy */}
      <div style={{ background: '#1A3C6E', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LuminaArcSmall />
        <span style={{ color: '#fff', letterSpacing: 2, fontSize: 13, fontWeight: 700 }}>LUMINA</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginLeft: 'auto' }}>Emitido em {hoje}</span>
      </div>

      {/* Corpo */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {disciplinas.length === 0 && (
          <p style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: '1rem 0', margin: 0 }}>
            Nenhuma nota lançada neste bimestre.
          </p>
        )}

        {disciplinas.map(d => {
          const n = notasAluno.find(x => x.disciplina === d);
          const val = parseNota(n?.valor);
          const badge = getNotaBadge(val);
          const cor = getNotaCor(val);
          const pct = val !== null ? (val / 10) * 100 : 0;

          return (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <span style={{ width: 110, fontSize: 13, color: '#1E293B', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d}
              </span>
              <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ width: 36, textAlign: 'right', fontSize: 14, fontWeight: 700, color: cor, flexShrink: 0 }}>
                {val !== null ? val.toFixed(1) : '—'}
              </span>
              {badge ? (
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.cor, flexShrink: 0, minWidth: 54, textAlign: 'center' }}>
                  {badge.label}
                </span>
              ) : (
                <span style={{ minWidth: 54 }} />
              )}
            </div>
          );
        })}

        {disciplinas.length > 0 && (
          <div style={{ height: 1, background: '#E2E8F0', margin: '0.5rem 0' }} />
        )}

        {/* Linha de frequência */}
        {freq !== null && (() => {
          const freqBadge = freq >= 75
            ? { label: 'ok', bg: '#D1FAE5', cor: '#065F46' }
            : { label: 'atenção', bg: '#FEE2E2', cor: '#991B1B' };
          const freqCor = freq >= 75 ? '#0FA77B' : freq >= 60 ? '#F59E0B' : '#EF4444';
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <span style={{ width: 110, fontSize: 13, color: '#1E293B', fontWeight: 500, flexShrink: 0 }}>Frequência</span>
              <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${freq}%`, height: '100%', background: freqCor, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ width: 36, textAlign: 'right', fontSize: 14, fontWeight: 700, color: freqCor, flexShrink: 0 }}>
                {freq.toFixed(0)}%
              </span>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: 11, fontWeight: 700, background: freqBadge.bg, color: freqBadge.cor, flexShrink: 0, minWidth: 54, textAlign: 'center' }}>
                {freqBadge.label}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Rodapé */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem' }}>
        <BotaoRodape icone="print" label="Imprimir" onClick={() => window.print()} />
        <BotaoRodape icone="content_copy" label="Copiar resumo" onClick={copiarResumo} />
      </div>
    </div>
  );
}

function BotaoRodape({ icone, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', border: '1px solid #E2E8F0', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#1E293B' }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFF'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icone}</span>
      {label}
    </button>
  );
}

// ─── Seção 4 · Painel da Turma ────────────────────────────────────────────────

function CardMetrica({ valor, label, cor }) {
  return (
    <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
      <p style={{ fontSize: 24, fontWeight: 500, color: cor, margin: 0 }}>{valor}</p>
      <p style={{ fontSize: 12, color: '#64748B', margin: 0, marginTop: 4 }}>{label}</p>
    </div>
  );
}

function PainelTurma({ turmaAlunos, notas, atividades, bimestreValue }) {
  const turmaData = turmaAlunos.map(aluno => {
    const notasAluno = notas.filter(n => n.alunoId === aluno.id && n.periodo === bimestreValue);
    const atividadesAluno = atividades.filter(a => a.alunoId === aluno.id);
    const media = calcMedia(notasAluno);
    const freq = calcFreq(notasAluno);
    const { entregues, total } = calcAtividades(atividadesAluno);
    const situacao = getSituacao(media, freq);
    return { aluno, media, freq, entregues, total, situacao };
  });

  const totalAlunos = turmaAlunos.length;

  const mediaTurma = (() => {
    const vs = turmaData.map(d => d.media).filter(v => v !== null);
    return vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : null;
  })();

  const freqMedia = (() => {
    const vs = turmaData.map(d => d.freq).filter(v => v !== null);
    return vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : null;
  })();

  const emAtencao = turmaData.filter(
    d => (d.media !== null && d.media < 6) || (d.freq !== null && d.freq < 75)
  ).length;

  const colStyle = { fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 };
  const gridCols = '1fr 70px 70px 100px 90px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: '#1A3C6E', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
        Painel da Turma
      </p>

      {/* Cards métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        <CardMetrica valor={totalAlunos} label="total de alunos" cor="#1A3C6E" />
        <CardMetrica valor={mediaTurma !== null ? mediaTurma.toFixed(1) : '—'} label="média da turma" cor="#F59E0B" />
        <CardMetrica valor={freqMedia !== null ? freqMedia.toFixed(0) + '%' : '—'} label="frequência média" cor="#0FA77B" />
        <CardMetrica valor={emAtencao} label="em atenção" cor="#EF4444" />
      </div>

      {/* Tabela de alunos */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ background: '#F8FAFF', padding: '10px 16px', display: 'grid', gridTemplateColumns: gridCols, gap: 8, borderBottom: '1px solid #E2E8F0' }}>
          {['Aluno', 'Média', 'Freq.', 'Atividades', 'Status'].map(h => (
            <p key={h} style={colStyle}>{h}</p>
          ))}
        </div>

        {turmaData.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8', fontSize: 13, margin: 0 }}>
            Nenhum aluno cadastrado nesta turma.
          </p>
        ) : (
          turmaData.map(({ aluno, media, freq, entregues, total, situacao }) => {
            const freqCor = freq === null ? '#94A3B8' : freq >= 75 ? '#0FA77B' : freq >= 60 ? '#F59E0B' : '#EF4444';
            return (
              <div
                key={aluno.id}
                style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 8, padding: '12px 16px', borderBottom: '0.5px solid #E2E8F0', alignItems: 'center' }}
              >
                <span style={{ fontSize: 13, color: '#1E293B', fontWeight: 500 }}>{aluno.nome}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: media !== null ? getNotaCor(media) : '#94A3B8' }}>
                  {media !== null ? media.toFixed(1) : '—'}
                </span>
                <span style={{ fontSize: 13, color: freqCor }}>
                  {freq !== null ? freq.toFixed(0) + '%' : '—'}
                </span>
                <span style={{ fontSize: 13, color: '#64748B' }}>
                  {total > 0 ? `${entregues}/${total}` : '—'}
                </span>
                {situacao ? (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, background: situacao.bg, color: situacao.cor, textAlign: 'center' }}>
                    {situacao.short}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: '#CBD5E1' }}>—</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Desempenho() {
  const { alunos, turmas, notas, atividades } = useData();

  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [selectedBimestre, setSelectedBimestre] = useState('1º Bimestre');

  const handleSelectAluno = (id) => {
    setSelectedAlunoId(id);
    if (id) {
      const aluno = alunos.find(a => a.id === id);
      if (aluno?.turmaId) setSelectedTurmaId(aluno.turmaId);
    }
  };

  const alunosFiltrados = selectedTurmaId
    ? alunos.filter(a => a.turmaId === selectedTurmaId)
    : alunos;

  const alunoSelecionado = alunos.find(a => a.id === selectedAlunoId);
  const turmaSelecionada = turmas.find(t => t.id === selectedTurmaId);

  const notasAluno = useMemo(
    () => selectedAlunoId && selectedBimestre
      ? notas.filter(n => n.alunoId === selectedAlunoId && n.periodo === selectedBimestre)
      : [],
    [notas, selectedAlunoId, selectedBimestre]
  );

  const atividadesAluno = useMemo(
    () => selectedAlunoId ? atividades.filter(a => a.alunoId === selectedAlunoId) : [],
    [atividades, selectedAlunoId]
  );

  const turmaAlunos = useMemo(
    () => selectedTurmaId ? alunos.filter(a => a.turmaId === selectedTurmaId) : [],
    [alunos, selectedTurmaId]
  );

  const bimestreLabel = BIMESTRES.find(b => b.value === selectedBimestre)?.label ?? selectedBimestre;

  const selectStyle = {
    flex: 1,
    minWidth: 140,
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: '0.5rem 0.75rem',
    fontSize: 14,
    color: '#1E293B',
    background: '#fff',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div className="py-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Desempenho</h1>
        <p className="text-on-surface-variant font-inter">Acompanhe notas, frequência e atividades por aluno e turma.</p>
      </div>

      {/* Seção 1 · Barra de Seleção */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select
          value={selectedTurmaId}
          onChange={e => { setSelectedTurmaId(e.target.value); setSelectedAlunoId(''); }}
          style={selectStyle}
        >
          <option value="">Todas as turmas</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>

        <select
          value={selectedAlunoId}
          onChange={e => handleSelectAluno(e.target.value)}
          style={{ ...selectStyle, flex: 2, minWidth: 200 }}
        >
          <option value="">Selecionar aluno...</option>
          {alunosFiltrados.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>

        <select
          value={selectedBimestre}
          onChange={e => setSelectedBimestre(e.target.value)}
          style={selectStyle}
        >
          {BIMESTRES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>

      {/* Seções 2 e 3 · Banner + Boletim */}
      {!alunoSelecionado ? (
        <EstadoVazio />
      ) : (
        <>
          <BannerAluno
            aluno={alunoSelecionado}
            turmaNome={turmaSelecionada?.nome ?? '—'}
            bimestreLabel={bimestreLabel}
            notasAluno={notasAluno}
            atividadesAluno={atividadesAluno}
          />
          <BoletimVisual
            aluno={alunoSelecionado}
            notasAluno={notasAluno}
            bimestreLabel={bimestreLabel}
          />
        </>
      )}

      {/* Seção 4 · Painel da Turma */}
      {selectedTurmaId ? (
        <PainelTurma
          turmaAlunos={turmaAlunos}
          notas={notas}
          atividades={atividades}
          bimestreValue={selectedBimestre}
        />
      ) : (
        <EstadoVazio icone="groups" texto="Selecione uma turma para ver o painel completo" />
      )}
    </div>
  );
}
