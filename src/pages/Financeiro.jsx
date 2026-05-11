import { useState, useMemo } from 'react';
import AIReportCard, { AILoading } from '../components/AIReportCard';

const MOCK_MENSALIDADES = [
  { id: '1', alunoNome: 'Ana Beatriz Silva', turma: '5º Ano A', valor: 850, vencimento: '2026-04-05', status: 'pago', dataPagamento: '2026-04-03', observacao: '' },
  { id: '2', alunoNome: 'Carlos Eduardo Souza', turma: '3º Ano B', valor: 850, vencimento: '2026-04-05', status: 'pendente', dataPagamento: '', observacao: '' },
  { id: '3', alunoNome: 'Mariana Costa', turma: '7º Ano A', valor: 950, vencimento: '2026-03-05', status: 'atrasado', dataPagamento: '', observacao: 'Responsável avisado por telefone' },
  { id: '4', alunoNome: 'Pedro Henrique Lima', turma: '1º Ano A', valor: 750, vencimento: '2026-04-10', status: 'pago', dataPagamento: '2026-04-08', observacao: '' },
  { id: '5', alunoNome: 'Juliana Ferreira', turma: '6º Ano B', valor: 950, vencimento: '2026-03-10', status: 'negociando', dataPagamento: '', observacao: 'Parcelamento em 2x acordado' },
  { id: '6', alunoNome: 'Rafael Oliveira', turma: '4º Ano A', valor: 850, vencimento: '2026-04-05', status: 'pendente', dataPagamento: '', observacao: '' },
  { id: '7', alunoNome: 'Isabela Santos', turma: '2º Ano B', valor: 750, vencimento: '2026-03-05', status: 'atrasado', dataPagamento: '', observacao: '' },
  { id: '8', alunoNome: 'Lucas Mendes', turma: '8º Ano A', valor: 1050, vencimento: '2026-04-05', status: 'pago', dataPagamento: '2026-04-05', observacao: '' },
];

const MOCK_PROFESSORES_PAG = [
  { id: '1', professorNome: 'Prof. Roberto Alves', disciplina: 'Matemática', horasAula: 40, valorHora: 45, totalBruto: 1800, descontos: 180, totalLiquido: 1620, mesReferencia: '2026-04', status: 'pago', dataPagamento: '2026-04-25' },
  { id: '2', professorNome: 'Profa. Carla Mendes', disciplina: 'Português', horasAula: 36, valorHora: 45, totalBruto: 1620, descontos: 162, totalLiquido: 1458, mesReferencia: '2026-04', status: 'pendente', dataPagamento: '' },
  { id: '3', professorNome: 'Prof. André Lima', disciplina: 'Ciências', horasAula: 32, valorHora: 40, totalBruto: 1280, descontos: 128, totalLiquido: 1152, mesReferencia: '2026-04', status: 'pendente', dataPagamento: '' },
  { id: '4', professorNome: 'Profa. Fernanda Costa', disciplina: 'História', horasAula: 28, valorHora: 40, totalBruto: 1120, descontos: 112, totalLiquido: 1008, mesReferencia: '2026-04', status: 'pago', dataPagamento: '2026-04-25' },
];

const MOCK_CUSTOS = [
  { id: '1', descricao: 'Conta de energia elétrica', categoria: 'Utilities', valor: 1200, data: '2026-04-05', tipo: 'fixo', comprovante: '' },
  { id: '2', descricao: 'Material de limpeza', categoria: 'Material escolar', valor: 350, data: '2026-04-08', tipo: 'variavel', comprovante: '' },
  { id: '3', descricao: 'Manutenção ar-condicionado', categoria: 'Manutenção', valor: 800, data: '2026-04-12', tipo: 'variavel', comprovante: '' },
  { id: '4', descricao: 'Internet e telefone', categoria: 'Tecnologia', valor: 450, data: '2026-04-05', tipo: 'fixo', comprovante: '' },
  { id: '5', descricao: 'Serviço de contabilidade', categoria: 'Serviços terceiros', valor: 600, data: '2026-04-10', tipo: 'fixo', comprovante: '' },
  { id: '6', descricao: 'Impressão de material didático', categoria: 'Material escolar', valor: 280, data: '2026-04-15', tipo: 'variavel', comprovante: '' },
];

const CATEGORIAS_CUSTO = ['Manutenção', 'Material escolar', 'Serviços terceiros', 'Utilities', 'Marketing', 'Tecnologia', 'Outros'];
const TURMAS_OPCOES = ['1º Ano A', '1º Ano B', '2º Ano A', '2º Ano B', '3º Ano A', '3º Ano B', '4º Ano A', '4º Ano B', '5º Ano A', '5º Ano B', '6º Ano A', '6º Ano B', '7º Ano A', '7º Ano B', '8º Ano A', '8º Ano B', '9º Ano A', '9º Ano B'];

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const statusBadge = {
  pago: { label: 'Pago', color: '#0FA77B', bg: '#D1FAE5' },
  pendente: { label: 'Pendente', color: '#F59E0B', bg: '#FEF3C7' },
  atrasado: { label: 'Atrasado', color: '#EF4444', bg: '#FEE2E2' },
  negociando: { label: 'Negociando', color: '#3B82F6', bg: '#DBEAFE' },
};

function StatusBadge({ status }) {
  const s = statusBadge[status] || statusBadge.pendente;
  return (
    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ color: s.color, backgroundColor: s.bg }}>
      {s.label}
    </span>
  );
}

function SummaryCard({ title, value, icon, borderColor, textColor }) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-2" style={{ border: `1px solid ${borderColor || '#E2E8F0'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{title}</span>
        <span className="material-symbols-outlined text-[20px]" style={{ color: borderColor || '#1A3C6E' }}>{icon}</span>
      </div>
      <span className="text-2xl font-outfit font-black" style={{ color: textColor || '#1A3C6E' }}>{value}</span>
    </div>
  );
}

function AbaMensalidades() {
  const [mensalidades, setMensalidades] = useState(MOCK_MENSALIDADES);
  const [form, setForm] = useState({ alunoNome: '', turma: '', valor: '', vencimento: '', status: 'pendente', dataPagamento: '', observacao: '' });
  const [editId, setEditId] = useState(null);

  const totais = useMemo(() => ({
    previsto: mensalidades.reduce((s, m) => s + Number(m.valor), 0),
    recebido: mensalidades.filter(m => m.status === 'pago').reduce((s, m) => s + Number(m.valor), 0),
    aberto: mensalidades.filter(m => m.status === 'pendente').reduce((s, m) => s + Number(m.valor), 0),
    inadimplente: mensalidades.filter(m => m.status === 'atrasado').reduce((s, m) => s + Number(m.valor), 0),
  }), [mensalidades]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.alunoNome || !form.valor || !form.vencimento) return alert('Preencha os campos obrigatórios.');
    if (editId) {
      setMensalidades(prev => prev.map(m => m.id === editId ? { ...m, ...form, valor: Number(form.valor) } : m));
      setEditId(null);
    } else {
      setMensalidades(prev => [...prev, { ...form, id: crypto.randomUUID(), valor: Number(form.valor) }]);
    }
    setForm({ alunoNome: '', turma: '', valor: '', vencimento: '', status: 'pendente', dataPagamento: '', observacao: '' });
  };

  const handleEdit = (m) => {
    setEditId(m.id);
    setForm({ ...m, valor: String(m.valor) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Excluir esta mensalidade?')) setMensalidades(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Previsto" value={fmt(totais.previsto)} icon="account_balance_wallet" />
        <SummaryCard title="Total Recebido" value={fmt(totais.recebido)} icon="check_circle" borderColor="#0FA77B" textColor="#0FA77B" />
        <SummaryCard title="Em Aberto" value={fmt(totais.aberto)} icon="pending" borderColor="#F59E0B" textColor="#F59E0B" />
        <SummaryCard title="Inadimplente" value={fmt(totais.inadimplente)} icon="warning" borderColor="#EF4444" textColor="#EF4444" />
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-4" style={{ color: '#1A3C6E' }}>
          {editId ? 'Editar Mensalidade' : 'Registrar Mensalidade'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Nome do Aluno *</label>
            <input className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.alunoNome} onChange={e => setForm(p => ({ ...p, alunoNome: e.target.value }))} placeholder="Nome completo" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Turma</label>
            <select className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.turma} onChange={e => setForm(p => ({ ...p, turma: e.target.value }))}>
              <option value="">Selecionar...</option>
              {TURMAS_OPCOES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Valor R$ *</label>
            <input type="number" min="0" step="0.01" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Vencimento *</label>
            <input type="date" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.vencimento} onChange={e => setForm(p => ({ ...p, vencimento: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Status</label>
            <select className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
              <option value="negociando">Negociando</option>
            </select>
          </div>
          {form.status === 'pago' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Data de Pagamento</label>
              <input type="date" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.dataPagamento} onChange={e => setForm(p => ({ ...p, dataPagamento: e.target.value }))} />
            </div>
          )}
          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Observação</label>
            <textarea className="px-3 py-2 rounded-lg border text-sm resize-none" rows={2} style={{ borderColor: '#E2E8F0' }} value={form.observacao} onChange={e => setForm(p => ({ ...p, observacao: e.target.value }))} placeholder="Opcional..." />
          </div>
          <div className="flex gap-3 md:col-span-2 lg:col-span-3">
            <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95" style={{ backgroundColor: '#1A3C6E' }}>
              {editId ? 'Salvar Alterações' : 'Registrar Mensalidade'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ alunoNome: '', turma: '', valor: '', vencimento: '', status: 'pendente', dataPagamento: '', observacao: '' }); }} className="px-6 py-2.5 rounded-lg text-sm font-bold border transition-all" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFF', borderBottom: '1px solid #E2E8F0' }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Aluno</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Turma</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Valor</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Vencimento</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mensalidades.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: m.status === 'atrasado' ? '#FFF5F5' : 'transparent' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1E293B' }}>{m.alunoNome}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{m.turma}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#1A3C6E' }}>{fmt(m.valor)}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{m.vencimento ? new Date(m.vencimento + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(m)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-blue-50" style={{ color: '#3B82F6' }} title="Editar">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50" style={{ color: '#EF4444' }} title="Excluir">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mensalidades.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm italic" style={{ color: '#94A3B8' }}>Nenhuma mensalidade registrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AbaProfessores() {
  const [pagamentos, setPagamentos] = useState(MOCK_PROFESSORES_PAG);
  const [form, setForm] = useState({ professorNome: '', disciplina: '', horasAula: '', valorHora: '', descontos: '', mesReferencia: '', status: 'pendente', dataPagamento: '' });
  const [editId, setEditId] = useState(null);

  const totalBruto = useMemo(() => (Number(form.horasAula) || 0) * (Number(form.valorHora) || 0), [form.horasAula, form.valorHora]);
  const totalLiquido = useMemo(() => totalBruto - (Number(form.descontos) || 0), [totalBruto, form.descontos]);

  const totais = useMemo(() => ({
    folha: pagamentos.reduce((s, p) => s + Number(p.totalLiquido), 0),
    pago: pagamentos.filter(p => p.status === 'pago').reduce((s, p) => s + Number(p.totalLiquido), 0),
    pendente: pagamentos.filter(p => p.status === 'pendente').reduce((s, p) => s + Number(p.totalLiquido), 0),
  }), [pagamentos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.professorNome || !form.horasAula || !form.valorHora) return alert('Preencha os campos obrigatórios.');
    const entry = { ...form, horasAula: Number(form.horasAula), valorHora: Number(form.valorHora), totalBruto, descontos: Number(form.descontos) || 0, totalLiquido };
    if (editId) {
      setPagamentos(prev => prev.map(p => p.id === editId ? { ...p, ...entry } : p));
      setEditId(null);
    } else {
      setPagamentos(prev => [...prev, { ...entry, id: crypto.randomUUID() }]);
    }
    setForm({ professorNome: '', disciplina: '', horasAula: '', valorHora: '', descontos: '', mesReferencia: '', status: 'pendente', dataPagamento: '' });
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...p, horasAula: String(p.horasAula), valorHora: String(p.valorHora), descontos: String(p.descontos) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Excluir este pagamento?')) setPagamentos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Folha do Mês" value={fmt(totais.folha)} icon="payments" />
        <SummaryCard title="Total Pago" value={fmt(totais.pago)} icon="check_circle" borderColor="#0FA77B" textColor="#0FA77B" />
        <SummaryCard title="Total Pendente" value={fmt(totais.pendente)} icon="pending" borderColor="#F59E0B" textColor="#F59E0B" />
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-4" style={{ color: '#1A3C6E' }}>
          {editId ? 'Editar Pagamento' : 'Registrar Pagamento de Professor'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Nome do Professor *</label>
            <input className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.professorNome} onChange={e => setForm(p => ({ ...p, professorNome: e.target.value }))} placeholder="Nome completo" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Disciplina</label>
            <input className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.disciplina} onChange={e => setForm(p => ({ ...p, disciplina: e.target.value }))} placeholder="Ex: Matemática" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Horas Aula no Mês *</label>
            <input type="number" min="0" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.horasAula} onChange={e => setForm(p => ({ ...p, horasAula: e.target.value }))} placeholder="0" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Valor por Hora R$ *</label>
            <input type="number" min="0" step="0.01" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.valorHora} onChange={e => setForm(p => ({ ...p, valorHora: e.target.value }))} placeholder="0,00" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Total Bruto (calculado)</label>
            <div className="h-10 px-3 rounded-lg border flex items-center text-sm font-bold" style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFF', color: '#1A3C6E' }}>
              {fmt(totalBruto)}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Descontos R$</label>
            <input type="number" min="0" step="0.01" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.descontos} onChange={e => setForm(p => ({ ...p, descontos: e.target.value }))} placeholder="0,00" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Total Líquido (calculado)</label>
            <div className="h-10 px-3 rounded-lg border flex items-center text-sm font-bold" style={{ borderColor: '#0FA77B', backgroundColor: '#D1FAE5', color: '#0FA77B' }}>
              {fmt(totalLiquido)}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Mês de Referência</label>
            <input type="month" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.mesReferencia} onChange={e => setForm(p => ({ ...p, mesReferencia: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Status</label>
            <select className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </div>
          {form.status === 'pago' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Data de Pagamento</label>
              <input type="date" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.dataPagamento} onChange={e => setForm(p => ({ ...p, dataPagamento: e.target.value }))} />
            </div>
          )}
          <div className="flex gap-3 md:col-span-2 lg:col-span-3">
            <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95" style={{ backgroundColor: '#1A3C6E' }}>
              {editId ? 'Salvar Alterações' : 'Registrar Pagamento'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ professorNome: '', disciplina: '', horasAula: '', valorHora: '', descontos: '', mesReferencia: '', status: 'pendente', dataPagamento: '' }); }} className="px-6 py-2.5 rounded-lg text-sm font-bold border transition-all" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFF', borderBottom: '1px solid #E2E8F0' }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Professor</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Disciplina</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Horas</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Total Líquido</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Mês Ref.</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1E293B' }}>{p.professorNome}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{p.disciplina}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{p.horasAula}h</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#1A3C6E' }}>{fmt(p.totalLiquido)}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{p.mesReferencia || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-blue-50" style={{ color: '#3B82F6' }}>
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50" style={{ color: '#EF4444' }}>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pagamentos.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm italic" style={{ color: '#94A3B8' }}>Nenhum pagamento registrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AbaCustos({ mensalidadesData, professoresData }) {
  const [custos, setCustos] = useState(MOCK_CUSTOS);
  const [form, setForm] = useState({ descricao: '', categoria: '', valor: '', data: new Date().toISOString().split('T')[0], tipo: 'variavel', comprovante: '' });
  const [editId, setEditId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const totais = useMemo(() => ({
    total: custos.reduce((s, c) => s + Number(c.valor), 0),
    fixo: custos.filter(c => c.tipo === 'fixo').reduce((s, c) => s + Number(c.valor), 0),
    variavel: custos.filter(c => c.tipo === 'variavel').reduce((s, c) => s + Number(c.valor), 0),
  }), [custos]);

  const receitaBruta = mensalidadesData.filter(m => m.status === 'pago').reduce((s, m) => s + Number(m.valor), 0);
  const folhaProfessores = professoresData.reduce((s, p) => s + Number(p.totalLiquido), 0);
  const custosOperacionais = totais.total;
  const resultado = receitaBruta - folhaProfessores - custosOperacionais;

  const mesesGrafico = [
    { mes: 'Nov', receita: 5800, despesas: 4200 },
    { mes: 'Dez', receita: 5200, despesas: 4800 },
    { mes: 'Jan', receita: 6100, despesas: 4500 },
    { mes: 'Fev', receita: 6400, despesas: 4600 },
    { mes: 'Mar', receita: 6200, despesas: 5100 },
    { mes: 'Abr', receita: receitaBruta || 6800, despesas: folhaProfessores + custosOperacionais || 5238 },
  ];
  const maxVal = Math.max(...mesesGrafico.flatMap(m => [m.receita, m.despesas, m.receita - m.despesas]));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.descricao || !form.valor) return alert('Preencha os campos obrigatórios.');
    if (editId) {
      setCustos(prev => prev.map(c => c.id === editId ? { ...c, ...form, valor: Number(form.valor) } : c));
      setEditId(null);
    } else {
      setCustos(prev => [...prev, { ...form, id: crypto.randomUUID(), valor: Number(form.valor) }]);
    }
    setForm({ descricao: '', categoria: '', valor: '', data: new Date().toISOString().split('T')[0], tipo: 'variavel', comprovante: '' });
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ ...c, valor: String(c.valor) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm('Excluir este custo?')) setCustos(prev => prev.filter(c => c.id !== id));
  };

  const custosFiltrados = filtroCategoria ? custos.filter(c => c.categoria === filtroCategoria) : custos;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total de Custos" value={fmt(totais.total)} icon="trending_down" borderColor="#EF4444" textColor="#EF4444" />
        <SummaryCard title="Custos Fixos" value={fmt(totais.fixo)} icon="lock" />
        <SummaryCard title="Custos Variáveis" value={fmt(totais.variavel)} icon="swap_vert" borderColor="#F59E0B" textColor="#F59E0B" />
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-1" style={{ color: '#1A3C6E' }}>Evolução Financeira — Últimos 6 Meses</h3>
        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#1A3C6E' }}></span> Receita</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#EF4444' }}></span> Despesas</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#0FA77B' }}></span> Margem</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {mesesGrafico.map((m, i) => {
            const margem = m.receita - m.despesas;
            const hReceita = maxVal > 0 ? (m.receita / maxVal) * 100 : 0;
            const hDespesas = maxVal > 0 ? (m.despesas / maxVal) * 100 : 0;
            const hMargem = maxVal > 0 ? (Math.max(0, margem) / maxVal) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-32">
                  <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${hReceita}%`, backgroundColor: '#1A3C6E' }} title={`Receita: ${fmt(m.receita)}`}></div>
                  <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${hDespesas}%`, backgroundColor: '#EF4444' }} title={`Despesas: ${fmt(m.despesas)}`}></div>
                  <div className="flex-1 rounded-t-sm transition-all" style={{ height: `${hMargem}%`, backgroundColor: '#0FA77B' }} title={`Margem: ${fmt(margem)}`}></div>
                </div>
                <span className="text-xs font-bold" style={{ color: '#64748B' }}>{m.mes}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-4" style={{ color: '#1A3C6E' }}>DRE Simplificado — Mês Atual</h3>
        <div className="space-y-2 max-w-sm">
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span className="text-sm font-medium" style={{ color: '#1E293B' }}>Receita Bruta</span>
            <span className="text-sm font-bold" style={{ color: '#0FA77B' }}>{fmt(receitaBruta)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span className="text-sm" style={{ color: '#64748B' }}>(-) Folha de Professores</span>
            <span className="text-sm font-bold" style={{ color: '#EF4444' }}>- {fmt(folhaProfessores)}</span>
          </div>
          <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span className="text-sm" style={{ color: '#64748B' }}>(-) Custos Operacionais</span>
            <span className="text-sm font-bold" style={{ color: '#EF4444' }}>- {fmt(custosOperacionais)}</span>
          </div>
          <div className="flex justify-between items-center py-3 rounded-lg px-3" style={{ backgroundColor: resultado >= 0 ? '#D1FAE5' : '#FEE2E2' }}>
            <span className="text-sm font-bold" style={{ color: resultado >= 0 ? '#0FA77B' : '#EF4444' }}>(=) Resultado do Mês</span>
            <span className="text-lg font-black" style={{ color: resultado >= 0 ? '#0FA77B' : '#EF4444' }}>{fmt(resultado)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-4" style={{ color: '#1A3C6E' }}>
          {editId ? 'Editar Custo' : 'Registrar Custo'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Descrição *</label>
            <input className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descrição do custo" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Categoria</label>
            <select className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}>
              <option value="">Selecionar...</option>
              {CATEGORIAS_CUSTO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Valor R$ *</label>
            <input type="number" min="0" step="0.01" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Data</label>
            <input type="date" className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Tipo</label>
            <select className="h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E2E8F0' }} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
              <option value="fixo">Fixo</option>
              <option value="variavel">Variável</option>
            </select>
          </div>
          <div className="flex gap-3 md:col-span-2 lg:col-span-3">
            <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95" style={{ backgroundColor: '#1A3C6E' }}>
              {editId ? 'Salvar Alterações' : 'Registrar Custo'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ descricao: '', categoria: '', valor: '', data: new Date().toISOString().split('T')[0], tipo: 'variavel', comprovante: '' }); }} className="px-6 py-2.5 rounded-lg text-sm font-bold border transition-all" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
          <span className="text-sm font-bold" style={{ color: '#1A3C6E' }}>Lançamentos de Custos</span>
          <select className="h-8 px-3 rounded-lg border text-xs" style={{ borderColor: '#E2E8F0' }} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas as categorias</option>
            {CATEGORIAS_CUSTO.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFF', borderBottom: '1px solid #E2E8F0' }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Valor</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Data</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Tipo</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {custosFiltrados.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1E293B' }}>{c.descricao}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{c.categoria || '-'}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#EF4444' }}>{fmt(c.valor)}</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{c.data ? new Date(c.data + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ color: c.tipo === 'fixo' ? '#1A3C6E' : '#F59E0B', backgroundColor: c.tipo === 'fixo' ? '#DBEAFE' : '#FEF3C7' }}>
                      {c.tipo === 'fixo' ? 'Fixo' : 'Variável'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-blue-50" style={{ color: '#3B82F6' }}>
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50" style={{ color: '#EF4444' }}>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {custosFiltrados.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm italic" style={{ color: '#94A3B8' }}>Nenhum custo registrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AbaSentinela({ mensalidadesData, professoresData, custosData }) {
  const [loadingIA, setLoadingIA] = useState(false);
  const [analiseIA, setAnaliseIA] = useState('');

  const totalAlunos = mensalidadesData.length;
  const inadimplentes = mensalidadesData.filter(m => m.status === 'atrasado').length;
  const taxaInadimplencia = totalAlunos > 0 ? (inadimplentes / totalAlunos) * 100 : 0;

  const receitaMes = mensalidadesData.filter(m => m.status === 'pago').reduce((s, m) => s + Number(m.valor), 0);
  const despesasMes = professoresData.reduce((s, p) => s + Number(p.totalLiquido), 0) + custosData.reduce((s, c) => s + Number(c.valor), 0);
  const ratioDespesas = receitaMes > 0 ? (despesasMes / receitaMes) * 100 : 0;

  const hoje = new Date();
  const vencidas30 = mensalidadesData.filter(m => {
    if (m.status !== 'atrasado') return false;
    const venc = new Date(m.vencimento + 'T00:00:00');
    return (hoje - venc) / (1000 * 60 * 60 * 24) > 30;
  }).length;

  let nivelAlerta = 'verde';
  const alertas = [];

  if (taxaInadimplencia > 20) {
    nivelAlerta = 'vermelho';
    alertas.push({ nivel: 'vermelho', titulo: 'Inadimplência Crítica', descricao: `${taxaInadimplencia.toFixed(1)}% dos alunos estão inadimplentes (acima de 20%)`, acao: 'Contatar responsáveis imediatamente e oferecer negociação' });
  } else if (taxaInadimplencia > 10) {
    if (nivelAlerta !== 'vermelho') nivelAlerta = 'amarelo';
    alertas.push({ nivel: 'amarelo', titulo: 'Inadimplência Elevada', descricao: `${taxaInadimplencia.toFixed(1)}% dos alunos estão inadimplentes (entre 10-20%)`, acao: 'Enviar lembretes e agendar reuniões com responsáveis' });
  }

  if (ratioDespesas > 80) {
    nivelAlerta = 'vermelho';
    alertas.push({ nivel: 'vermelho', titulo: 'Despesas Críticas', descricao: `Despesas representam ${ratioDespesas.toFixed(1)}% da receita (acima de 80%)`, acao: 'Revisar custos operacionais e buscar redução imediata' });
  } else if (ratioDespesas > 60) {
    if (nivelAlerta !== 'vermelho') nivelAlerta = 'amarelo';
    alertas.push({ nivel: 'amarelo', titulo: 'Despesas Elevadas', descricao: `Despesas representam ${ratioDespesas.toFixed(1)}% da receita (entre 60-80%)`, acao: 'Monitorar gastos e identificar oportunidades de economia' });
  }

  if (vencidas30 >= 3) {
    nivelAlerta = 'vermelho';
    alertas.push({ nivel: 'vermelho', titulo: 'Mensalidades Vencidas há 30+ dias', descricao: `${vencidas30} mensalidades vencidas há mais de 30 dias`, acao: 'Iniciar processo de cobrança formal ou negociação de parcelamento' });
  }

  if (alertas.length === 0) {
    alertas.push({ nivel: 'verde', titulo: 'Saúde Financeira Normal', descricao: 'Todos os indicadores estão dentro dos parâmetros aceitáveis', acao: 'Continue monitorando mensalmente para manter a saúde financeira' });
  }

  const alertaColors = {
    vermelho: { bg: '#FEE2E2', border: '#EF4444', text: '#EF4444', icon: '🔴' },
    amarelo: { bg: '#FEF3C7', border: '#F59E0B', text: '#F59E0B', icon: '🟡' },
    verde: { bg: '#D1FAE5', border: '#0FA77B', text: '#0FA77B', icon: '🟢' },
  };

  const receitaPotencial = mensalidadesData.reduce((s, m) => s + Number(m.valor), 0);
  const despesasFixas = professoresData.reduce((s, p) => s + Number(p.totalLiquido), 0) + custosData.filter(c => c.tipo === 'fixo').reduce((s, c) => s + Number(c.valor), 0);
  const projecoes = [
    { mes: 'Mai/26', otimista: receitaPotencial - despesasFixas, pessimista: receitaPotencial * (1 - taxaInadimplencia / 100) - despesasFixas },
    { mes: 'Jun/26', otimista: receitaPotencial - despesasFixas, pessimista: receitaPotencial * (1 - taxaInadimplencia / 100) - despesasFixas * 1.02 },
    { mes: 'Jul/26', otimista: receitaPotencial * 1.02 - despesasFixas, pessimista: receitaPotencial * (1 - taxaInadimplencia / 100) * 0.98 - despesasFixas * 1.04 },
  ];
  const maxProj = Math.max(...projecoes.flatMap(p => [Math.abs(p.otimista), Math.abs(p.pessimista)]));

  const handleAnaliseIA = async () => {
    setLoadingIA(true);
    setAnaliseIA('');
    try {
      const dadosFinanceiros = {
        inadimplencia: `${taxaInadimplencia.toFixed(1)}%`,
        totalAlunos,
        inadimplentes,
        receitaMes: fmt(receitaMes),
        despesasMes: fmt(despesasMes),
        ratioDespesas: `${ratioDespesas.toFixed(1)}%`,
        resultado: fmt(receitaMes - despesasMes),
        vencidas30,
      };

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `Você é um consultor financeiro especializado em gestão de escolas particulares de pequeno e médio porte.
Analise os dados financeiros fornecidos e gere um relatório executivo estruturado em:
📊 DIAGNÓSTICO (situação atual em 2 linhas)
⚠️ RISCOS IDENTIFICADOS (lista de até 3 riscos)
📈 OPORTUNIDADES (1-2 pontos de melhoria)
🎯 AÇÕES PRIORITÁRIAS (lista de 3 ações para os próximos 30 dias)
Use linguagem direta para um diretor escolar, não para um contador.

Dados financeiros da escola:
- Taxa de inadimplência: ${dadosFinanceiros.inadimplencia} (${dadosFinanceiros.inadimplentes} de ${dadosFinanceiros.totalAlunos} alunos)
- Receita do mês: ${dadosFinanceiros.receitaMes}
- Despesas do mês: ${dadosFinanceiros.despesasMes}
- Despesas como % da receita: ${dadosFinanceiros.ratioDespesas}
- Resultado do mês: ${dadosFinanceiros.resultado}
- Mensalidades vencidas há mais de 30 dias: ${dadosFinanceiros.vencidas30}`
          }]
        })
      });

      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      setAnaliseIA(data.content[0].text);
    } catch {
      setAnaliseIA('⚠️ Não foi possível conectar à IA. Verifique a chave de API nas configurações.\n\nDados disponíveis para análise manual:\n• Inadimplência: ' + taxaInadimplencia.toFixed(1) + '%\n• Ratio despesas/receita: ' + ratioDespesas.toFixed(1) + '%\n• Mensalidades vencidas 30+ dias: ' + vencidas30);
    } finally {
      setLoadingIA(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 flex items-center gap-4" style={{ border: '1px solid #E2E8F0' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
          <span className="material-symbols-outlined text-[28px]" style={{ color: '#1A3C6E' }}>shield</span>
        </div>
        <div>
          <h2 className="font-outfit font-black text-xl" style={{ color: '#1A3C6E' }}>Sentinela Financeiro</h2>
          <p className="text-sm" style={{ color: '#64748B' }}>IA monitorando a saúde financeira da escola</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: alertaColors[nivelAlerta].bg, color: alertaColors[nivelAlerta].text, border: `1px solid ${alertaColors[nivelAlerta].border}` }}>
            {alertaColors[nivelAlerta].icon} {nivelAlerta === 'verde' ? 'Saudável' : nivelAlerta === 'amarelo' ? 'Atenção' : 'Crítico'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alertas.map((alerta, i) => {
          const c = alertaColors[alerta.nivel];
          return (
            <div key={i} className="rounded-xl p-4" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: c.text }}>{alerta.titulo}</p>
                  <p className="text-xs mt-1" style={{ color: '#1E293B' }}>{alerta.descricao}</p>
                  <p className="text-xs mt-2 font-medium" style={{ color: '#64748B' }}>💡 {alerta.acao}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAnaliseIA}
          disabled={loadingIA}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: '#1A3C6E', opacity: loadingIA ? 0.7 : 1 }}
        >
          {loadingIA ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              Analisando dados...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              Análise Completa da Saúde Financeira
            </>
          )}
        </button>
      </div>

      {loadingIA && <AILoading />}

      {analiseIA && <AIReportCard texto={analiseIA} tipo="financeiro" />}

      <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #E2E8F0' }}>
        <h3 className="font-outfit font-bold text-base mb-1" style={{ color: '#1A3C6E' }}>Projeção de Fluxo de Caixa — Próximos 3 Meses</h3>
        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#0FA77B' }}></span> Cenário Otimista (0% inadimplência nova)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#EF4444' }}></span> Cenário Pessimista (inadimplência atual mantida)</span>
        </div>
        <div className="flex items-end gap-6 h-32">
          {projecoes.map((p, i) => {
            const hOtimista = maxProj > 0 ? (Math.max(0, p.otimista) / maxProj) * 100 : 0;
            const hPessimista = maxProj > 0 ? (Math.max(0, p.pessimista) / maxProj) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 h-24">
                  <div className="flex-1 rounded-t-sm" style={{ height: `${hOtimista}%`, backgroundColor: '#0FA77B' }} title={`Otimista: ${fmt(p.otimista)}`}></div>
                  <div className="flex-1 rounded-t-sm" style={{ height: `${hPessimista}%`, backgroundColor: '#EF4444' }} title={`Pessimista: ${fmt(p.pessimista)}`}></div>
                </div>
                <span className="text-xs font-bold" style={{ color: '#64748B' }}>{p.mes}</span>
                <span className="text-[13px]" style={{ color: '#0FA77B' }}>{fmt(p.otimista)}</span>
                <span className="text-[13px]" style={{ color: '#EF4444' }}>{fmt(p.pessimista)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Financeiro() {
  const [abaAtiva, setAbaAtiva] = useState('mensalidades');

  const mensalidadesData = MOCK_MENSALIDADES;
  const professoresData = MOCK_PROFESSORES_PAG;
  const custosData = MOCK_CUSTOS;

  const abas = [
    { id: 'mensalidades', label: 'Mensalidades', icon: 'receipt_long' },
    { id: 'professores', label: 'Professores', icon: 'payments' },
    { id: 'custos', label: 'Custos', icon: 'trending_down' },
    { id: 'sentinela', label: 'Sentinela IA', icon: 'shield' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-outfit font-black tracking-tight" style={{ color: '#1A3C6E' }}>Gestão Financeira</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Controle completo de mensalidades, pagamentos e custos operacionais.</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F1F5F9', width: 'fit-content' }}>
        {abas.map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              backgroundColor: abaAtiva === aba.id ? '#FFFFFF' : 'transparent',
              color: abaAtiva === aba.id ? '#1A3C6E' : '#64748B',
              boxShadow: abaAtiva === aba.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <span className="material-symbols-outlined text-[18px]">{aba.icon}</span>
            {aba.label}
          </button>
        ))}
      </div>

      {abaAtiva === 'mensalidades' && <AbaMensalidades />}
      {abaAtiva === 'professores' && <AbaProfessores />}
      {abaAtiva === 'custos' && <AbaCustos mensalidadesData={mensalidadesData} professoresData={professoresData} />}
      {abaAtiva === 'sentinela' && <AbaSentinela mensalidadesData={mensalidadesData} professoresData={professoresData} custosData={custosData} />}
    </div>
  );
}
