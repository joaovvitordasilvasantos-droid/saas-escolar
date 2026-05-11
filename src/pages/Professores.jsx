import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import DeleteConfirmation from '../components/DeleteConfirmation';

export default function Professores() {
  const { professores, turmas, addProfessor, updateProfessor, removeProfessor, searchQuery } = useData();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nome: '', email: '', phone: '', disciplina: '', status: 'Ativo', foto: ''
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
    if (editingId) {
      updateProfessor(editingId, formData);
      setEditingId(null);
    } else {
      addProfessor(formData);
    }
    setFormData({ nome: '', email: '', phone: '', disciplina: '', status: 'Ativo', foto: '' });
    setFotoPreview(null);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData(p);
    setFotoPreview(p.foto || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', phone: '', disciplina: '', status: 'Ativo', foto: '' });
    setFotoPreview(null);
  };

  const confirmDelete = () => {
    const isLinked = turmas.some(t => t.professorId === deleteId);
    if (isLinked) {
      alert('Este professor possui turmas vinculadas. Reatribua as turmas a outro docente antes de excluir.');
      setDeleteId(null);
      return;
    }
    removeProfessor(deleteId);
    setDeleteId(null);
  };

  const filteredProfessores = professores.filter(p =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.disciplina.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">{editingId ? 'Editar Professor' : 'Corpo Docente'}</h1>
        <p className="text-on-surface-variant font-inter">Gerencie os profissionais de ensino e suas atribuições.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 glass border border-outline/30 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>
          <div className="p-6 border-b border-outline/20 bg-surface-container-low/30 font-outfit font-bold text-on-surface">
            {editingId ? 'Editar Perfil' : 'Novo Professor'}
          </div>
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>

            {/* Campo de Foto */}
            <div className="flex flex-col items-center gap-3">
              <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] self-start">Foto do Professor</label>
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
            <InputGroup label="E-mail de Contato" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <InputGroup label="Telefone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />

            <div className="flex flex-col gap-2 group">
              <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">Disciplina Principal</label>
              <select className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface appearance-none" value={formData.disciplina} onChange={e => setFormData({ ...formData, disciplina: e.target.value })} required>
                <option value="">Selecionar área...</option>
                <option value="Matemática">Matemática</option>
                <option value="Ciências">Ciências</option>
                <option value="História">História</option>
                <option value="Português">Português</option>
                <option value="Inglês">Inglês</option>
                <option value="Artes">Artes</option>
              </select>
            </div>

            <div className="pt-6 border-t border-outline/20 flex justify-end gap-3">
              {editingId && (
                <button onClick={handleCancel} className="px-4 py-2 text-xs font-bold border border-outline/50 rounded-xl hover:bg-white/5" type="button">
                  Cancelar
                </button>
              )}
              <button className="orange-gradient text-black px-6 py-3 rounded-2xl font-black text-xs shadow-glow hover:shadow-glow-strong active:scale-95 transition-all" type="submit">
                {editingId ? 'Salvar Alterações' : 'Cadastrar Professor'}
              </button>
            </div>
          </form>
        </div>

        <div className="xl:col-span-8 glass border border-outline/30 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-outline/30 bg-surface-container-low/30">
            <h3 className="font-outfit font-bold text-on-surface">Lista de Docentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                  <th className="p-6">Professor</th>
                  <th className="p-6">Disciplina</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProfessores.map(p => (
                  <tr key={p.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline/30 flex items-center justify-center font-black text-xs shrink-0"
                          style={{ backgroundColor: p.foto ? 'transparent' : '#DBEAFE', color: '#1A3C6E' }}>
                          {p.foto ? (
                            <img src={p.foto} alt={p.nome} className="w-full h-full object-cover" />
                          ) : (
                            p.nome.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{p.nome}</div>
                          <div className="text-[13px] text-on-surface-variant font-medium tracking-tight">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-outfit font-bold text-primary">{p.disciplina}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-widest bg-primary text-white">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-6 text-right flex justify-end gap-3">
                      <button onClick={() => handleEdit(p)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline/30">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProfessores.length === 0 && (
                  <tr><td colSpan="4" className="p-12 text-center text-on-surface-variant italic opacity-50">Nenhum professor encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        title="Remover Professor"
        message="Tem certeza que deseja remover este professor do quadro docente? Esta ação não removerá as turmas, mas deixará a disciplina sem responsável."
      />
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <input className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface placeholder:opacity-30" {...props} />
    </div>
  );
}
