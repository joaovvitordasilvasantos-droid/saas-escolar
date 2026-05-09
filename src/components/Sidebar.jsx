import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Símbolo SVG do arco LUMINA
function LuminaArcIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26 Q10 8 16 6 Q22 4 28 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="#F59E0B" />
      <line x1="4" y1="26" x2="28" y2="26" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <span className="text-[13px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </span>
    </div>
  );
}

function NavItem({ item }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 group ${
          isActive
            ? 'bg-white text-[#1A3C6E] font-bold shadow-sm'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.svgIcon ? (
            <span
              className="transition-transform group-hover:scale-110 flex-shrink-0 flex items-center"
              style={{ color: isActive ? '#1A3C6E' : 'rgba(255,255,255,0.7)' }}
            >
              {item.svgIcon}
            </span>
          ) : (
            <span
              className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
              style={{ color: isActive ? '#1A3C6E' : undefined }}
            >
              {item.icon}
            </span>
          )}
          <span className="font-outfit text-base">{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { isAdmin } = useAuth();
  return (
    <nav
      className="font-inter text-sm font-medium flex flex-col h-screen fixed w-64 z-50"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {/* Brand Header */}
      <div className="h-24 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <LuminaArcIcon size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-outfit font-bold text-white tracking-tight">LUMINA</span>
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#F59E0B', opacity: 0.9 }}>
              Gestão Pedagógica
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 py-2 overflow-y-auto space-y-0.5 px-3">
        {/* Grupo Principal */}
        <NavItem item={{ name: 'Dashboard', icon: 'dashboard', path: '/dashboard' }} />
        {isAdmin && <NavItem item={{ name: 'Escolas', icon: 'domain', path: '/escolas' }} />}
        <NavItem item={{ name: 'Turmas', icon: 'groups', path: '/turmas' }} />
        <NavItem item={{ name: 'Alunos', icon: 'school', path: '/alunos' }} />
        <NavItem item={{ name: 'Professores', icon: 'record_voice_over', path: '/professores' }} />
        <NavItem item={{ name: 'Notas e Frequência', icon: 'checklist', path: '/notas-frequencia' }} />
        <NavItem item={{ name: 'Atividades', icon: 'draw', path: '/atividades' }} />
        <NavItem item={{ name: 'Portfólio', icon: 'photo_library', path: '/atividades' }} />

        {/* Grupo IA */}
        <SectionLabel label="IA" />
        <NavItem item={{
          name: 'Desempenho',
          path: '/desempenho',
          svgIcon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="10" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="7.5" y="6" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="2" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ),
        }} />


        {/* Grupo Gestão */}
        <SectionLabel label="Gestão" />
        <NavItem item={{ name: 'Financeiro', icon: 'attach_money', path: '/financeiro' }} />
        <NavItem item={{ name: 'Agenda Escolar', icon: 'calendar_month', path: '/agenda-escolar' }} />
        <NavItem item={{ name: 'Coordenação', icon: 'admin_panel_settings', path: '/coordenacao' }} />
      </div>

      {/* Footer Nav */}
      <div className="px-3 pb-4 pt-2 space-y-0.5 border-t border-white/10">
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 group ${
              isActive
                ? 'bg-white text-[#1A3C6E] font-bold shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12" style={{ color: isActive ? '#1A3C6E' : undefined }}>settings</span>
              <span className="font-outfit text-sm">Configurações</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/suporte"
          className={({ isActive }) =>
            `px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 active:scale-95 group ${
              isActive
                ? 'bg-white text-[#1A3C6E] font-bold shadow-sm'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12" style={{ color: isActive ? '#1A3C6E' : undefined }}>help</span>
              <span className="font-outfit text-sm">Suporte</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
