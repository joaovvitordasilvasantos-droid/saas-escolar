import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Configuracoes() {
  const { config, setConfig } = useData();
  const { logout } = useAuth();

  const handleSave = (e) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="py-8 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Preferências do <span className="text-primary glow-text">Sistema</span></h2>
        <p className="text-on-surface-variant font-inter">Personalize a identidade e o período letivo da sua instituição.</p>
      </div>

      <div className="glass border border-outline/30 rounded-[2rem] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>
        <div className="p-8 border-b border-outline/10 font-outfit font-bold bg-white/5">Identidade Institucional</div>
        <form className="p-8 space-y-8" onSubmit={handleSave}>
          <div className="space-y-6">
            <InputGroup 
              label="Nome da Instituição" 
              value={config.instituicao} 
              onChange={e => setConfig({...config, instituicao: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-6">
              <InputGroup 
                label="Ano Letivo Atual" 
                value={config.anoLetivo} 
                onChange={e => setConfig({...config, anoLetivo: e.target.value})}
              />
              <InputGroup 
                label="Bimestre em Curso" 
                value={config.bimestre} 
                onChange={e => setConfig({...config, bimestre: e.target.value})}
              />
            </div>
          </div>
          <button className="orange-gradient w-full py-4 text-black rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all">
            Salvar Alterações
          </button>
        </form>
      </div>

      {/* Seção Meu Plano */}
      <div className="glass border border-outline/30 rounded-[2rem] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 amber-gradient opacity-70"></div>
        <div className="p-8 border-b border-outline/10 font-outfit font-bold bg-white/5 flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#F59E0B' }}>workspace_premium</span>
          <span>Meu Plano</span>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#F8FAFF', border: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A3C6E 0%, #0FA77B 100%)' }}>
                <span className="material-symbols-outlined text-white text-[22px]">star</span>
              </div>
              <div>
                <p className="font-outfit font-black text-base" style={{ color: '#1A3C6E' }}>Plano Profissional</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Ativo até 31/12/2026</p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-black" style={{ backgroundColor: '#D1FAE5', color: '#0FA77B' }}>ATIVO</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Funcionalidades Incluídas</p>
            {[
              { icon: 'check_circle', label: 'Gestão de alunos, turmas e professores', ok: true },
              { icon: 'check_circle', label: 'Notas, frequência e portfólio', ok: true },
              { icon: 'check_circle', label: 'Relatórios IA e Lumina Predict', ok: true },
              { icon: 'check_circle', label: 'Lumina Coach e Boletim Inteligente', ok: true },
              { icon: 'check_circle', label: 'Módulo Financeiro completo', ok: true },
              { icon: 'radio_button_unchecked', label: 'Multi-escola (disponível no Institucional)', ok: false },
              { icon: 'radio_button_unchecked', label: 'API personalizada e integrações', ok: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className="material-symbols-outlined text-[18px]" style={{ color: item.ok ? '#0FA77B' : '#CBD5E1' }}>{item.icon}</span>
                <span className="text-sm" style={{ color: item.ok ? '#1E293B' : '#94A3B8' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#1A3C6E' }}>
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            Fazer upgrade para Institucional
          </button>
        </div>
      </div>

      <div className="glass border border-outline/30 rounded-[2rem] overflow-hidden relative">
        <div className="p-8 border-b border-outline/10 font-outfit font-bold bg-white/5 text-error">Área de Segurança</div>
        <div className="p-8 space-y-6">
           <p className="text-sm text-on-surface-variant leading-relaxed">Você está autenticado com privilégios administrativos. Para garantir a integridade dos dados, encerre a sessão após o uso.</p>
           <button 
             onClick={logout}
             className="w-full py-4 border border-error/30 text-error rounded-2xl font-black text-sm hover:bg-error/10 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             <span className="material-symbols-outlined text-[20px]">logout</span>
             Encerrar Sessão
           </button>
        </div>
      </div>
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
