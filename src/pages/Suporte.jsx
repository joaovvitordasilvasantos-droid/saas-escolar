import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const quickCards = [
  { icon: 'school', title: 'Cadastrar aluno', desc: 'Acesse Alunos > Novo Aluno e preencha o formulário.' },
  { icon: 'checklist', title: 'Lançar notas', desc: 'Em Notas e Frequência, selecione a turma e registre as avaliações.' },
  { icon: 'how_to_reg', title: 'Registrar frequência', desc: 'Na mesma tela de Notas, alterne para a aba Frequência.' },
  { icon: 'analytics', title: 'Gerar relatório', desc: 'Acesse Desempenho para visualizar e exportar relatórios.' },
  { icon: 'attach_money', title: 'Financeiro', desc: 'Em Financeiro, gerencie mensalidades, pagamentos e inadimplência.' },
  { icon: 'calendar_month', title: 'Agenda escolar', desc: 'Em Agenda Escolar, cadastre eventos, provas e reuniões.' },
];

const faqs = [
  {
    q: 'Como cadastrar um novo aluno?',
    a: 'Vá em Alunos no menu lateral, clique em "Novo Aluno", preencha os dados e salve. O aluno ficará vinculado à turma selecionada.',
  },
  {
    q: 'Como lançar notas e frequência?',
    a: 'Acesse Notas e Frequência, escolha a turma e o período. Preencha as notas na grade e confirme. A frequência está na aba ao lado.',
  },
  {
    q: 'Como consultar mensalidades pendentes?',
    a: 'No módulo Financeiro, filtre por status "Pendente" para visualizar todos os alunos com mensalidades em aberto.',
  },
  {
    q: 'Como cadastrar professores?',
    a: 'Acesse Professores no menu, clique em "Novo Professor" e preencha as informações de contato e disciplinas.',
  },
  {
    q: 'Como gerar relatórios de desempenho?',
    a: 'Acesse Desempenho no menu. Os gráficos são gerados automaticamente com base nos dados lançados no sistema.',
  },
  {
    q: 'Como alterar dados da instituição?',
    a: 'Em Configurações (disponível para administradores), edite o nome da instituição, ano letivo e bimestre em curso.',
  },
];

const categorias = [
  'Erro técnico',
  'Alunos e turmas',
  'Notas e frequência',
  'Financeiro',
  'Agenda escolar',
  'Acesso e permissões',
  'Outros',
];

const prioridades = ['Baixa', 'Média', 'Alta', 'Urgente'];

export default function Suporte() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({
    nome: user?.nome || '',
    perfil: user?.role === 'admin' ? 'Administrador' : 'Escola',
    categoria: '',
    prioridade: 'Média',
    descricao: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.categoria || !form.descricao.trim()) return;
    setEnviado(true);
    setForm(f => ({ ...f, categoria: '', descricao: '' }));
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="py-8 flex flex-col gap-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-outfit font-black text-on-surface tracking-tight">
          Central de <span className="text-primary glow-text">Suporte</span>
        </h2>
        <p className="text-on-surface-variant font-inter">
          Encontre ajuda, abra chamados e acompanhe orientações do sistema.
        </p>
      </div>

      {/* Cards rápidos */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#64748B' }}>Guias rápidos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickCards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border p-5 flex gap-4 items-start shadow-sm"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EFF6FF' }}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#1A3C6E' }}>{card.icon}</span>
              </div>
              <div>
                <p className="font-outfit font-bold text-sm" style={{ color: '#1E293B' }}>{card.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748B' }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
        <div className="p-6 border-b font-outfit font-bold flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#1A3C6E' }}>quiz</span>
          Perguntas frequentes
        </div>
        <div className="divide-y" style={{ borderColor: '#E2E8F0' }}>
          {faqs.map((item, i) => (
            <div key={i}>
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-inter font-semibold text-sm" style={{ color: '#1E293B' }}>{item.q}</span>
                <span className="material-symbols-outlined text-[18px] flex-shrink-0 transition-transform" style={{ color: '#94A3B8', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulário de chamado */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden" style={{ borderColor: '#E2E8F0' }}>
        <div className="p-6 border-b font-outfit font-bold flex items-center gap-3" style={{ borderColor: '#E2E8F0' }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#F59E0B' }}>support_agent</span>
          Abrir chamado
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {enviado && (
            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="text-sm font-semibold">Chamado enviado com sucesso! Nossa equipe retornará em até 24 horas úteis.</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SupportInput
              label="Nome"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              required
            />
            <SupportInput
              label="Perfil"
              value={form.perfil}
              onChange={e => setForm(f => ({ ...f, perfil: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Categoria</label>
              <select
                className="h-12 px-4 rounded-2xl border text-sm outline-none"
                style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                value={form.categoria}
                onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                required
              >
                <option value="">Selecione...</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Prioridade</label>
              <select
                className="h-12 px-4 rounded-2xl border text-sm outline-none"
                style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                value={form.prioridade}
                onChange={e => setForm(f => ({ ...f, prioridade: e.target.value }))}
              >
                {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Descrição</label>
            <textarea
              className="w-full p-4 rounded-2xl border text-sm outline-none resize-none"
              style={{ borderColor: '#E2E8F0', color: '#1E293B', minHeight: 120 }}
              placeholder="Descreva o problema ou dúvida com o máximo de detalhes possível..."
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #1A3C6E 0%, #0FA77B 100%)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            Enviar chamado
          </button>
        </form>
      </div>

      {/* Contato rápido + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border shadow-sm p-6 space-y-4" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[20px]" style={{ color: '#1A3C6E' }}>contacts</span>
            <span className="font-outfit font-bold">Contato rápido</span>
          </div>
          {[
            { icon: 'chat', label: 'WhatsApp', value: '(00) 00000-0000' },
            { icon: 'mail', label: 'E-mail', value: 'suporte@lumina.app' },
            { icon: 'schedule', label: 'Horário', value: 'Segunda a sexta, 08h às 18h' },
            { icon: 'timer', label: 'Resposta em', value: 'até 24 horas úteis' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]" style={{ color: '#94A3B8' }}>{item.icon}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>{item.label}: </span>
                <span className="text-sm font-semibold" style={{ color: '#1E293B' }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] border shadow-sm p-6 space-y-4" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#0FA77B' }} />
            <span className="font-outfit font-bold">Status do sistema</span>
            <span className="ml-auto px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Online</span>
          </div>
          {[
            { label: 'Versão', value: 'MVP 1.0' },
            { label: 'Última atualização', value: 'Maio de 2026' },
            { label: 'Módulos ativos', value: 'Gestão escolar, financeiro, agenda, relatórios' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>{item.label}</span>
              <span className="text-sm" style={{ color: '#1E293B' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{label}</label>
      <input
        className="h-12 px-4 rounded-2xl border text-sm outline-none"
        style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
        {...props}
      />
    </div>
  );
}
