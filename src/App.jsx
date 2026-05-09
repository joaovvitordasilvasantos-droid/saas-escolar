import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Escolas from './pages/Escolas';
import Turmas from './pages/Turmas';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import Configuracoes from './pages/Configuracoes';
import Placeholder from './pages/Placeholder';

// Telas existentes
import NotasFrequencia from './pages/NotasFrequencia';
import Atividades from './pages/Atividades';
import Coordenacao from './pages/Coordenacao';
import AgendaEscolar from './pages/AgendaEscolar';

// Novas telas
import Financeiro from './pages/Financeiro';
import Desempenho from './pages/Desempenho';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública de Login */}
            <Route path="/login" element={<Login />} />

            {/* Rotas Protegidas (dentro do Layout) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="escolas" element={<AdminRoute><Escolas /></AdminRoute>} />
              <Route path="turmas" element={<Turmas />} />
              <Route path="alunos" element={<Alunos />} />
              <Route path="professores" element={<Professores />} />
              
              <Route path="notas-frequencia" element={<NotasFrequencia />} />
              <Route path="atividades" element={<Atividades />} />
              <Route path="agenda-escolar" element={<AgendaEscolar />} />
              <Route path="coordenacao" element={<Coordenacao />} />

              {/* Novas rotas */}
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="desempenho" element={<Desempenho />} />

              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="suporte" element={<Placeholder title="Suporte" />} />
            </Route>

            {/* Redirecionamento Global */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
