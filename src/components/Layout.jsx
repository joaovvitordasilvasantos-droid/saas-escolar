import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import RightBar from './RightBar';

const routeTitles = {
  '/dashboard': 'Dashboard Institucional',
  '/escolas': 'Gestão de Escolas',
  '/turmas': 'Gestão de Turmas',
  '/alunos': 'Gestão de Alunos',
  '/professores': 'Gestão de Professores',
  '/notas-frequencia': 'Notas e Frequência',
  '/atividades': 'Portfólio de Atividades',
  '/relatorios-ia': 'Relatórios Inteligentes',
  '/agenda-escolar': 'Agenda Escolar',
  '/coordenacao': 'Coordenação Pedagógica',
  '/financeiro': 'Gestão Financeira',

  '/boletim-inteligente': 'Boletim Inteligente',
  '/configuracoes': 'Configurações do Sistema',
  '/suporte': 'Central de Suporte',
};

export default function Layout() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Visão Geral';

  return (
    <div
      className="min-h-screen flex text-on-surface selection:bg-primary/20 selection:text-primary"
      style={{ backgroundColor: '#F8FAFF' }}
    >
      <Sidebar />
      <RightBar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="ml-64 mr-14 mt-16 p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
