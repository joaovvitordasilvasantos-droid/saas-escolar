import { useState } from 'react';
import { useData } from '../context/DataContext';

// Função para calcular o indicador de status de entrega
function getStatusIndicator(ativ) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const prazo = ativ.prazoEntrega ? new Date(ativ.prazoEntrega + 'T00:00:00') : null;
  const status = ativ.statusEntrega || '';

  // Verde: entregue no prazo ou antes
  if (status === 'Entregue no prazo') {
    return { color: '#0FA77B', title: 'Entregue no prazo' };
  }

  // Vermelho: não entregue após o prazo
  if (status === 'Não entregue' || status === 'Entregue com atraso') {
    return { color: '#EF4444', title: status };
  }

  // Amarelo: prazo dentro de 3 dias (pendente)
  if (prazo && status === 'Pendente') {
    const diffMs = prazo - hoje;
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias >= 0 && diffDias <= 3) {
      return { color: '#F59E0B', title: `Prazo em ${diffDias} dia(s)` };
    }
    // Prazo passou sem entrega
    if (diffDias < 0) {
      return { color: '#EF4444', title: 'Prazo vencido' };
    }
  }

  // Sem indicador relevante
  return null;
}

export default function Atividades() {
  const { atividades, addAtividade, removeAtividade, turmas, alunos, searchQuery } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    data: new Date().toISOString().split('T')[0],
    disciplina: '',
    alunoId: '',
    turmaId: '',
    descricao: '',
    observacao: '',
    relevancia: 'Média',
    prazoEntrega: '',
    statusEntrega: 'Pendente',
  });

  const disciplinas = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês', 'Artes', 'Educação Física', 'Outra'];

  const handleSubmit = (e) => {
    e.preventDefault();
    addAtividade(formData);
    setFormData({
      titulo: '',
      data: new Date().toISOString().split('T')[0],
      disciplina: '',
      alunoId: '',
      turmaId: '',
      descricao: '',
      observacao: '',
      relevancia: 'Média',
      prazoEntrega: '',
      statusEntrega: 'Pendente',
    });
    setShowForm(false);
  };

  const filteredAtividades = atividades.filter(a =>
    a.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alunos.find(al => al.id === a.alunoId)?.nome || '').toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.data) - new Date(a.data));

  const relevanciaColor = {
    'Alta': 'bg-error/10 text-error',
    'Média': 'bg-secondary/10 text-secondary',
    'Baixa': 'bg-surface-container-highest text-on-surface-variant',
  };

  const statusEntregaColor = {
    'Entregue no prazo': 'bg-tertiary/10 text-tertiary',
    'Entregue com atraso': 'bg-error/10 text-error',
    'Não entregue': 'bg-error/20 text-error',
    'Pendente': 'bg-surface-container-high text-on-surface-variant',
  };

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Portfólio de Atividades</h1>
          <p className="text-on-surface-variant font-inter">Registre produções textuais, desenhos e avaliações formativas.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="orange-gradient text-black px-6 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">{showForm ? 'close' : 'add_photo_alternate'}</span>
          {showForm ? 'Cancelar' : 'Nova Atividade'}
        </button>
      </div>

      {showForm && (
        <div className="glass border border-outline/30 rounded-3xl overflow-hidden relative mb-4">
          <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>
          <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            <InputGroup label="Título da Atividade" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Data" type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} required />
              <SelectGroup label="Disciplina" value={formData.disciplina} onChange={e => setFormData({ ...formData, disciplina: e.target.value })} required>
                <option value="">Selecionar...</option>
                {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
              </SelectGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectGroup label="Vincular a Turma" value={formData.turmaId} onChange={e => setFormData({ ...formData, turmaId: e.target.value, alunoId: '' })}>
                <option value="">Opcional...</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </SelectGroup>
              <SelectGroup label="Vincular a Aluno" value={formData.alunoId} onChange={e => setFormData({ ...formData, alunoId: e.target.value })} required>
                <option value="">Selecionar Aluno...</option>
                {alunos.filter(a => !formData.turmaId || a.turmaId === formData.turmaId).map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </SelectGroup>
            </div>

            {/* Novos campos: Relevância, Prazo, Status */}
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <SelectGroup label="Relevância" value={formData.relevancia} onChange={e => setFormData({ ...formData, relevancia: e.target.value })}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </SelectGroup>
              <InputGroup label="Prazo de Entrega" type="date" value={formData.prazoEntrega} onChange={e => setFormData({ ...formData, prazoEntrega: e.target.value })} />
              <SelectGroup label="Status de Entrega" value={formData.statusEntrega} onChange={e => setFormData({ ...formData, statusEntrega: e.target.value })}>
                <option value="Pendente">Pendente</option>
                <option value="Entregue no prazo">Entregue no prazo</option>
                <option value="Entregue com atraso">Entregue com atraso</option>
                <option value="Não entregue">Não entregue</option>
              </SelectGroup>
            </div>

            {/* Simulação de Upload */}
            <div className="md:col-span-1 flex flex-col gap-2">
              <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Evidência Fotográfica</label>
              <div className="w-full h-24 border-2 border-dashed border-outline/40 rounded-2xl flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                  <span className="text-xs font-bold">Clique para simular upload</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Descrição da Atividade</label>
                <textarea
                  className="w-full h-32 p-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface resize-none"
                  value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a proposta pedagógica..."
                ></textarea>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Observações do Professor</label>
                <textarea
                  className="w-full h-32 p-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface resize-none"
                  value={formData.observacao} onChange={e => setFormData({ ...formData, observacao: e.target.value })}
                  placeholder="Notas sobre o desenvolvimento do aluno nesta atividade..."
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-outline/20 flex justify-end">
              <button className="orange-gradient text-black px-8 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2" type="submit">
                <span className="material-symbols-outlined text-[20px]">save</span>
                Salvar no Portfólio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Atividades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAtividades.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant glass rounded-3xl border border-outline/30">
            Nenhuma atividade registrada ainda.
          </div>
        ) : (
          filteredAtividades.map(ativ => {
            const alunoNome = alunos.find(a => a.id === ativ.alunoId)?.nome || 'Aluno Removido';
            const indicator = getStatusIndicator(ativ);

            return (
              <div key={ativ.id} className="glass border border-outline/30 rounded-3xl p-6 hover:border-primary/30 transition-all group flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] font-black px-2 py-1 bg-primary/20 text-primary rounded-md uppercase tracking-widest">{ativ.disciplina}</span>
                      {ativ.relevancia && (
                        <span className={`text-[13px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${relevanciaColor[ativ.relevancia] || 'bg-surface-container-high text-on-surface-variant'}`}>
                          {ativ.relevancia}
                        </span>
                      )}
                    </div>
                    {/* Título com indicador visual */}
                    <div className="flex items-center gap-2 mt-1">
                      {indicator && (
                        <span
                          className="shrink-0 rounded-full"
                          style={{ width: 10, height: 10, backgroundColor: indicator.color, display: 'inline-block' }}
                          title={indicator.title}
                        ></span>
                      )}
                      <h3 className="text-xl font-outfit font-bold text-on-surface">{ativ.titulo}</h3>
                    </div>
                  </div>
                  <button onClick={() => removeAtividade(ativ.id)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-error/20 text-on-surface-variant hover:text-error flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{ativ.descricao}</p>

                {ativ.observacao && (
                  <div className="p-3 bg-surface-container rounded-xl border border-outline/30 text-xs italic text-on-surface-variant">
                    "{ativ.observacao}"
                  </div>
                )}

                {/* Status de entrega */}
                {ativ.statusEntrega && (
                  <span className={`self-start text-[13px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${statusEntregaColor[ativ.statusEntrega] || 'bg-surface-container-high text-on-surface-variant'}`}>
                    {ativ.statusEntrega}
                  </span>
                )}

                <div className="mt-auto pt-4 border-t border-outline/20 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold text-on-surface">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-outline/30 flex items-center justify-center font-black text-[12px] shrink-0"
                      style={{ backgroundColor: '#DBEAFE', color: '#1A3C6E' }}>
                      {alunoNome.charAt(0)}
                    </div>
                    {alunoNome.split(' ')[0]}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-on-surface-variant font-medium">{new Date(ativ.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    {ativ.prazoEntrega && (
                      <span className="text-[13px] text-on-surface-variant">Prazo: {new Date(ativ.prazoEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <input
        className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface placeholder:opacity-30"
        {...props}
      />
    </div>
  );
}

function SelectGroup({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <select
        className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface appearance-none"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
