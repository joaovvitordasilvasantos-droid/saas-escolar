import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { alunos, atividades, reports, notas, eventos, config } = useData();
  const [currentDate] = useState(new Date());

  // Calcular métricas reais
  const alunosRisco = alunos.map(aluno => {
    const notasAluno = notas.filter(n => n.alunoId === aluno.id);
    if (notasAluno.length === 0) return null;
    const mediaGeral = notasAluno.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0) / notasAluno.length;
    const totalFaltas = notasAluno.reduce((acc, curr) => acc + parseInt(curr.faltas || 0), 0);
    if (mediaGeral < 6.0 || totalFaltas > 10) return aluno;
    return null;
  }).filter(Boolean);

  const relatoriosPendentes = reports.filter(r => r.status === 'Pendente' || !r.status).length;
  
  // Calcular Frequência Média Geral
  const getFrequenciaGeral = () => {
     if(alunos.length === 0) return 0;
     const freqTotal = alunos.reduce((acc, aluno) => {
        const notasAluno = notas.filter(n => n.alunoId === aluno.id);
        const faltas = notasAluno.reduce((sum, curr) => sum + parseInt(curr.faltas || 0), 0);
        return acc + Math.max(0, 100 - (faltas * 0.5));
     }, 0);
     return (freqTotal / alunos.length).toFixed(1);
  };
  const frequenciaMedia = getFrequenciaGeral();

  // Agenda Escolar - Próximos Eventos
  const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const proximosEventos = eventos
     .filter(e => e.dataInicial >= todayStr)
     .sort((a, b) => new Date(a.dataInicial) - new Date(b.dataInicial))
     .slice(0, 3);

  // Mini Calendário Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-outfit font-extrabold text-on-surface tracking-tight">Painel de Controle</h1>
          <p className="text-on-surface-variant mt-2 font-inter">Visão geral pedagógica e administrativa em tempo real.</p>
        </div>
        <div className="text-right p-4 glass rounded-2xl border border-primary/10 flex flex-col items-end">
          <p className="text-[13px] font-bold text-primary uppercase tracking-[0.2em]">{config.bimestre}</p>
          <p className="text-2xl font-outfit font-bold text-on-surface">Ano {config.anoLetivo}</p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Estudantes" value={alunos.length} icon="school" />
        <MetricCard title="Atenção Pedagógica" value={alunosRisco.length} icon="warning" variant={alunosRisco.length > 0 ? "error" : "default"} />
        <MetricCard title="Atividades Registradas" value={atividades.length} icon="draw" />
        <MetricCard title="Pareceres Pendentes" value={relatoriosPendentes} icon="pending_actions" variant={relatoriosPendentes > 0 ? "warning" : "default"} />
      </div>

      {/* Saúde Financeira */}
      <div className="glass rounded-3xl border border-outline/30 p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#1A3C6E' }}>account_balance</span>
            </div>
            <div>
              <h3 className="font-outfit font-bold text-base text-on-surface">Saúde Financeira</h3>
              <p className="text-xs text-on-surface-variant">Resumo do mês atual</p>
            </div>
          </div>
          <button onClick={() => navigate('/financeiro')} className="text-xs font-bold px-3 py-1.5 rounded-xl border border-outline/50 hover:border-primary/50 hover:text-primary transition-all" style={{ color: '#64748B' }}>
            Ver detalhes
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#D1FAE5', border: '1px solid #0FA77B20' }}>
            <p className="text-[13px] font-black uppercase tracking-widest" style={{ color: '#0FA77B' }}>Receita do Mês</p>
            <p className="text-xl font-outfit font-black mt-1" style={{ color: '#0FA77B' }}>R$ 2.650</p>
            <p className="text-[13px] mt-0.5" style={{ color: '#64748B' }}>3 mensalidades pagas</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF444420' }}>
            <p className="text-[13px] font-black uppercase tracking-widest" style={{ color: '#EF4444' }}>Inadimplência</p>
            <p className="text-xl font-outfit font-black mt-1" style={{ color: '#EF4444' }}>2 alunos</p>
            <p className="text-[13px] mt-0.5" style={{ color: '#64748B' }}>25% da base</p>
          </div>
          <div className="p-4 rounded-2xl" style={{ backgroundColor: '#DBEAFE', border: '1px solid #1A3C6E20' }}>
            <p className="text-[13px] font-black uppercase tracking-widest" style={{ color: '#1A3C6E' }}>Resultado</p>
            <p className="text-xl font-outfit font-black mt-1" style={{ color: '#1A3C6E' }}>+ R$ 412</p>
            <p className="text-[13px] mt-0.5" style={{ color: '#64748B' }}>Após custos e folha</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Analytics e Atalhos */}
        <div className="xl:col-span-2 space-y-6">
           <div className="glass rounded-3xl p-8 border border-outline/30 relative overflow-hidden flex flex-col justify-between items-center md:flex-row gap-8">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10"></div>
             <div className="text-center md:text-left">
               <h3 className="text-2xl font-outfit font-bold text-on-surface">Índice de Frequência Geral</h3>
               <p className="text-sm text-on-surface-variant max-w-sm mt-2">Média da instituição calculada com base nos diários e lançamentos consolidados no período.</p>
             </div>
             <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-[12px] border-surface-container shadow-glow shrink-0">
                <div className="flex flex-col items-center">
                   <span className="text-5xl font-outfit font-black text-primary glow-text">{frequenciaMedia}%</span>
                </div>
                <div className="absolute inset-0 border-[12px] border-primary border-t-transparent border-l-transparent rounded-full rotate-45"></div>
             </div>
           </div>

           <div className="glass rounded-3xl border border-outline/30 p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-outfit font-bold">Ações Rápidas</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickAction icon="person_add" label="Matricular" onClick={() => navigate('/alunos')} />
                <QuickAction icon="checklist" label="Lançar Notas" onClick={() => navigate('/notas-frequencia')} />
                <QuickAction icon="add_photo_alternate" label="Portfólio" onClick={() => navigate('/atividades')} />
                <QuickAction icon="psychology" label="Gerar Parecer" onClick={() => navigate('/relatorios-ia')} />
                <QuickAction icon="event" label="Agendar Evento" onClick={() => navigate('/agenda-escolar')} />
                <QuickAction icon="admin_panel_settings" label="Alertas" onClick={() => navigate('/coordenacao')} />
             </div>
           </div>
        </div>

        {/* Lado Direito: Agenda Escolar Mini */}
        <div className="glass rounded-3xl border border-outline/30 p-8 flex flex-col gap-6 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
           
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-outfit font-bold">Agenda Letiva</h3>
                 <p className="text-xs text-primary font-bold uppercase tracking-widest">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</p>
              </div>
           </div>

           {/* Grid Mini Calendário */}
           <div className="bg-surface-container-low rounded-2xl p-4 border border-outline/20">
              <div className="grid grid-cols-7 mb-2">
                 {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[13px] font-black text-on-surface-variant">{d}</div>
                 ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                 {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                 {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                    const hasEvent = eventos.some(e => e.dataInicial === dateStr);
                    
                    return (
                       <div key={day} className="aspect-square flex items-center justify-center relative">
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isToday ? 'bg-primary text-white shadow-glow' : 'text-on-surface'}`}>
                             {day}
                          </span>
                          {hasEvent && !isToday && <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-error"></div>}
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* Próximos Eventos */}
           <div className="flex-1 space-y-3">
              <h4 className="text-[13px] font-black text-on-surface-variant uppercase tracking-widest">Próximos Compromissos</h4>
              {proximosEventos.length === 0 ? (
                 <p className="text-sm text-on-surface-variant italic">Sem eventos agendados.</p>
              ) : (
                 proximosEventos.map(ev => {
                    const dateObj = new Date(ev.dataInicial + 'T00:00:00'); // workaround for timezone
                    return (
                       <div key={ev.id} className="p-3 bg-surface-container rounded-xl border border-outline/30 flex items-center gap-3">
                          <div className={`w-2 h-10 rounded-full ${ev.tipo.includes('Feriado') ? 'bg-error shadow-glow-error' : 'bg-primary shadow-glow'}`}></div>
                          <div>
                             <p className="font-bold text-sm text-on-surface truncate">{ev.titulo}</p>
                             <p className="text-[13px] text-on-surface-variant uppercase tracking-widest">{dateObj.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} • {ev.tipo}</p>
                          </div>
                       </div>
                    );
                 })
              )}
           </div>

           <button onClick={() => navigate('/agenda-escolar')} className="w-full mt-4 py-3 rounded-2xl border border-outline/50 text-sm font-bold hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all">
              Ver Agenda Completa
           </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, variant = 'default' }) {
  const colorMap = {
    error: 'bg-error/20 text-error border-error/20 group-hover:border-error/40',
    warning: 'bg-primary/20 text-primary border-primary/20 group-hover:border-primary/40',
    default: 'bg-primary/5 text-primary border-outline/30 group-hover:border-primary/40'
  };

  const textMap = {
    error: 'text-error',
    warning: 'text-primary',
    default: 'text-on-surface'
  };

  return (
    <div className={`glass rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02] group ${colorMap[variant]}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${colorMap[variant]}`}>
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
      </div>
      <p className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{title}</p>
      <h2 className={`text-4xl font-outfit font-black mt-1 ${textMap[variant]}`}>{value}</h2>
    </div>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-surface-container-low border border-outline/30 rounded-2xl hover:border-primary/50 hover:bg-surface-container transition-all active:scale-95 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center group-hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="font-outfit font-bold text-sm text-on-surface">{label}</span>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
    </button>
  );
}
