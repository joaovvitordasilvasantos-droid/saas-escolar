import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DeleteConfirmation from '../components/DeleteConfirmation';
import AIReportCard, { AILoading } from '../components/AIReportCard';

export default function RelatoriosIA() {
  const location = useLocation();
  const { alunos, turmas, notas, atividades, reports, addReport, removeReport, config } = useData();
  const [selectedAlunoId, setSelectedAlunoId] = useState(location.state?.alunoId || '');
  const [selectedPeriodo, setSelectedPeriodo] = useState(config.bimestre);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const periodos = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', 'Semestre 1', 'Semestre 2', 'Anual'];

  // Função para simular a IA
  const generateReport = () => {
    if (!selectedAlunoId) return alert('Selecione um aluno primeiro!');
    
    setLoading(true);
    setReport('');
    
    const aluno = alunos.find(a => a.id === selectedAlunoId);
    const turma = turmas.find(t => t.id === aluno.turmaId);
    
    // Buscar dados reais do aluno
    const notasAluno = notas.filter(n => n.alunoId === aluno.id && n.periodo === selectedPeriodo);
    const atividadesAluno = atividades.filter(a => a.alunoId === aluno.id);
    
    const totalFaltas = notasAluno.reduce((acc, curr) => acc + parseInt(curr.faltas || 0), 0);
    const media = notasAluno.length > 0 ? (notasAluno.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0) / notasAluno.length).toFixed(1) : 'N/A';
    
    let template = `RELATÓRIO PEDAGÓGICO INTELIGENTE - PEDAGOAI\n\n`;
    template += `ESTUDANTE: ${aluno.nome.toUpperCase()}\n`;
    template += `TURMA: ${turma?.nome.toUpperCase() || 'N/A'}\n`;
    template += `PERÍODO: ${selectedPeriodo.toUpperCase()}\n`;
    template += `DATA DE EMISSÃO: ${new Date().toLocaleDateString()}\n`;
    template += `--------------------------------------------------\n`;
    template += `RESUMO ACADÊMICO\n`;
    template += `--------------------------------------------------\n`;
    template += `Média Global: ${media}\n`;
    template += `Total de Faltas no Período: ${totalFaltas}\n`;
    template += `Atividades Registradas: ${atividadesAluno.length}\n\n`;

    template += `DESENVOLVIMENTO PEDAGÓGICO:\n`;
    if (media === 'N/A') {
      template += `Ainda não há notas suficientes lançadas para o período avaliado.\n`;
    } else if (parseFloat(media) >= 8.0) {
      template += `O estudante apresenta um excelente desenvolvimento cognitivo e acadêmico, demonstrando facilidade na assimilação dos conteúdos propostos.\n`;
    } else if (parseFloat(media) >= 6.0) {
      template += `O estudante apresenta um desenvolvimento satisfatório, acompanhando a turma na maioria das disciplinas, embora com necessidade de atenção em alguns pontos.\n`;
    } else {
      template += `O estudante apresenta dificuldades significativas no acompanhamento pedagógico, necessitando de intervenção e apoio contínuo.\n`;
    }

    if (totalFaltas > 10) {
      template += `Atenção: O alto índice de faltas pode estar impactando negativamente o aprendizado.\n\n`;
    } else {
      template += `A frequência regular tem contribuído positivamente para a rotina escolar.\n\n`;
    }

    if (atividadesAluno.length > 0) {
       template += `PARTICIPAÇÃO E PORTFÓLIO:\nO aluno possui ${atividadesAluno.length} atividades no portfólio. Destacam-se as disciplinas de ${[...new Set(atividadesAluno.map(a => a.disciplina))].join(', ')}.\n\n`;
    }

    template += `OBSERVAÇÕES DO PROFESSOR / COORDENAÇÃO:\n`;
    template += observacoes ? `${observacoes}\n\n` : `Sem observações complementares registradas.\n\n`;

    template += `RECOMENDAÇÕES:\n`;
    if (parseFloat(media) < 6.0 || totalFaltas > 10) {
      template += `- Agendar reunião com os responsáveis.\n- Inserir aluno no programa de recuperação paralela.\n`;
    } else {
      template += `- Manter o incentivo ao estudo contínuo.\n- Propor atividades de aprofundamento.\n`;
    }
    
    template += `\nDocumento gerado automaticamente pelo núcleo de processamento PedagoAI Premium (Simulação Local).`;

    setTimeout(() => {
      setReport(template);
      setLoading(false);
    }, 2000);
  };

  const handleApprove = () => {
    const aluno = alunos.find(a => a.id === selectedAlunoId);
    if (!aluno) return alert('Selecione um aluno antes de aprovar.');
    addReport({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      turmaId: aluno.turmaId,
      periodo: selectedPeriodo,
      content: report,
      date: new Date().toLocaleDateString(),
      status: 'Aprovado'
    });
    setReport('');
    setSelectedAlunoId('');
    setObservacoes('');
    alert('Relatório aprovado e salvo no histórico do aluno!');
  };

  const handleSaveDraft = () => {
    const aluno = alunos.find(a => a.id === selectedAlunoId);
    if (!aluno) return alert('Selecione um aluno antes de salvar.');
    addReport({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      turmaId: aluno.turmaId,
      periodo: selectedPeriodo,
      content: report,
      date: new Date().toLocaleDateString(),
      status: 'Pendente' // Rascunho / Pendente de Aprovação
    });
    setReport('');
    alert('Relatório salvo como pendente de aprovação.');
  };

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8 h-full">
      <header>
        <h2 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Relatórios <span className="text-primary glow-text">Inteligentes</span></h2>
        <p className="text-on-surface-variant font-inter mt-1">Gere diagnósticos pedagógicos consolidando notas, faltas e atividades do portfólio.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        {/* Painel de Configuração */}
        <div className="xl:col-span-4 glass border border-outline/30 rounded-[2rem] p-8 space-y-8 relative overflow-hidden h-fit">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px]"></div>
           <h3 className="font-outfit font-black text-primary uppercase tracking-[0.2em] text-xs">Configurar Análise</h3>
           
           <div className="space-y-6">
              <div className="group">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2 group-focus-within:text-primary transition-colors">Estudante Alvo</label>
                <select 
                  className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl text-sm outline-none focus:border-primary/50 transition-all appearance-none"
                  value={selectedAlunoId}
                  onChange={e => setSelectedAlunoId(e.target.value)}
                >
                  <option value="">Selecionar aluno...</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2 group-focus-within:text-primary transition-colors">Período de Avaliação</label>
                <select 
                  className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl text-sm outline-none focus:border-primary/50 transition-all appearance-none"
                  value={selectedPeriodo}
                  onChange={e => setSelectedPeriodo(e.target.value)}
                >
                  {periodos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2 group-focus-within:text-primary transition-colors">Observações Contextuais</label>
                <textarea 
                  className="w-full h-32 px-4 py-4 bg-surface-container-low border border-outline/50 rounded-2xl text-sm outline-none focus:border-primary/50 transition-all resize-none placeholder:opacity-30"
                  placeholder="Descreva pontos de atenção observados no dia a dia..."
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                />
              </div>

              <button 
                onClick={generateReport}
                disabled={loading}
                className={`orange-gradient w-full py-4 text-black rounded-2xl font-black text-sm shadow-glow flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 hover:shadow-glow-strong'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'psychology'}</span>
                {loading ? 'Processando Dados...' : 'Gerar Relatório'}
              </button>
           </div>
        </div>

        {/* Painel de Resultado */}
        <div className="xl:col-span-8 glass border border-outline/30 rounded-[2rem] flex flex-col min-h-[600px] relative overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-outline/30 bg-white/5 flex justify-between items-center">
              <h3 className="font-outfit font-bold text-on-surface">Documento Gerado</h3>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-xl hover:bg-white/5 border border-outline/30 text-on-surface-variant flex items-center justify-center transition-all" title="Copiar"><span className="material-symbols-outlined text-[20px]">content_copy</span></button>
                 <button className="w-10 h-10 rounded-xl hover:bg-white/5 border border-outline/30 text-on-surface-variant flex items-center justify-center transition-all" title="Baixar PDF (Simulado)"><span className="material-symbols-outlined text-[20px]">picture_as_pdf</span></button>
              </div>
           </div>
           
           <div className="flex-1 p-10 bg-black/20 relative flex flex-col">
              {loading && <AILoading />}
              
              {!report && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant text-center opacity-30 group flex-1">
                   <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-6xl">article</span>
                   </div>
                   <p className="font-outfit font-bold text-xl italic">Aguardando parâmetros de configuração...</p>
                </div>
              )}

              {report && <AIReportCard texto={report} tipo="relatorio" />}
           </div>

           {report && (
             <div className="p-6 border-t border-outline/30 flex justify-end gap-4 bg-white/5 backdrop-blur-md">
                <button onClick={() => setReport('')} className="px-6 py-3 text-xs font-black border border-outline/50 rounded-2xl hover:bg-white/5 transition-all">Descartar</button>
                <button onClick={handleSaveDraft} className="px-6 py-3 text-xs font-black border border-outline/50 rounded-2xl text-primary hover:bg-primary/10 transition-all">Salvar Pendente</button>
                <button onClick={handleApprove} className="orange-gradient px-8 py-3 text-xs font-black text-black rounded-2xl shadow-glow hover:shadow-glow-strong active:scale-95 transition-all">Aprovar e Finalizar</button>
             </div>
           )}
        </div>
      </div>

      {/* Histórico de Relatórios com Exclusão */}
      <div className="glass border border-outline/30 rounded-3xl overflow-hidden mt-8">
        <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex justify-between items-center">
           <h3 className="font-outfit font-bold text-on-surface">Histórico de Pareceres</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                <th className="p-6">Estudante</th>
                <th className="p-6">Período</th>
                <th className="p-6">Status</th>
                <th className="p-6">Data de Emissão</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.map(r => (
                <tr key={r.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                     <span className="font-bold text-on-surface">{r.alunoNome}</span>
                  </td>
                  <td className="p-6 text-on-surface-variant">{r.periodo}</td>
                  <td className="p-6">
                     <span className={`px-2 py-1 text-[13px] font-black uppercase rounded ${r.status === 'Aprovado' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>{r.status || 'Pendente'}</span>
                  </td>
                  <td className="p-6 text-on-surface-variant">{r.date}</td>
                  <td className="p-6 text-right flex justify-end gap-3">
                    <button onClick={() => {setReport(r.content); setSelectedAlunoId(r.alunoId); setSelectedPeriodo(r.periodo); window.scrollTo({top: 0, behavior: 'smooth'});}} className="text-primary font-black text-[13px] uppercase tracking-widest px-3 py-2 hover:bg-primary/10 rounded-xl transition-all border border-outline/30">
                      Visualizar
                    </button>
                    <button onClick={() => setDeleteId(r.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline/30">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan="5" className="p-12 text-center text-on-surface-variant italic opacity-50">Nenhum relatório arquivado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmation 
        isOpen={!!deleteId} 
        onConfirm={() => { removeReport(deleteId); setDeleteId(null); }} 
        onCancel={() => setDeleteId(null)}
        title="Excluir Relatório"
        message="Tem certeza que deseja excluir permanentemente este relatório pedagógico? Esta cópia será removida do histórico da instituição."
      />
    </div>
  );
}
