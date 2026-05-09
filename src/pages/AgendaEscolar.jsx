import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function AgendaEscolar() {
  const { eventos, addEvento, removeEvento, turmas, professores } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '', tipo: 'Evento Escolar', dataInicial: '', descricao: '', turmaId: '', professorId: ''
  });

  const tiposEvento = [
    'Feriado Nacional', 'Feriado Estadual', 'Feriado Municipal', 'Recesso Escolar',
    'Prova', 'Reunião de Pais', 'Conselho de Classe', 'Evento Escolar',
    'Atividade Pedagógica', 'Entrega de Relatórios', 'Fechamento de Bimestre', 'Outro'
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvento({ ...formData, dataInicial: selectedDay || formData.dataInicial, status: 'programado' });
    setShowModal(false);
    setSelectedDay(null);
    setFormData({ titulo: '', tipo: 'Evento Escolar', dataInicial: '', descricao: '', turmaId: '', professorId: '' });
  };

  const getEventosDoDia = (day) => {
    const dataStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.dataInicial === dataStr);
  };

  const handleDayClick = (day) => {
    const dataStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(dataStr);
    setFormData(prev => ({ ...prev, dataInicial: dataStr }));
    setShowModal(true);
  };

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Agenda Escolar</h1>
          <p className="text-on-surface-variant font-inter">Planejamento letivo, feriados e eventos pedagógicos.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={goToday} className="px-4 py-3 rounded-2xl border border-outline/50 text-sm font-bold hover:bg-white/5 transition-all">
             Hoje
          </button>
          <button 
            onClick={() => { setSelectedDay(null); setFormData(prev => ({...prev, dataInicial: ''})); setShowModal(true); }} 
            className="orange-gradient text-black px-6 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Evento
          </button>
        </div>
      </div>

      <div className="glass border border-outline/30 rounded-3xl overflow-hidden flex flex-col flex-1">
        {/* Header do Calendário */}
        <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex justify-between items-center">
           <h2 className="text-2xl font-outfit font-bold text-on-surface capitalize">
              {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
           </h2>
           <div className="flex gap-2">
              <button onClick={prevMonth} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30">
                 <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30">
                 <span className="material-symbols-outlined">chevron_right</span>
              </button>
           </div>
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 border-b border-outline/30 bg-surface-container-highest">
           {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="p-4 text-center text-[13px] font-black text-on-surface-variant uppercase tracking-widest">{d}</div>
           ))}
        </div>
        
        <div className="grid grid-cols-7 flex-1 min-h-[500px]">
           {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="border-r border-b border-outline/10 bg-surface-container-low/20"></div>
           ))}
           {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const evs = getEventosDoDia(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
              
              return (
                 <div 
                   key={day} 
                   onClick={() => handleDayClick(day)}
                   className="border-r border-b border-outline/10 p-2 min-h-[100px] hover:bg-surface-container/50 cursor-pointer transition-colors relative group"
                 >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${isToday ? 'orange-gradient text-black shadow-glow' : 'text-on-surface-variant group-hover:text-primary'}`}>
                       {day}
                    </span>
                    <div className="mt-2 flex flex-col gap-1">
                       {evs.map(ev => (
                          <div 
                            key={ev.id} 
                            onClick={(e) => { e.stopPropagation(); removeEvento(ev.id); }} 
                            className={`px-2 py-1 rounded text-[12px] font-bold truncate ${ev.tipo.includes('Feriado') ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'} hover:opacity-80 transition-opacity`}
                            title="Clique para remover"
                          >
                             {ev.titulo}
                          </div>
                       ))}
                    </div>
                 </div>
              );
           })}
        </div>
      </div>

      {/* Modal de Evento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
           <div className="glass border border-outline/30 rounded-[2.5rem] shadow-glow-strong w-full max-w-lg overflow-hidden flex flex-col relative">
              <div className="absolute top-0 right-0 p-6 z-10">
                 <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="p-8 orange-gradient">
                 <h2 className="text-2xl font-outfit font-black text-black">Adicionar Evento</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                 <InputGroup label="Título" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <SelectGroup label="Tipo de Evento" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                       {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                    </SelectGroup>
                    <InputGroup label="Data" type="date" value={formData.dataInicial} onChange={e => setFormData({...formData, dataInicial: e.target.value})} required />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <SelectGroup label="Turma (Opcional)" value={formData.turmaId} onChange={e => setFormData({...formData, turmaId: e.target.value})}>
                       <option value="">Toda a escola</option>
                       {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </SelectGroup>
                    <SelectGroup label="Professor (Opcional)" value={formData.professorId} onChange={e => setFormData({...formData, professorId: e.target.value})}>
                       <option value="">Não aplicável</option>
                       {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </SelectGroup>
                 </div>

                 <div className="pt-4 border-t border-outline/20 flex justify-end gap-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-2xl border border-outline/50 text-sm font-bold hover:bg-white/5 transition-all">Cancelar</button>
                    <button type="submit" className="orange-gradient text-black px-8 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all">Salvar Evento</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <input className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface" {...props} />
    </div>
  );
}

function SelectGroup({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <select className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface appearance-none" {...props}>{children}</select>
    </div>
  );
}
