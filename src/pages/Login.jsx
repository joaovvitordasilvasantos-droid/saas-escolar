import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LuminaArcHero() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 98 Q30 30 60 22 Q85 15 105 38" stroke="rgba(255,255,255,0.9)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M15 98 Q35 50 60 40 Q82 30 105 50" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="105" cy="38" r="10" fill="#F59E0B" />
      <circle cx="105" cy="38" r="5" fill="#FCD34D" />
      <line x1="15" y1="98" x2="105" y2="98" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LuminaArcSmall() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 33 Q12 10 20 8 Q28 6 35 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="14" r="4" fill="#F59E0B" />
      <line x1="5" y1="33" x2="35" y2="33" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, senha);
      setLoading(false);
      if (result.ok) {
        navigate('/dashboard');
      } else {
        setErro(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex w-full font-inter" style={{ backgroundColor: '#F8FAFF' }}>
      {/* Esquerda: Visual de Marca LUMINA */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#1A3C6E' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(245,158,11,0.4) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(15,167,123,0.3) 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 p-16 max-w-xl flex flex-col items-center text-center">
          <div className="mb-10"><LuminaArcHero /></div>
          <h1 className="text-6xl font-outfit font-black text-white mb-4 tracking-tight">LUMINA</h1>
          <p className="text-lg font-bold mb-3" style={{ color: '#F59E0B' }}>
            Gestão Pedagógica com Inteligência
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            A plataforma definitiva para gestão educacional. Controle total, insights em tempo real e relatórios com IA integrada.
          </p>

          <div className="mt-12 flex gap-12">
            <div className="text-center">
              <p className="text-3xl font-outfit font-black text-white">100%</p>
              <p className="text-[13px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Nacional</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-outfit font-black text-white">IA</p>
              <p className="text-[13px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Integrada</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-outfit font-black text-white">24/7</p>
              <p className="text-[13px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Suporte</p>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Formulário */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 relative bg-white">
        <div className="w-full max-w-[420px] space-y-10">

          {/* Logo mobile */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#1A3C6E' }}>
              <LuminaArcSmall />
            </div>
            <h1 className="text-3xl font-outfit font-black" style={{ color: '#1A3C6E' }}>LUMINA</h1>
            <p className="text-sm font-medium mt-1" style={{ color: '#64748B' }}>Gestão Pedagógica com Inteligência</p>
          </div>

          {/* Cabeçalho */}
          <div className="space-y-2">
            <h3 className="text-4xl font-outfit font-black tracking-tight" style={{ color: '#1A3C6E' }}>
              Bem-vindo.
            </h3>
            <p className="font-medium" style={{ color: '#64748B' }}>
              Insira suas credenciais para acessar o portal.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* E-mail */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold uppercase tracking-widest block" style={{ color: '#64748B' }} htmlFor="email">
                Identificador E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: '#64748B' }}>
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </div>
                <input
                  className="w-full pl-12 pr-4 h-14 rounded-2xl outline-none transition-all text-sm"
                  style={{ backgroundColor: '#F8FAFF', border: `1px solid ${erro ? '#EF4444' : '#E2E8F0'}`, color: '#1E293B' }}
                  id="email"
                  placeholder="escola@instituicao.edu"
                  required
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErro(''); }}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold uppercase tracking-widest block" style={{ color: '#64748B' }} htmlFor="password">
                Chave de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: '#64748B' }}>
                  <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                </div>
                <input
                  className="w-full pl-12 pr-4 h-14 rounded-2xl outline-none transition-all text-sm"
                  style={{ backgroundColor: '#F8FAFF', border: `1px solid ${erro ? '#EF4444' : '#E2E8F0'}`, color: '#1E293B' }}
                  id="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(''); }}
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <span className="material-symbols-outlined text-[20px] flex-shrink-0" style={{ color: '#EF4444' }}>error</span>
                <p className="text-sm font-bold" style={{ color: '#EF4444' }}>{erro}</p>
              </div>
            )}

            {/* Botão */}
            <button
              className={`w-full h-14 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}`}
              style={{ backgroundColor: '#1A3C6E' }}
              type="submit"
              disabled={loading}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = '#F59E0B'; e.currentTarget.style.color = '#1A3C6E'; } }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A3C6E'; e.currentTarget.style.color = '#FFFFFF'; }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }} />
              ) : (
                <>
                  Acessar Painel
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] font-bold uppercase tracking-[0.2em] pt-6" style={{ color: '#CBD5E1' }}>
            Segurança Criptografada • LUMINA v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
