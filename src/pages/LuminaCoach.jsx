import { useState } from 'react';
import { useData } from '../context/DataContext';
import AIReportCard, { AILoading } from '../components/AIReportCard';

const NECESSIDADES = [
  'Sugestão de atividade para dificuldade específica',
  'Estratégia para aluno com dificuldade de aprendizagem',
  'Plano de recuperação personalizado',
  'Como engajar turma com baixo desempenho',
  'Sugestão de avaliação alternativa',
];

const BIMESTRES = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

function LuminaArcSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="#1A3C6E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="#F59E0B" />
      <line x1="4" y1="26" x2="28" y2="26" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LuminaCoach() {
  const { turmas } = useData();
  const [form, setForm] = useState({
    turmaId: '',
    disciplina: '',
    bimestre: '1º Bimestre',
    necessidade: NECESSIDADES[0],
    situacao: '',
  });
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState('');
  const [historico, setHistorico] = useState([
    { id: '1', data: '25/04/2026', turma: '5º Ano A', disciplina: 'Matemática', resumo: 'Estratégia para dificuldade em frações com 3 alunos', resposta: 'Orientação completa sobre frações...' },
    { id: '2', data: '22/04/2026', turma: '3º Ano B', disciplina: 'Português', resumo: 'Atividade para engajar turma com baixo desempenho em leitura', resposta: 'Orientação completa sobre leitura...' },
  ]);
  const [consultaAberta, setConsultaAberta] = useState(null);

  const turmaSelecionada = turmas.find(t => t.id === form.turmaId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.situacao.trim()) return alert('Descreva a situação antes de pedir orientação.');
    setLoading(true);
    setResposta('');

    const prompt = `Você é Lumina Coach, um assistente pedagógico especialista em ensino fundamental brasileiro. Um professor pediu sua orientação.
Responda de forma prática, calorosa e direta.
Estruture sua resposta em:
🎯 ORIENTAÇÃO PRINCIPAL (1 parágrafo)
📋 PASSO A PASSO (lista de 4-6 ações práticas e simples)
💡 DICA EXTRA (1 insight relevante)
Use linguagem simples, evite termos técnicos, seja encorajador.

Contexto do professor:
- Turma: ${turmaSelecionada?.nome || form.turmaId || 'Não informada'}
- Disciplina: ${form.disciplina || 'Não informada'}
- Bimestre: ${form.bimestre}
- O que precisa: ${form.necessidade}
- Situação descrita: ${form.situacao}`;

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      setResposta(data.content[0].text);
    } catch {
      setResposta(`🎯 ORIENTAÇÃO PRINCIPAL\nNão foi possível conectar à IA no momento. Verifique a chave de API nas configurações do sistema.\n\n📋 PASSO A PASSO\n• Verifique a conexão com a internet\n• Confirme que a chave VITE_ANTHROPIC_API_KEY está configurada\n• Tente novamente em alguns instantes\n\n💡 DICA EXTRA\nEnquanto isso, consulte os recursos pedagógicos disponíveis na plataforma.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = () => {
    if (!resposta) return;
    const novaConsulta = {
      id: crypto.randomUUID(),
      data: new Date().toLocaleDateString('pt-BR'),
      turma: turmaSelecionada?.nome || form.turmaId || 'Não informada',
      disciplina: form.disciplina || 'Não informada',
      resumo: form.situacao.slice(0, 80) + (form.situacao.length > 80 ? '...' : ''),
      resposta,
    };
    setHistorico(prev => [novaConsulta, ...prev.slice(0, 4)]);
    alert('Orientação salva com sucesso!');
  };

  const handleNovaConsulta = () => {
    setResposta('');
    setForm({ turmaId: '', disciplina: '', bimestre: '1º Bimestre', necessidade: NECESSIDADES[0], situacao: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-outfit font-black tracking-tight" style={{ color: '#1A3C6E' }}>Lumina Coach</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Seu assistente pedagógico inteligente — orientações práticas para professores.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 space-y-5" style={{ border: '1px solid #E2E8F0' }}>
          <div>
            <h2 className="font-outfit font-black text-lg" style={{ color: '#1A3C6E' }}>Lumina Coach</h2>
            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Seu assistente pedagógico inteligente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Turma</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={form.turmaId}
                onChange={e => setForm(p => ({ ...p, turmaId: e.target.value }))}
              >
                <option value="">Selecionar turma...</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Disciplina</label>
              <input
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Ex: Matemática, Português..."
                value={form.disciplina}
                onChange={e => setForm(p => ({ ...p, disciplina: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Bimestre</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={form.bimestre}
                onChange={e => setForm(p => ({ ...p, bimestre: e.target.value }))}
              >
                {BIMESTRES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>O que você precisa?</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={form.necessidade}
                onChange={e => setForm(p => ({ ...p, necessidade: e.target.value }))}
              >
                {NECESSIDADES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Descreva a situação *</label>
              <textarea
                className="px-3 py-2 rounded-lg border text-sm resize-none"
                rows={5}
                style={{ borderColor: '#E2E8F0' }}
                placeholder="Ex: Minha turma está com dificuldade em frações. 3 alunos não entregaram as últimas 2 atividades..."
                value={form.situacao}
                onChange={e => setForm(p => ({ ...p, situacao: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ backgroundColor: '#1A3C6E', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  Coach pensando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                  Pedir orientação ao Coach
                </>
              )}
            </button>
          </form>
        </div>

        {/* Coluna Direita */}
        <div>
          {loading && <AILoading />}

          {!loading && !resposta && (
            <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center gap-4" style={{ border: '1px solid #E2E8F0', minHeight: '400px' }}>
              <LuminaArcSVG />
              <p className="font-outfit font-bold text-lg text-center" style={{ color: '#94A3B8' }}>Aguardando sua pergunta</p>
              <p className="text-sm text-center" style={{ color: '#CBD5E1' }}>Descreva a situação e clique em "Pedir orientação ao Coach"</p>
            </div>
          )}

          {!loading && resposta && (
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
              {/* Header */}
              <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
                <LuminaArcSVG />
                <div>
                  <p className="font-outfit font-black text-base" style={{ color: '#1A3C6E' }}>Lumina Coach</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>Orientação pedagógica personalizada</p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <AIReportCard texto={resposta} tipo="coach" />
              </div>

              {/* Ações */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={handleSalvar}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                  style={{ backgroundColor: '#1A3C6E' }}
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Salvar orientação
                </button>
                <button
                  onClick={handleNovaConsulta}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95"
                  style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Nova consulta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Histórico de consultas */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: '#1A3C6E' }}>history</span>
          <h3 className="font-outfit font-bold text-sm" style={{ color: '#1A3C6E' }}>Consultas Recentes</h3>
        </div>
        <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
          {historico.length === 0 && (
            <p className="px-6 py-8 text-sm italic text-center" style={{ color: '#94A3B8' }}>Nenhuma consulta salva ainda.</p>
          )}
          {historico.map(c => (
            <div key={c.id}>
              <button
                onClick={() => setConsultaAberta(consultaAberta === c.id ? null : c.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1A3C6E' }}>{c.turma}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>{c.disciplina}</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{c.data}</span>
                  </div>
                  <p className="text-sm truncate" style={{ color: '#1E293B' }}>{c.resumo}</p>
                </div>
                <span className="material-symbols-outlined text-[18px] ml-3 flex-shrink-0" style={{ color: '#94A3B8' }}>
                  {consultaAberta === c.id ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {consultaAberta === c.id && (
                <div className="px-6 pb-4">
                  <div className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: '#F8FAFF', color: '#1E293B', border: '1px solid #E2E8F0' }}>
                    {c.resposta}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
