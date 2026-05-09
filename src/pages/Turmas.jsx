import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import DeleteConfirmation from '../components/DeleteConfirmation';

export default function Turmas() {
  const { turmas, addTurma, updateTurma, removeTurma, professores, escolas, alunos, searchQuery } = useData();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', serie: '', turno: '', professorId: '', escolaId: '', ano: '2024', limite: '30'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTurma(editingId, formData);
      setEditingId(null);
    } else {
      addTurma(formData);
    }
    setFormData({ nome: '', serie: '', turno: '', professorId: '', escolaId: '', ano: '2024', limite: '30' });
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = () => {
    const hasAlunos = alunos.some(a => a.turmaId === deleteId);
    if (hasAlunos) {
      alert('Esta turma possui alunos matriculados. Transfira ou remova os alunos antes de excluir a turma.');
      setDeleteId(null);
      return;
    }
    removeTurma(deleteId);
    setDeleteId(null);
  };

  const filteredTurmas = turmas.filter(t => 
    t.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.serie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">{editingId ? 'Editar Turma' : 'Cadastro de Turmas'}</h1>
          <p className="text-on-surface-variant font-inter">Crie e gerencie as seções de turmas institucionais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-1 glass border border-outline/30 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>
          <div className="p-6 border-b border-outline/20 bg-surface-container-low/30 font-outfit font-bold text-on-surface">
             {editingId ? 'Editar Registro' : 'Nova Turma'}
          </div>
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <InputGroup label="Nome / Código" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
            
            <div className="grid grid-cols-2 gap-4">
              <SelectGroup label="Série" value={formData.serie} onChange={e => setFormData({...formData, serie: e.target.value})} required>
                <option value="">Selecione...</option>
                <option value="9º Ano">9º Ano</option>
                <option value="1º Médio">1º Médio</option>
                <option value="2º Médio">2º Médio</option>
                <option value="3º Médio">3º Médio</option>
              </SelectGroup>
              <SelectGroup label="Turno" value={formData.turno} onChange={e => setFormData({...formData, turno: e.target.value})} required>
                <option value="">Selecione...</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </SelectGroup>
            </div>

            <SelectGroup label="Unidade Escolar" value={formData.escolaId} onChange={e => setFormData({...formData, escolaId: e.target.value})} required>
              <option value="">Vincular Escola...</option>
              {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </SelectGroup>

            <SelectGroup label="Docente Responsável" value={formData.professorId} onChange={e => setFormData({...formData, professorId: e.target.value})}>
              <option value="">Vincular Professor...</option>
              {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </SelectGroup>

            <div className="grid grid-cols-2 gap-4">
               <InputGroup label="Ano Letivo" type="number" value={formData.ano} onChange={e => setFormData({...formData, ano: e.target.value})} />
               <InputGroup label="Capacidade" type="number" value={formData.limite} onChange={e => setFormData({...formData, limite: e.target.value})} />
            </div>

            <div className="pt-6 border-t border-outline/20 flex justify-end gap-3">
              {editingId && <button onClick={() => {setEditingId(null); setFormData({nome:'',serie:'',turno:'',professorId:'',escolaId:'',ano:'2024',limite:'30'})}} className="px-4 py-2 text-xs font-bold border border-outline/50 rounded-xl hover:bg-white/5" type="button">Cancelar</button>}
              <button className="orange-gradient text-black px-6 py-3 rounded-2xl font-black text-xs shadow-glow hover:shadow-glow-strong active:scale-95 transition-all" type="submit">
                {editingId ? 'Atualizar Dados' : 'Salvar Turma'}
              </button>
            </div>
          </form>
        </div>

        <div className="xl:col-span-2 glass border border-outline/30 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-outline/30 bg-surface-container-low/30">
            <h3 className="font-outfit font-bold text-on-surface">Turmas Cadastradas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                  <th className="p-6">Identificação</th>
                  <th className="p-6">Série / Turno</th>
                  <th className="p-6">Unidade</th>
                  <th className="p-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTurmas.map(t => (
                  <tr key={t.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors group">
                    <td className="p-6 font-bold text-on-surface">{t.nome}</td>
                    <td className="p-6">
                       <p className="text-on-surface font-medium">{t.serie}</p>
                       <p className="text-[13px] text-primary font-black uppercase tracking-widest mt-1">{t.turno}</p>
                    </td>
                    <td className="p-6 text-on-surface-variant font-medium text-xs">
                       {escolas.find(e => e.id === t.escolaId)?.nome || '-'}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(t)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onClick={() => setDeleteId(t.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline/30"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTurmas.length === 0 && (
                  <tr><td colSpan="4" className="p-12 text-center text-on-surface-variant italic opacity-50">Nenhuma turma encontrada.</td></tr>
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
        title="Excluir Turma"
        message="Tem certeza que deseja excluir esta turma? Todos os diários e registros de aula vinculados serão perdidos."
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

function SelectGroup({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <select className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface appearance-none" {...props}>
        {children}
      </select>
    </div>
  );
}
