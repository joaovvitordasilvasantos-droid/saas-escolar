import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Credenciais do administrador master
const ADMIN_EMAIL = 'admin@lumina.com';
const ADMIN_SENHA = 'lumina2024';

const CORES_PADRAO = {
  primaria: '#1A3C6E',
  secundaria: '#F59E0B',
  terciaria: '#0FA77B',
};

function aplicarTema(cores) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', cores.primaria || CORES_PADRAO.primaria);
  root.style.setProperty('--color-secondary', cores.secundaria || CORES_PADRAO.secundaria);
  root.style.setProperty('--color-tertiary', cores.terciaria || CORES_PADRAO.terciaria);
}

function resetarTema() {
  const root = document.documentElement;
  root.style.removeProperty('--color-primary');
  root.style.removeProperty('--color-secondary');
  root.style.removeProperty('--color-tertiary');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pedagoai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Re-aplica o tema da escola ao recarregar a página
  useEffect(() => {
    if (user?.role === 'escola' && user.cores) {
      aplicarTema(user.cores);
    } else {
      resetarTema();
    }
  }, []);

  const login = (email, senha) => {
    if (!email || !senha) {
      return { ok: false, error: 'Preencha e-mail e senha.' };
    }

    // Verifica admin master
    if (email.trim().toLowerCase() === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      const u = { role: 'admin', nome: 'Admin LUMINA' };
      setUser(u);
      localStorage.setItem('pedagoai_user', JSON.stringify(u));
      resetarTema();
      return { ok: true };
    }

    // Verifica escolas cadastradas
    const escolas = JSON.parse(localStorage.getItem('pa_escolas') || '[]');
    const escola = escolas.find(
      e => e.email?.trim().toLowerCase() === email.trim().toLowerCase() && e.senha === senha
    );

    if (escola) {
      const cores = { ...CORES_PADRAO, ...(escola.cores || {}) };
      const u = { role: 'escola', escolaId: escola.id, nome: escola.nome, cores };
      setUser(u);
      localStorage.setItem('pedagoai_user', JSON.stringify(u));
      aplicarTema(cores);
      return { ok: true };
    }

    return { ok: false, error: 'E-mail ou senha incorretos.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pedagoai_user');
    resetarTema();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
