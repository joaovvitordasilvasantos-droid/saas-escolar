import React from 'react';
import { useData } from '../context/DataContext';

export default function Coordenacao() {
  const { alunos, turmas, notas, reports } = useData();

  // Calcular alunos em atenção
  const alunosEmAtencao = alunos.map(aluno => {
    const notasAluno = notas.filter(n => n.alunoId === aluno.id);
    if (notasAluno.length === 0) return null;

    const mediaGeral = notasAluno.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0) / notasAluno.length;
    const totalFaltas = notasAluno.reduce((acc, curr) => acc + parseInt(curr.faltas || 0), 0);

    let motivos = [];
    if (mediaGeral < 6.0) motivos.push('Desempenho Baixo');
    if (totalFaltas > 10) motivos.push('Frequência Crítica');

    if (motivos.length > 0) {
      return { ...aluno, mediaGeral: mediaGeral.toFixed(1), totalFaltas, motivos };
    }
    return null;
  }).filter(Boolean);

  const relatoriosPendentes = reports.filter(r => r.status === 'Pendente' || !r.status);

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Coordenação Pedagógica</h1>
          <p className="text-on-surface-variant font-inter">Painel de controle de alertas e validação de relatórios.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard title="Estudantes em Atenção" value={alunosEmAtencao.length} icon="warning" variant="error" />
        <MetricCard title="Relatórios Pendentes" value={relatoriosPendentes.length} icon="description" variant="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Painel de Alunos em Atenção */}
        <div className="glass border border-outline/30 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex justify-between items-center">
            <h2 className="font-outfit font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error">priority_high</span>
              Radar Pedagógico
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[500px]">
             {alunosEmAtencao.length === 0 ? (
               <div className="p-8 text-center text-on-surface-variant">Nenhum alerta registrado.</div>
             ) : (
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                        <th className="p-4 pl-6">Estudante</th>
                        <th className="p-4">Média Geral</th>
                        <th className="p-4">Faltas</th>
                        <th className="p-4 text-right pr-6">Motivo</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {alunosEmAtencao.map(a => (
                       <tr key={a.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6 font-bold">{a.nome}</td>
                          <td className="p-4 text-error font-black">{a.mediaGeral}</td>
                          <td className="p-4">{a.totalFaltas}</td>
                          <td className="p-4 pr-6 text-right">
                            {a.motivos.map((m, i) => (
                               <span key={i} className="inline-block px-2 py-1 bg-error/20 text-error text-[12px] font-black uppercase rounded-md ml-1">{m}</span>
                            ))}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             )}
          </div>
        </div>

        {/* Relatórios Pendentes */}
        <div className="glass border border-outline/30 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex justify-between items-center">
            <h2 className="font-outfit font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pending_actions</span>
              Aprovação de Pareceres
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[500px]">
             {relatoriosPendentes.length === 0 ? (
               <div className="p-8 text-center text-on-surface-variant">Nenhum relatório aguardando aprovação.</div>
             ) : (
               <div className="flex flex-col">
                 {relatoriosPendentes.map(r => {
                   const alunoNome = alunos.find(a => a.id === r.alunoId)?.nome || 'Desconhecido';
                   return (
                     <div key={r.id} className="p-6 border-b border-outline/5 hover:bg-white/5 transition-colors flex justify-between items-center group">
                       <div>
                          <h4 className="font-bold text-on-surface">{alunoNome}</h4>
                          <p className="text-xs text-on-surface-variant mt-1">Parecer de {r.periodo}</p>
                       </div>
                       <button className="px-4 py-2 bg-surface-container border border-outline/30 rounded-xl text-xs font-bold text-primary hover:bg-primary/20 hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100">
                          Revisar
                       </button>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, variant }) {
  const colorMap = {
    error: 'bg-error/20 text-error border-error/20 hover:border-error/40',
    warning: 'bg-primary/20 text-primary border-primary/20 hover:border-primary/40',
    default: 'bg-surface-container-high text-on-surface border-outline/30'
  };

  const textMap = {
    error: 'text-error',
    warning: 'text-primary',
    default: 'text-on-surface'
  };

  return (
    <div className={`glass rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02] group ${colorMap[variant] || colorMap.default}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${colorMap[variant]}`}>
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
      </div>
      <p className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{title}</p>
      <h2 className={`text-4xl font-outfit font-black mt-1 ${textMap[variant] || textMap.default}`}>{value}</h2>
    </div>
  );
}
