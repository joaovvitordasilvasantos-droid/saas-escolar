import { useState } from 'react';
import { useData } from '../context/DataContext';
import AIReportCard, { AILoading } from '../components/AIReportCard';

const BIMESTRES = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
const TONS = ['Encorajador', 'Neutro', 'Preocupado mas motivador'];

export default function BoletimInteligente() {
  const { alunos, turmas, notas, atividades } = useData();
  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [bimestre, setBimestre] = useState('1º Bimestre');
  const [tom, setTom] = useState('Encorajador');
  const [loading, setLoading] = useState(false);
  const [carta, setCarta] = useState('');

  const aluno = alunos.find(a => a.id === selectedAlunoId);
  const turma = aluno ? turmas.find(t => t.id === aluno.turmaId) : null;
  const notasAluno = aluno ? notas.filter(n => n.alunoId === aluno.id && n.periodo === bimestre) : [];
  const atividadesAluno = aluno ? atividades.filter(a => a.alunoId === aluno.id) : [];
  const media = notasAluno.length > 0
    ? (notasAluno.reduce((s, n) => s + parseFloat(n.valor || 0), 0) / notasAluno.length).toFixed(1)
    : null;
  const faltas = notasAluno.reduce((s, n) => s + parseInt(n.faltas || 0), 0);
  const entregues = atividadesAluno.filter(a => a.statusEntrega === 'Entregue no prazo').length;

  const handleGerar = async () => {
    if (!selectedAlunoId) return alert('Selecione um aluno primeiro.');
    setLoading(true);
    setCarta('');

    const prompt = `Você é um assistente da escola que escreve cartas pedagógicas para famílias de alunos do ensino fundamental.
Escreva uma carta calorosa e profissional para os responsáveis de ${aluno.nome} sobre o ${bimestre} letivo.
A carta deve:
- Começar com cumprimento personalizado
- Destacar 2 pontos positivos do aluno
- Mencionar 1 área de desenvolvimento necessário (de forma gentil)
- Terminar com mensagem motivadora e convite para reunião
- Tom: ${tom}
- Máximo 3 parágrafos
- Assinar como 'Equipe Pedagógica Lumina'
NÃO mencione notas numéricas diretamente, use expressões qualitativas.

Dados do aluno para contexto:
- Nome: ${aluno.nome}
- Turma: ${turma?.nome || 'N/A'}
- Período: ${bimestre}
- Desempenho geral: ${media ? (parseFloat(media) >= 8 ? 'excelente' : parseFloat(media) >= 6 ? 'satisfatório' : 'necessita atenção') : 'sem dados suficientes'}
- Frequência: ${faltas === 0 ? 'excelente, sem faltas' : faltas <= 5 ? 'boa, poucas faltas' : 'com algumas ausências que merecem atenção'}
- Atividades entregues: ${entregues} de ${atividadesAluno.length}`;

    try {
      const response = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      setCarta(data.content[0].text);
    } catch {
      setCarta(`Prezados responsáveis de ${aluno?.nome || 'aluno'},\n\nVenho por meio desta carta compartilhar com vocês o desenvolvimento de ${aluno?.nome || 'seu filho(a)'} durante o ${bimestre}.\n\n[Não foi possível gerar a carta automaticamente. Verifique a chave de API nas configurações do sistema e tente novamente.]\n\nAtenciosamente,\nEquipe Pedagógica Lumina`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(carta).then(() => alert('Carta copiada para a área de transferência!'));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-outfit font-black tracking-tight" style={{ color: '#1A3C6E' }}>Boletim Inteligente</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Gere cartas pedagógicas personalizadas para as famílias com IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Painel de configuração */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 space-y-4" style={{ border: '1px solid #E2E8F0' }}>
            <h3 className="font-outfit font-bold text-sm uppercase tracking-widest" style={{ color: '#1A3C6E' }}>Configurar Carta</h3>

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
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Bimestre</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={bimestre}
                onChange={e => setBimestre(e.target.value)}
              >
                {BIMESTRES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Tom da Carta</label>
              <select
                className="h-10 px-3 rounded-lg border text-sm"
                style={{ borderColor: '#E2E8F0' }}
                value={tom}
                onChange={e => setTom(e.target.value)}
              >
                {TONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Preview das notas */}
            {aluno && (
              <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1A3C6E' }}>Preview — {aluno.nome}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <p className="text-lg font-black" style={{ color: media ? (parseFloat(media) >= 7 ? '#0FA77B' : parseFloat(media) >= 5 ? '#F59E0B' : '#EF4444') : '#94A3B8' }}>
                      {media || 'N/A'}
                    </p>
                    <p className="text-[13px] font-bold uppercase" style={{ color: '#64748B' }}>Média</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <p className="text-lg font-black" style={{ color: faltas > 10 ? '#EF4444' : faltas > 5 ? '#F59E0B' : '#0FA77B' }}>{faltas}</p>
                    <p className="text-[13px] font-bold uppercase" style={{ color: '#64748B' }}>Faltas</p>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                    <p className="text-lg font-black" style={{ color: '#1A3C6E' }}>{entregues}/{atividadesAluno.length}</p>
                    <p className="text-[13px] font-bold uppercase" style={{ color: '#64748B' }}>Atividades</p>
                  </div>
                </div>
                {turma && <p className="text-xs" style={{ color: '#64748B' }}>Turma: {turma.nome}</p>}
              </div>
            )}

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
                  Gerando carta...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Gerar Carta para a Família
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div className="lg:col-span-3">
          {loading && <AILoading />}

          {!loading && !carta && (
            <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center gap-4" style={{ border: '1px solid #E2E8F0', minHeight: '400px' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                <span className="material-symbols-outlined text-[32px]" style={{ color: '#F59E0B' }}>mail</span>
              </div>
              <p className="font-outfit font-bold text-lg" style={{ color: '#94A3B8' }}>Carta não gerada ainda</p>
              <p className="text-sm text-center" style={{ color: '#CBD5E1' }}>Selecione um aluno e clique em "Gerar Carta para a Família"</p>
            </div>
          )}

          {!loading && carta && (
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
              {/* Header estilizado */}
              <div className="p-6 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1A3C6E 0%, #0FA77B 100%)' }}>
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="28" cy="10" r="3.5" fill="#F59E0B" />
                    <line x1="4" y1="26" x2="28" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div>
                    <p className="font-outfit font-black text-white text-base">LUMINA</p>
                    <p className="text-white/70 text-xs">Carta Pedagógica — {bimestre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">{new Date().toLocaleDateString('pt-BR')}</p>
                  <p className="text-white text-xs font-bold">{aluno?.nome}</p>
                </div>
              </div>

              <div className="p-8">
                <AIReportCard texto={carta} tipo="boletim" bimestre={bimestre} />
              </div>

              {/* Ações */}
              <div className="px-6 pb-6 flex flex-wrap gap-3" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                  style={{ backgroundColor: '#1A3C6E' }}
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Imprimir
                </button>
                <button
                  onClick={handleCopiar}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95"
                  style={{ borderColor: '#1A3C6E', color: '#1A3C6E' }}
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copiar texto
                </button>
                <button
                  onClick={() => alert('Carta salva no prontuário do aluno!')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all active:scale-95"
                  style={{ borderColor: '#E2E8F0', color: '#64748B' }}
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Salvar no prontuário
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
