import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmation from '../components/DeleteConfirmation';

const CORES_PADRAO = { primaria: '#1A3C6E', secundaria: '#F59E0B', terciaria: '#0FA77B' };
const FORM_VAZIO = {
  nome: '', cnpj: '', responsavel: '', email: '', senha: '', phone: '', address: '',
  cores: { ...CORES_PADRAO },
};

export default function Escolas() {
  const { escolas, turmas, addEscola, updateEscola, removeEscola, searchQuery } = useData();
  const { isAdmin } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(FORM_VAZIO);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <span className="material-symbols-outlined text-[48px]" style={{ color: '#CBD5E1' }}>lock</span>
        <h2 className="text-2xl font-outfit font-black" style={{ color: '#94A3B8' }}>Acesso Restrito</h2>
        <p className="text-on-surface-variant">Esta área é exclusiva para administradores LUMINA.</p>
      </div>
    );
  }

  const setCores = (campo, valor) =>
    setFormData(f => ({ ...f, cores: { ...f.cores, [campo]: valor } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const payload = { ...formData };
      if (!payload.senha) {
        const existente = escolas.find(e => e.id === editingId);
        payload.senha = existente?.senha || '';
      }
      updateEscola(editingId, payload);
      setEditingId(null);
    } else {
      addEscola(formData);
    }
    setFormData(FORM_VAZIO);
    setMostrarSenha(false);
  };

  const handleEdit = (escola) => {
    setEditingId(escola.id);
    setFormData({ ...FORM_VAZIO, ...escola, senha: '', cores: { ...CORES_PADRAO, ...(escola.cores || {}) } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = () => {
    if (turmas.some(t => t.escolaId === deleteId)) {
      alert('Não é possível excluir: existem turmas vinculadas a esta escola.');
      setDeleteId(null);
      return;
    }
    removeEscola(deleteId);
    setDeleteId(null);
  };

  const filteredEscolas = escolas.filter(e =>
    e.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.cnpj?.includes(searchQuery)
  );

  return (
    <div className="py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">
          {editingId ? 'Editar Escola' : 'Cadastro de Escolas Clientes'}
        </h1>
        <p className="text-on-surface-variant font-inter">
          Crie e gerencie os acessos das escolas clientes da plataforma LUMINA.
        </p>
      </div>

      {/* Formulário */}
      <div className="glass border border-outline/30 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50" />
        <div className="px-8 py-5 border-b border-outline/10 bg-white/5 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px]" style={{ color: '#F59E0B' }}>
            {editingId ? 'edit' : 'add_business'}
          </span>
          <span className="font-outfit font-bold text-on-surface">
            {editingId ? 'Editando Escola' : 'Nova Escola Cliente'}
          </span>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {/* Dados institucionais */}
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.15em] text-on-surface-variant mb-4">Dados Institucionais</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputGroup label="Nome da Escola" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
              <InputGroup label="CNPJ" value={formData.cnpj} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} placeholder="00.000.000/0000-00" />
              <InputGroup label="Diretor Responsável" value={formData.responsavel} onChange={e => setFormData({ ...formData, responsavel: e.target.value })} />
              <InputGroup label="Endereço" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              <InputGroup label="Telefone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          {/* Credenciais de acesso */}
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.15em] text-on-surface-variant mb-4">Credenciais de Acesso</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="E-mail de Login"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="escola@instituicao.edu"
              />
              <div className="flex flex-col gap-2 group">
                <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">
                  {editingId ? 'Nova Senha (deixe em branco para manter)' : 'Senha de Acesso *'}
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-4 pr-12 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface placeholder:opacity-30"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={e => setFormData({ ...formData, senha: e.target.value })}
                    required={!editingId}
                    placeholder={editingId ? '••••••••' : 'Mínimo 6 caracteres'}
                    minLength={editingId ? undefined : 6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    style={{ color: '#64748B' }}
                    onClick={() => setMostrarSenha(v => !v)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mostrarSenha ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Paleta de cores */}
          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.15em] text-on-surface-variant mb-1">Paleta de Cores da Escola</p>
            <p className="text-xs text-on-surface-variant mb-4">Estas cores serão aplicadas no sistema quando esta escola fizer login.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorPicker
                label="Cor Principal (Navegação)"
                value={formData.cores.primaria}
                onChange={v => setCores('primaria', v)}
              />
              <ColorPicker
                label="Cor de Destaque (Acento)"
                value={formData.cores.secundaria}
                onChange={v => setCores('secundaria', v)}
              />
              <ColorPicker
                label="Cor de Sucesso"
                value={formData.cores.terciaria}
                onChange={v => setCores('terciaria', v)}
              />
            </div>

            {/* Preview da paleta */}
            <div className="mt-4 flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#F8FAFF', border: '1px solid #E2E8F0' }}>
              <span className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">Preview:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: formData.cores.primaria }} title="Principal" />
                <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: formData.cores.secundaria }} title="Acento" />
                <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: formData.cores.terciaria }} title="Sucesso" />
              </div>
              <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: `linear-gradient(90deg, ${formData.cores.primaria}, ${formData.cores.terciaria})` }} />
            </div>
          </div>

          {/* Ações do form */}
          <div className="pt-6 border-t border-outline/20 flex items-center justify-end gap-4">
            {editingId && (
              <button
                onClick={() => { setEditingId(null); setFormData(FORM_VAZIO); setMostrarSenha(false); }}
                className="px-6 py-3 rounded-2xl border border-outline/50 text-sm font-bold hover:bg-white/5 transition-all"
                type="button"
              >
                Cancelar
              </button>
            )}
            <button
              className="orange-gradient text-black px-8 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2"
              type="submit"
            >
              <span className="material-symbols-outlined text-[20px]">{editingId ? 'save' : 'add_business'}</span>
              {editingId ? 'Salvar Alterações' : 'Criar Acesso da Escola'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de escolas */}
      <div className="glass border border-outline/30 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex items-center justify-between">
          <h3 className="font-outfit font-bold text-on-surface">Escolas Cadastradas</h3>
          <span className="px-3 py-1 rounded-full text-[13px] font-black" style={{ backgroundColor: '#DBEAFE', color: '#1A3C6E' }}>
            {filteredEscolas.length} escola{filteredEscolas.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                <th className="p-6">Escola</th>
                <th className="p-6">E-mail / Login</th>
                <th className="p-6">Responsável</th>
                <th className="p-6">Paleta</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredEscolas.map(e => (
                <tr key={e.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
                        style={{ backgroundColor: e.cores?.primaria || '#1A3C6E' }}
                      >
                        {e.nome?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{e.nome}</p>
                        <p className="text-[13px] text-on-surface-variant font-mono">{e.cnpj}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-on-surface-variant">{e.email}</p>
                    <p className="text-[13px]" style={{ color: '#0FA77B' }}>
                      {e.senha ? '● senha definida' : '⚠ sem senha'}
                    </p>
                  </td>
                  <td className="p-6 font-medium text-on-surface">{e.responsavel}</td>
                  <td className="p-6">
                    <div className="flex gap-1.5">
                      <div className="w-6 h-6 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: e.cores?.primaria || '#1A3C6E' }} title="Principal" />
                      <div className="w-6 h-6 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: e.cores?.secundaria || '#F59E0B' }} title="Acento" />
                      <div className="w-6 h-6 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: e.cores?.terciaria || '#0FA77B' }} title="Sucesso" />
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(e)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline/30">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteId(e.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-outline/30">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEscolas.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-on-surface-variant italic opacity-50">
                    Nenhuma escola cadastrada. Use o formulário acima para criar o primeiro acesso.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={!!deleteId}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        title="Excluir Escola Cliente"
        message="Tem certeza que deseja excluir esta escola? O acesso será revogado imediatamente. Esta ação é irreversível."
      />
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">
        {label}
      </label>
      <input
        className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface placeholder:opacity-30"
        {...props}
      />
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">{label}</label>
      <div className="flex items-center gap-3 h-12 px-3 bg-surface-container-low border border-outline/50 rounded-2xl">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
          style={{ minWidth: '2rem' }}
        />
        <span className="font-mono text-sm text-on-surface tracking-wider">{value}</span>
      </div>
    </div>
  );
}
