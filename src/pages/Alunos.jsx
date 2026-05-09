import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DeleteConfirmation from '../components/DeleteConfirmation';

export default function Alunos() {
  const navigate = useNavigate();
  const { alunos, addAluno, updateAluno, removeAluno, turmas, notas, atividades, reports, searchQuery } = useData();
  const [editingId, setEditingId] = useState(null);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '', nascimento: '', genero: '', turmaId: '', responsavel: '', phone: '', email: '', status: 'Ativo', foto: ''
  });

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result);
      setFormData(prev => ({ ...prev, foto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, frequencia: Math.floor(Math.random() * 20) + 80 };
    if (editingId) {
      updateAluno(editingId, data);
      setEditingId(null);
    } else {
      addAluno(data);
    }
    setFormData({ nome: '', nascimento: '', genero: '', turmaId: '', responsavel: '', phone: '', email: '', status: 'Ativo', foto: '' });
    setFotoPreview(null);
  };

  const handleEdit = (a) => {
    setEditingId(a.id);
    setFormData(a);
    setFotoPreview(a.foto || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ nome: '', nascimento: '', genero: '', turmaId: '', responsavel: '', phone: '', email: '', status: 'Ativo', foto: '' });
    setFotoPreview(null);
  };

  const confirmDelete = () => {
    removeAluno(deleteId);
    setDeleteId(null);
  };

  const filteredAlunos = alunos.filter(a =>
    a.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (turmas.find(t => t.id === a.turmaId)?.nome || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAlunoFrequencia = (alunoId) => {
    const notasAluno = notas.filter(n => n.alunoId === alunoId);
    if (notasAluno.length === 0) return 100;
    const totalFaltas = notasAluno.reduce((acc, curr) => acc + parseInt(curr.faltas || 0), 0);
    return Math.max(0, 100 - (totalFaltas * 0.5)).toFixed(1);
  };

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">{editingId ? 'Editar Matrícula' : 'Gestão de Alunos'}</h1>
          <p className="text-on-surface-variant font-inter">Registre novos estudantes e acompanhe perfis pedagógicos.</p>
        </div>
      </div>

      <div className="glass border border-outline/30 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>
        <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>

          <div className="md:col-span-2 flex flex-col items-center gap-3">
            <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] self-start">Foto do Aluno</label>
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 cursor-pointer group"
              style={{ borderColor: fotoPreview ? '#1A3C6E' : '#E2E8F0', backgroundColor: '#F8FAFF' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1" style={{ color: '#64748B' }}>
                  <span className="material-symbols-outlined text-[28px]">person</span>
                  <span className="text-[12px] font-bold uppercase tracking-wide">Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
            <span className="text-[13px] text-on-surface-variant">Clique para selecionar</span>
          </div>

          <InputGroup label="Nome Completo" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Data de Nascimento" type="date" value={formData.nascimento} onChange={e => setFormData({ ...formData, nascimento: e.target.value })} />
            <SelectGroup label="Turma Designada" value={formData.turmaId} onChange={e => setFormData({ ...formData, turmaId: e.target.value })} required>
              <option value="">Selecionar...</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </SelectGroup>
          </div>
          <InputGroup label="Nome do Responsável" value={formData.responsavel} onChange={e => setFormData({ ...formData, responsavel: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Telefone de Contato" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <SelectGroup label="Status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </SelectGroup>
          </div>
          <div className="md:col-span-2 pt-6 border-t border-outline/20 flex justify-end gap-4">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-2xl border border-outline/50 text-sm font-bold hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
            )}
            <button className="orange-gradient text-black px-8 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2" type="submit">
              <span className="material-symbols-outlined text-[20px]">{editingId ? 'save' : 'person_add'}</span>
              {editingId ? 'Salvar Alterações' : 'Confirmar Matrícula'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass border border-outline/30 rounded-3xl overflow-hidden flex-1">
        <div className="p-6 border-b border-outline/30 bg-surface-container-low/30">
          <h2 className="font-outfit font-bold text-on-surface">Diretório de Estudantes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                <th className="p-6">Aluno</th>
                <th className="p-6">Turma</th>
                <th className="p-6">Frequência</th>
                <th className="p-6">Situação</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredAlunos.map(a => (
                <tr key={a.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-outline/30 flex items-center justify-center font-black text-xs shrink-0"
                        style={{ backgroundColor: a.foto ? 'transparent' : '#DBEAFE', color: '#1A3C6E' }}>
                        {a.foto ? (
                          <img src={a.foto} alt={a.nome} className="w-full h-full object-cover" />
                        ) : (
                          a.nome.charAt(0)
                        )}
                      </div>
                      <span className="font-bold text-on-surface">{a.nome}</span>
                    </div>
                  </td>
                  <td className="p-6 text-on-surface-variant font-medium">
                    {turmas.find(t => t.id === a.turmaId)?.nome || '-'}
                  </td>
                  <td className="p-6 font-bold text-on-surface">{getAlunoFrequencia(a.id)}%</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-widest ${a.status === 'Ativo' ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-6 text-right flex justify-end gap-3">
                    <button onClick={() => { setSelectedAluno(a); setActiveTab('Visão Geral'); }} className="text-primary hover:glow-text font-black text-[13px] uppercase tracking-widest px-3 py-2 hover:bg-primary/10 rounded-xl transition-all">Perfil Completo</button>
                    <button onClick={() => handleEdit(a)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button onClick={() => setDeleteId(a.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline/30"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
          <div className="glass border border-outline/30 rounded-[2.5rem] shadow-glow-strong w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 p-6 z-10 flex gap-4">
              <button onClick={() => { navigate('/relatorios-ia', { state: { alunoId: selectedAluno.id } }); setSelectedAluno(null); }} className="px-6 h-10 rounded-full orange-gradient text-black font-black text-xs flex items-center gap-2 shadow-glow active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[18px]">psychology</span> Gerar Relatório IA
              </button>
              <button onClick={() => setSelectedAluno(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-10 flex gap-8 items-center shrink-0" style={{ background: 'linear-gradient(135deg, #1A3C6E 0%, #0FA77B 100%)' }}>
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/30 flex items-center justify-center font-outfit font-black text-4xl text-white shadow-2xl shrink-0"
                style={{ backgroundColor: selectedAluno.foto ? 'transparent' : 'rgba(255,255,255,0.15)' }}>
                {selectedAluno.foto ? (
                  <img src={selectedAluno.foto} alt={selectedAluno.nome} className="w-full h-full object-cover" />
                ) : (
                  selectedAluno.nome.charAt(0)
                )}
              </div>
              <div>
                <h2 className="text-4xl font-outfit font-black text-white leading-none">{selectedAluno.nome}</h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-[13px] mt-3">Matrícula: {selectedAluno.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex border-b border-outline/20 bg-surface-container-low shrink-0 px-10">
              {['Visão Geral', 'Notas e Frequência', 'Atividades', 'Relatórios'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-bold text-sm border-b-2 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-10 overflow-y-auto flex-1 bg-surface">
              {activeTab === 'Visão Geral' && (
                <div className="space-y-10">
                  <div>
                    <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary shadow-glow"></span>
                      Dados Acadêmicos e Cadastrais
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      <InfoBlock label="Turma Atual" value={turmas.find(t => t.id === selectedAluno.turmaId)?.nome} />
                      <InfoBlock label="Frequência Global" value={`${getAlunoFrequencia(selectedAluno.id)}%`} highlight />
                      <InfoBlock label="Responsável" value={selectedAluno.responsavel} />
                      <InfoBlock label="Contato" value={selectedAluno.phone} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary shadow-glow"></span>
                      Resumo de Desempenho
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {notas.filter(n => n.alunoId === selectedAluno.id).slice(0, 4).map((n, i) => (
                        <div key={i} className="p-4 bg-surface-container-low rounded-2xl border border-outline/30 flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
                            <div>
                              <span className="font-bold text-sm block">{n.disciplina}</span>
                              <span className="text-[13px] text-on-surface-variant">{n.periodo}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg font-black text-xs ${parseFloat(n.valor) < 6 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>{n.valor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Notas e Frequência' && (
                <div>
                  <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.25em] mb-6">Boletim e Histórico de Faltas</h4>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                        <th className="p-4">Disciplina</th>
                        <th className="p-4">Período</th>
                        <th className="p-4">Nota</th>
                        <th className="p-4">Faltas</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {notas.filter(n => n.alunoId === selectedAluno.id).map(n => (
                        <tr key={n.id} className="border-b border-outline/5 hover:bg-white/5">
                          <td className="p-4 font-bold">{n.disciplina}</td>
                          <td className="p-4 text-on-surface-variant">{n.periodo}</td>
                          <td className={`p-4 font-black ${parseFloat(n.valor) < 6 ? 'text-error' : 'text-primary'}`}>{n.valor}</td>
                          <td className="p-4">{n.faltas} faltas</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'Atividades' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {atividades.filter(a => a.alunoId === selectedAluno.id).map(ativ => (
                    <div key={ativ.id} className="glass border border-outline/30 rounded-3xl p-6 hover:border-primary/30 transition-all flex flex-col gap-4">
                      <span className="text-[13px] font-black px-2 py-1 bg-primary/20 text-primary rounded-md uppercase tracking-widest self-start">{ativ.disciplina}</span>
                      <h3 className="text-lg font-outfit font-bold text-on-surface leading-tight">{ativ.titulo}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{ativ.descricao}</p>
                      <span className="text-[13px] text-on-surface-variant">{new Date(ativ.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Relatórios' && (
                <div className="space-y-4">
                  {reports.filter(r => r.alunoId === selectedAluno.id).map(r => (
                    <div key={r.id} className="p-6 glass border border-outline/30 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-on-surface">Parecer Pedagógico - {r.periodo}</h4>
                        <span className={`px-2 py-1 text-[13px] font-black uppercase rounded ${r.status === 'Aprovado' ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>{r.status || 'Pendente'}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{r.content?.substring(0, 150)}...</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        title="Remover Estudante"
        message="Tem certeza que deseja remover este aluno? Todos os registros de notas, frequência e histórico escolar serão permanentemente excluídos."
      />
    </div>
  );
}

function InfoBlock({ label, value, highlight }) {
  return (
    <div className="space-y-1">
      <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-outfit font-black ${highlight ? 'text-primary glow-text' : 'text-on-surface'}`}>{value || '-'}</p>
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
