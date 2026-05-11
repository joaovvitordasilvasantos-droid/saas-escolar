import { useState } from 'react';
import { useData } from '../context/DataContext';
import AIReportCard, { AILoading } from '../components/AIReportCard';

const PERIODOS = ['1º Bimestre', '2º Bimestre', '3º Bimestre', 'Ano completo'];

function callAnthropicAPI(prompt) {
  return fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }]
    })
  });
}

function RiscoSegmentos({ percentual }) {
  const nivel = percentual <= 30 ? 'baixo' : percentual <= 60 ? 'medio' : 'alto';
  const cor = percentual <= 30 ? '#0FA77B' : percentual <= 60 ? '#F59E0B' : '#EF4444';
  const segmentos = [
    { key: 'baixo', label: 'BAIXO', bg: '#D1FAE5', cor: '#0FA77B' },
    { key: 'medio', label: 'MÉDIO', bg: '#FEF3C7', cor: '#F59E0B' },
    { key: 'alto',  label: 'ALTO',  bg: '#FEE2E2', cor: '#EF4444' },
  ];

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {segmentos.map(s => (
          <div key={s.key} style={{
            flex: 1, padding: '0.4rem 0', borderRadius: '8px',
            backgroundColor: s.bg,
            opacity: nivel === s.key ? 1 : 0.3,
            transition: 'opacity 0.3s',
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: s.cor, letterSpacing: '1px', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.35rem 1.25rem', borderRadius: '999px',
        backgroundColor: cor + '22', border: `1.5px solid ${cor}`,
      }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: cor, lineHeight: 1 }}>{percentual}%</span>
      </div>
    </div>
  );
}

export default function LuminaPredict() {
  const { alunos, turmas, notas, atividades } = useData();
  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [periodo, setPeriodo] = useState('1º Bimestre');
  const [dadosSelecionados, setDadosSelecionados] = useState({
    frequencia: true,
    notas: true,
    atividades: true,
    financeiro: true,
  });
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [analisesSalvas, setAnalisesSalvas] = useState([]);

  const aluno = alunos.find(a => a.id === selectedAlunoId);
  const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;

  // Calcular índice de risco local
  const calcularRisco = () => {
    if (!aluno) return 0;
    let risco = 0;
    const notasAluno = notas.filter(n => n.alunoId === aluno.id && n.periodo === periodo);
    const atividadesAluno = atividades.filter(a => a.alunoId === aluno.id);

    if (dadosSelecionados.notas && notasAluno.length > 0) {
      const media = notasAluno.reduce((s, n) => s + parseFloat(n.valor || 0), 0) / notasAluno.length;
      if (media < 5) risco += 40;
      else if (media < 7) risco += 20;
    }

    if (dadosSelecionados.frequencia && notasAluno.length > 0) {
      const faltas = notasAluno.reduce((s, n) => s + parseInt(n.faltas || 0), 0);
      if (faltas > 15) risco += 30;
      else if (faltas > 8) risco += 15;
    }

    if (dadosSelecionados.atividades) {
      const naoEntregues = atividadesAluno.filter(a => a.statusEntrega === 'Não entregue' || a.statusEntrega === 'Entregue com atraso').length;
      if (naoEntregues > 3) risco += 20;
      else if (naoEntregues > 1) risco += 10;
    }

    return Math.min(100, risco);
  };

  const handleGerar = async () => {
    if (!selectedAlunoId) return alert('Selecione um aluno primeiro.');
    setLoading(true);
    setResultado(null);

    const notasAluno = notas.filter(n => n.alunoId === aluno.id && n.periodo === periodo);
    const atividadesAluno = atividades.filter(a => a.alunoId === aluno.id);
    const media = notasAluno.length > 0
      ? (notasAluno.reduce((s, n) => s + parseFloat(n.valor || 0), 0) / notasAluno.length).toFixed(1)
      : 'Sem dados';
    const faltas = notasAluno.reduce((s, n) => s + parseInt(n.faltas || 0), 0);
    const atividadesEntregues = atividadesAluno.filter(a => a.statusEntrega === 'Entregue no prazo').length;
    const indiceRisco = calcularRisco();

    const prompt = `Você é um especialista em pedagogia e análise de dados educacionais.
Com base nos dados fornecidos do aluno, gere uma análise preditiva estruturada em 4 seções:
1. SITUAÇÃO ATUAL: resumo objetivo em 2 linhas
2. TENDÊNCIA: o que deve acontecer se nada mudar (otimista/neutro/preocupante)
3. ALERTAS: liste de 2 a 4 pontos de atenção específicos
4. RECOMENDAÇÕES: liste de 3 a 5 ações concretas para professor e coordenação
Seja direto, humano e use linguagem que um coordenador pedagógico entenda.
NÃO use jargões técnicos de IA.

Dados do aluno:
- Nome: ${aluno.nome}
- Turma: ${turma?.nome || 'N/A'}
- Período: ${periodo}
- Média de notas: ${media}
- Total de faltas: ${faltas}
- Atividades entregues no prazo: ${atividadesEntregues} de ${atividadesAluno.length}
- Índice de risco calculado: ${indiceRisco}%
${dadosSelecionados.financeiro ? '- Histórico financeiro: verificar inadimplência com setor financeiro' : ''}
${observacoes ? `- Observações da coordenação: ${observacoes}` : ''}`;

    try {
      const response = await callAnthropicAPI(prompt);
      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      const texto = data.content[0].text;
      setResultado({ texto, indiceRisco, aluno: aluno.nome, periodo, data: new Date().toLocaleDateString('pt-BR') });
    } catch {
      const indiceRisco = calcularRisco();
      setResultado({
        texto: `⚠️ Não foi possível conectar à IA. Análise local gerada:\n\n1. SITUAÇÃO ATUAL\nAluno ${aluno.nome} com média ${media} e ${faltas} faltas no período ${periodo}.\n\n2. TENDÊNCIA\n${parseFloat(media) >= 7 ? 'Tendência positiva de aprovação.' : 'Risco de reprovação identificado.'}\n\n3. ALERTAS\n• Média atual: ${media}\n• Faltas: ${faltas}\n\n4. RECOMENDAÇÕES\n• Acompanhar evolução nas próximas semanas\n• Comunicar responsáveis sobre situação atual`,
        indiceRisco,
        aluno: aluno.nome,
        periodo,
        data: new Date().toLocaleDateString('pt-BR')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = () => {
    if (!resultado) return;
    setAnalisesSalvas(prev => [{ ...resultado, id: crypto.randomUUID() }, ...prev.slice(0, 4)]);
    alert('Análise salva no prontuário do aluno!');
  };

  const corRisco = resultado ? (resultado.indiceRisco <= 30 ? '#0FA77B' : resultado.indiceRisco <= 60 ? '#F59E0B' : '#EF4444') : '#1A3C6E';
  const bgRisco = resultado ? (resultado.indiceRisco <= 30 ? '#D1FAE5' : resultado.indiceRisco <= 60 ? '#FEF3C7' : '#FEE2E2') : '#F8FAFF';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-outfit font-black tracking-tight" style={{ color: '#1A3C6E' }}>Lumina Predict</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Análise preditiva com IA para identificar riscos pedagógicos antes que se tornem problemas.</p>
      </div>

      {/* Layout 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 space-y-5" style={{ border: '1px solid #E2E8F0' }}>
            <h3 className="font-outfit font-bold text-sm uppercase tracking-widest" style={{ color: '#1A3C6E' }}>Configurar Análise</h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Aluno</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={selectedAlunoId}
                onChange={e => setSelectedAlunoId(e.target.value)}
              >
                <option value="">Selecionar aluno...</option>
                {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Período de Análise</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={periodo}
                onChange={e => setPeriodo(e.target.value)}
              >
                {PERIODOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Dados para Análise</label>
              {[
                { key: 'frequencia', label: 'Frequência' },
                { key: 'notas', label: 'Notas bimestrais' },
                { key: 'atividades', label: 'Entrega de atividades' },
                { key: 'financeiro', label: 'Histórico financeiro (inadimplência)' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dadosSelecionados[item.key]}
                    onChange={e => setDadosSelecionados(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#1A3C6E' }}
                  />
                  <span className="text-sm" style={{ color: '#1E293B' }}>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Observações da Coordenação</label>
              <textarea
                className="px-3 py-2 rounded-lg border text-sm resize-none"
                rows={3}
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Informações adicionais relevantes para a análise..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
              />
            </div>

            <button
              onClick={handleGerar}
              disabled={loading || !selectedAlunoId}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                backgroundColor: '#F59E0B',
                color: '#1A3C6E',
                opacity: loading || !selectedAlunoId ? 0.6 : 1,
              }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  Analisando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  Gerar Análise Preditiva
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading && <AILoading />}

          {!loading && !resultado && (
            <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center gap-4" style={{ border: '1px solid #E2E8F0', minHeight: '400px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F1F5F9' }}>
                <span className="material-symbols-outlined text-[32px]" style={{ color: '#94A3B8' }}>analytics</span>
              </div>
              <p className="font-outfit font-bold text-lg" style={{ color: '#94A3B8' }}>Aguardando configuração</p>
              <p className="text-sm text-center" style={{ color: '#CBD5E1' }}>Selecione um aluno e clique em "Gerar Análise Preditiva"</p>
            </div>
          )}

          {!loading && resultado && (
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
                <div>
                  <p className="font-outfit font-black text-base" style={{ color: '#1A3C6E' }}>{resultado.aluno}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{resultado.periodo} • Gerado em {resultado.data}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: bgRisco, color: corRisco }}>
                  Risco {resultado.indiceRisco <= 30 ? 'Baixo' : resultado.indiceRisco <= 60 ? 'Médio' : 'Alto'}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: bgRisco }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Índice de Risco</p>
                  <RiscoSegmentos percentual={resultado.indiceRisco} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#1A3C6E' }}>smart_toy</span>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1A3C6E' }}>Análise Preditiva — Lumina IA</p>
                  </div>
                  <AIReportCard texto={resultado.texto} tipo="predict" />
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: bgRisco, border: `1px solid ${corRisco}20` }}>
                  <span className="material-symbols-outlined text-[28px]" style={{ color: corRisco }}>school</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Probabilidade de Reprovação</p>
                    <p className="text-2xl font-black" style={{ color: corRisco }}>{resultado.indiceRisco}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSalvar}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                    style={{ backgroundColor: '#1A3C6E' }}
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Salvar no prontuário
                  </button>
                  <button
                    onClick={() => alert('Análise enviada para a coordenação!')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95"
                    style={{ borderColor: '#1A3C6E', color: '#1A3C6E' }}
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Enviar para coordenação
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95"
                    style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Histórico de análises */}
      {analisesSalvas.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
            <h3 className="font-outfit font-bold text-sm" style={{ color: '#1A3C6E' }}>Análises Salvas</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {analisesSalvas.map(a => {
              const cor = a.indiceRisco <= 30 ? '#0FA77B' : a.indiceRisco <= 60 ? '#F59E0B' : '#EF4444';
              const bg = a.indiceRisco <= 30 ? '#D1FAE5' : a.indiceRisco <= 60 ? '#FEF3C7' : '#FEE2E2';
              return (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1E293B' }}>{a.aluno}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{a.periodo} • {a.data}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color: cor }}>
                    {a.indiceRisco}% risco
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
