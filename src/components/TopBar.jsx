import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function TopBar({ title = "Visão Geral" }) {
  const { logout } = useAuth();
  const { searchQuery, setSearchQuery, alunos, notas, atividades } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  // Calcular alertas reais
  const alertas = useMemo(() => {
    const lista = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Alunos com frequência crítica (mais de 10 faltas)
    alunos.forEach(aluno => {
      const notasAluno = notas.filter(n => n.alunoId === aluno.id);
      const totalFaltas = notasAluno.reduce((s, n) => s + parseInt(n.faltas || 0), 0);
      if (totalFaltas > 10) {
        lista.push({
          tipo: 'frequencia',
          icon: 'warning',
          cor: '#EF4444',
          bg: '#FEE2E2',
          titulo: 'Frequência crítica',
          descricao: `${aluno.nome} — ${totalFaltas} faltas registradas`,
        });
      }
    });

    // Atividades com prazo vencendo em 24h
    atividades.forEach(atv => {
      if (!atv.prazoEntrega || atv.statusEntrega !== 'Pendente') return;
      const prazo = new Date(atv.prazoEntrega + 'T00:00:00');
      const diffMs = prazo - hoje;
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDias >= 0 && diffDias <= 1) {
        lista.push({
          tipo: 'atividade',
          icon: 'schedule',
          cor: '#F59E0B',
          bg: '#FEF3C7',
          titulo: 'Prazo vencendo',
          descricao: `${atv.titulo || 'Atividade'} — prazo em ${diffDias === 0 ? 'hoje' : '1 dia'}`,
        });
      }
    });

    return lista.slice(0, 8); // máximo 8 alertas
  }, [alunos, notas, atividades]);

  const totalAlertas = alertas.length;

  return (
    <header
      className="font-inter fixed top-0 right-14 flex justify-between items-center h-16 px-8 ml-64 w-[calc(100%-16rem-3.5rem)] z-40"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Page Title */}
      <div
        className="text-2xl font-outfit font-bold flex-1 tracking-tight"
        style={{ color: 'var(--color-primary)' }}
      >
        {title}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div
          className="relative flex items-center w-full h-10 rounded-xl overflow-hidden transition-all duration-300"
          style={{ backgroundColor: '#F8FAFF', border: '1px solid #E2E8F0' }}
        >
          <div className="grid place-items-center h-full w-12" style={{ color: '#64748B' }}>
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="peer h-full w-full outline-none text-sm pr-2 bg-transparent placeholder:text-slate-400"
            style={{ color: '#1E293B' }}
            id="search"
            placeholder="Pesquisar no sistema..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="cursor-pointer active:scale-95 w-10 h-10 rounded-xl flex items-center justify-center transition-all relative"
            style={{ color: '#64748B', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {totalAlertas > 0 ? (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[13px] font-black text-white"
                style={{ backgroundColor: '#EF4444' }}
              >
                {totalAlertas > 9 ? '9+' : totalAlertas}
              </span>
            ) : (
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#F59E0B' }}
              ></span>
            )}
          </button>

          {/* Dropdown de notificações */}
          {showNotifications && (
            <>
              {/* Overlay para fechar */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div
                className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              >
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}>
                  <span className="font-outfit font-bold text-sm" style={{ color: 'var(--color-primary)' }}>Alertas do Sistema</span>
                  {totalAlertas > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#EF4444' }}>
                      {totalAlertas}
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {alertas.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <span className="material-symbols-outlined text-[32px] block mb-2" style={{ color: '#0FA77B' }}>check_circle</span>
                      <p className="text-sm font-bold" style={{ color: '#0FA77B' }}>Tudo em ordem!</p>
                      <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Nenhum alerta no momento.</p>
                    </div>
                  ) : (
                    alertas.map((alerta, i) => (
                      <div key={i} className="px-4 py-3 flex items-start gap-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: alerta.bg }}>
                          <span className="material-symbols-outlined text-[16px]" style={{ color: alerta.cor }}>{alerta.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold" style={{ color: alerta.cor }}>{alerta.titulo}</p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: '#64748B' }}>{alerta.descricao}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logout / Profile */}
        <button
          onClick={logout}
          title="Sair do sistema"
          className="cursor-pointer active:scale-95 w-10 h-10 rounded-xl flex items-center justify-center transition-all overflow-hidden group relative"
          style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFF' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#F8FAFF'; }}
        >
          <img
            alt="Profile"
            className="w-full h-full object-cover group-hover:opacity-30 transition-opacity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUgiQKYFQUOszCOooqOYbqSzmvE-1Dta8x2PbO1rQPX1EUJhIaWlTO0iq49gs6EQOo8UuulSh3bvN-aPdpYlSw-HJmqA-OTZNxuW7IJAEA5-AuDVNPrGKQfaw_xl6pz109asTkW_o_hkFxnqeQjOlV2VhdBjNIjdmHMoEj5BYTVPKdgXodUcMpVYR_P4fG7qN6mkHXhPjJVVE2gcR1Q_X-FBz9xo4-5odehWGt0MlB4R9I3LfcVpA4pms1PrmCwWwB5cZQNwZCdV2z"
          />
          <span
            className="material-symbols-outlined absolute scale-0 group-hover:scale-100 transition-transform text-[20px]"
            style={{ color: '#EF4444' }}
          >
            logout
          </span>
        </button>
      </div>
    </header>
  );
}
