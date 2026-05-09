// src/data/dadosTeste.js
// Dados de teste realistas para o sistema LUMINA

// ─── ESCOLAS ──────────────────────────────────────────────────────────────────

const escolas = [
  {
    id: 'esc-001',
    nome: 'Colégio Lumina São Paulo',
    cnpj: '12.345.678/0001-90',
    responsavel: 'Dr. Roberto Carvalho',
    email: 'contato@luminasp.edu.br',
    phone: '(11) 3456-7890',
    address: 'Rua das Flores, 123 - Vila Madalena, SP',
    cores: { primaria: '#1A3C6E', secundaria: '#F59E0B', terciaria: '#0FA77B' },
  },
  {
    id: 'esc-002',
    nome: 'Instituto Lumina Campinas',
    cnpj: '98.765.432/0001-10',
    responsavel: 'Dra. Ana Paula Ferreira',
    email: 'contato@luminacampinas.edu.br',
    phone: '(19) 3456-7890',
    address: 'Av. Brasil, 456 - Centro, Campinas, SP',
    cores: { primaria: '#0D5C63', secundaria: '#EF6C00', terciaria: '#2E7D32' },
  },
  {
    id: 'esc-003',
    nome: 'Escola Lumina Belo Horizonte',
    cnpj: '45.678.901/0001-23',
    responsavel: 'Prof. Carlos Eduardo Lima',
    email: 'contato@luminabh.edu.br',
    phone: '(31) 3456-7890',
    address: 'Rua da Paz, 789 - Savassi, BH, MG',
    cores: { primaria: '#4A148C', secundaria: '#F59E0B', terciaria: '#00695C' },
  },
];

// ─── TURMAS ───────────────────────────────────────────────────────────────────

const turmas = [
  { id: 'tur-001', nome: '3º Ano A', serie: '3º Ano', turno: 'Manhã',  escolaId: 'esc-001', anoLetivo: 2026, capacidade: 30 },
  { id: 'tur-002', nome: '3º Ano B', serie: '3º Ano', turno: 'Tarde',  escolaId: 'esc-001', anoLetivo: 2026, capacidade: 30 },
  { id: 'tur-003', nome: '4º Ano A', serie: '4º Ano', turno: 'Manhã',  escolaId: 'esc-001', anoLetivo: 2026, capacidade: 28 },
  { id: 'tur-004', nome: '5º Ano A', serie: '5º Ano', turno: 'Manhã',  escolaId: 'esc-002', anoLetivo: 2026, capacidade: 32 },
  { id: 'tur-005', nome: '2º Ano A', serie: '2º Ano', turno: 'Manhã',  escolaId: 'esc-002', anoLetivo: 2026, capacidade: 25 },
  { id: 'tur-006', nome: '1º Ano A', serie: '1º Ano', turno: 'Tarde',  escolaId: 'esc-003', anoLetivo: 2026, capacidade: 20 },
];

// ─── PROFESSORES ──────────────────────────────────────────────────────────────

const professores = [
  { id: 'prof-001', nome: 'Ana Paula Mendes',    email: 'ana.paula@lumina.app',      telefone: '(11) 98765-4321', disciplina: 'Português',         status: 'Ativo',   escolaId: 'esc-001' },
  { id: 'prof-002', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@lumina.app',    telefone: '(11) 97654-3210', disciplina: 'Matemática',        status: 'Ativo',   escolaId: 'esc-001' },
  { id: 'prof-003', nome: 'Fernanda Costa',      email: 'fernanda.costa@lumina.app', telefone: '(11) 96543-2109', disciplina: 'Ciências',          status: 'Ativo',   escolaId: 'esc-001' },
  { id: 'prof-004', nome: 'Marcos Oliveira',     email: 'marcos.oliveira@lumina.app',telefone: '(19) 95432-1098', disciplina: 'História',          status: 'Ativo',   escolaId: 'esc-002' },
  { id: 'prof-005', nome: 'Juliana Santos',      email: 'juliana.santos@lumina.app', telefone: '(19) 94321-0987', disciplina: 'Geografia',         status: 'Ativo',   escolaId: 'esc-002' },
  { id: 'prof-006', nome: 'Ricardo Pereira',     email: 'ricardo.pereira@lumina.app',telefone: '(31) 93210-9876', disciplina: 'Educação Física',   status: 'Ativo',   escolaId: 'esc-003' },
  { id: 'prof-007', nome: 'Beatriz Almeida',     email: 'beatriz.almeida@lumina.app',telefone: '(11) 92109-8765', disciplina: 'Artes',             status: 'Ativo',   escolaId: 'esc-001' },
  { id: 'prof-008', nome: 'Paulo Roberto Silva', email: 'paulo.silva@lumina.app',    telefone: '(11) 91098-7654', disciplina: 'Inglês',            status: 'Inativo', escolaId: 'esc-001' },
];

// ─── ALUNOS ───────────────────────────────────────────────────────────────────

const alunos = [
  // tur-001 · 3º Ano A (esc-001) — 5 alunos
  { id: 'alu-001', nome: 'Lucas Oliveira',       dataNascimento: '2015-03-14', turmaId: 'tur-001', escolaId: 'esc-001', responsavel: 'Maria Oliveira',       telefone: '(11) 98765-1234', status: 'Ativo'   },
  { id: 'alu-002', nome: 'Maria Silva',           dataNascimento: '2015-06-22', turmaId: 'tur-001', escolaId: 'esc-001', responsavel: 'João Silva',           telefone: '(11) 97654-2345', status: 'Ativo'   },
  { id: 'alu-003', nome: 'Pedro Santos',          dataNascimento: '2015-09-10', turmaId: 'tur-001', escolaId: 'esc-001', responsavel: 'Carla Santos',         telefone: '(11) 96543-3456', status: 'Ativo'   },
  { id: 'alu-004', nome: 'Ana Beatriz Costa',     dataNascimento: '2015-12-05', turmaId: 'tur-001', escolaId: 'esc-001', responsavel: 'Roberto Costa',        telefone: '(11) 95432-4567', status: 'Ativo'   },
  { id: 'alu-005', nome: 'João Gabriel Lima',     dataNascimento: '2016-02-18', turmaId: 'tur-001', escolaId: 'esc-001', responsavel: 'Sandra Lima',          telefone: '(11) 94321-5678', status: 'Ativo'   },
  // tur-002 · 3º Ano B (esc-001) — 4 alunos
  { id: 'alu-006', nome: 'Isabela Ferreira',      dataNascimento: '2015-07-30', turmaId: 'tur-002', escolaId: 'esc-001', responsavel: 'Paulo Ferreira',       telefone: '(11) 93210-6789', status: 'Ativo'   },
  { id: 'alu-007', nome: 'Matheus Rodrigues',     dataNascimento: '2015-11-15', turmaId: 'tur-002', escolaId: 'esc-001', responsavel: 'Luciana Rodrigues',    telefone: '(11) 92109-7890', status: 'Ativo'   },
  { id: 'alu-008', nome: 'Larissa Almeida',       dataNascimento: '2016-04-08', turmaId: 'tur-002', escolaId: 'esc-001', responsavel: 'Sérgio Almeida',       telefone: '(11) 91098-8901', status: 'Ativo'   },
  { id: 'alu-009', nome: 'Gabriel Souza',         dataNascimento: '2015-08-25', turmaId: 'tur-002', escolaId: 'esc-001', responsavel: 'Patrícia Souza',       telefone: '(11) 90987-9012', status: 'Inativo' },
  // tur-003 · 4º Ano A (esc-001) — 4 alunos
  { id: 'alu-010', nome: 'Sofia Pereira',         dataNascimento: '2014-12-12', turmaId: 'tur-003', escolaId: 'esc-001', responsavel: 'Marcelo Pereira',      telefone: '(11) 89876-0123', status: 'Ativo'   },
  { id: 'alu-011', nome: 'Enzo Carvalho',         dataNascimento: '2014-09-19', turmaId: 'tur-003', escolaId: 'esc-001', responsavel: 'Renata Carvalho',      telefone: '(11) 88765-1234', status: 'Ativo'   },
  { id: 'alu-012', nome: 'Laura Martins',         dataNascimento: '2015-01-27', turmaId: 'tur-003', escolaId: 'esc-001', responsavel: 'Antônio Martins',      telefone: '(11) 87654-2345', status: 'Ativo'   },
  { id: 'alu-013', nome: 'Gustavo Rocha',         dataNascimento: '2014-06-03', turmaId: 'tur-003', escolaId: 'esc-001', responsavel: 'Fernanda Rocha',       telefone: '(11) 86543-3456', status: 'Inativo' },
  // tur-004 · 5º Ano A (esc-002) — 3 alunos
  { id: 'alu-014', nome: 'Valentina Nascimento',  dataNascimento: '2013-10-17', turmaId: 'tur-004', escolaId: 'esc-002', responsavel: 'Eduardo Nascimento',   telefone: '(19) 85432-4567', status: 'Ativo'   },
  { id: 'alu-015', nome: 'Bernardo Castro',       dataNascimento: '2013-05-22', turmaId: 'tur-004', escolaId: 'esc-002', responsavel: 'Cristina Castro',      telefone: '(19) 84321-5678', status: 'Ativo'   },
  { id: 'alu-016', nome: 'Manuela Ribeiro',       dataNascimento: '2013-08-14', turmaId: 'tur-004', escolaId: 'esc-002', responsavel: 'Felipe Ribeiro',       telefone: '(19) 83210-6789', status: 'Ativo'   },
  // tur-005 · 2º Ano A (esc-002) — 2 alunos
  { id: 'alu-017', nome: 'Arthur Gomes',          dataNascimento: '2016-11-09', turmaId: 'tur-005', escolaId: 'esc-002', responsavel: 'Adriana Gomes',        telefone: '(19) 82109-7890', status: 'Ativo'   },
  { id: 'alu-018', nome: 'Helena Barbosa',        dataNascimento: '2017-02-28', turmaId: 'tur-005', escolaId: 'esc-002', responsavel: 'Rafael Barbosa',       telefone: '(19) 81098-8901', status: 'Ativo'   },
  // tur-006 · 1º Ano A (esc-003) — 2 alunos
  { id: 'alu-019', nome: 'Miguel Teixeira',       dataNascimento: '2018-04-16', turmaId: 'tur-006', escolaId: 'esc-003', responsavel: 'Daniela Teixeira',     telefone: '(31) 80987-9012', status: 'Ativo'   },
  { id: 'alu-020', nome: 'Alice Cardoso',         dataNascimento: '2018-07-23', turmaId: 'tur-006', escolaId: 'esc-003', responsavel: 'Leonardo Cardoso',     telefone: '(31) 79876-0123', status: 'Ativo'   },
];

// ─── NOTAS (20 alunos × 7 disciplinas × 2 bimestres = 280 registros) ─────────

const DISCIPLINAS_NOTAS = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Inglês'];

// 14 valores por perfil (7 disc × 2 bim), todos na faixa correta
const VALS_EXCELENTE = [9.0, 9.5, 8.8, 9.2, 9.0, 9.8, 8.5,  9.3, 9.7, 8.9, 9.1, 9.4, 8.7, 9.6];
const VALS_REGULAR   = [7.0, 6.5, 7.5, 8.0, 6.8, 7.2, 8.2,  6.9, 7.4, 7.8, 7.1, 6.7, 8.1, 7.6];
const VALS_RISCO     = [4.0, 3.5, 5.0, 4.5, 3.8, 5.5, 4.2,  3.9, 5.2, 4.8, 3.6, 5.1, 4.4, 3.7];

// 4 excelentes · 4 em risco · 12 regulares
const PERFIL_ALUNO = {
  'alu-001': 'excelente', 'alu-006': 'excelente',
  'alu-010': 'excelente', 'alu-014': 'excelente',
  'alu-004': 'risco',     'alu-005': 'risco',
  'alu-009': 'risco',     'alu-013': 'risco',
};

let _nc = 0; // nota counter

const notas = alunos.flatMap(aluno => {
  const perfil = PERFIL_ALUNO[aluno.id] || 'regular';
  const base = perfil === 'excelente' ? VALS_EXCELENTE
             : perfil === 'risco'     ? VALS_RISCO
             :                          VALS_REGULAR;

  return [1, 2].flatMap((bimestre, bi) =>
    DISCIPLINAS_NOTAS.map((disciplina, di) => {
      _nc++;
      const bimestral  = base[bi * 7 + di];
      const notaTrabalho = parseFloat(Math.min(10, bimestral + 0.5).toFixed(1));
      const notaProva    = parseFloat(Math.max(0,  bimestral - 0.8).toFixed(1));
      return {
        id:            `nota-${String(_nc).padStart(3, '0')}`,
        alunoId:       aluno.id,
        disciplina,
        bimestre,
        notaTrabalho,
        notaProva,
        notaBimestral: bimestral,
        media:         bimestral,
        turmaId:       aluno.turmaId,
      };
    })
  );
});

// ─── FREQUÊNCIAS (20 alunos × 2 bimestres = 40 registros) ────────────────────

// Críticos: alu-004 e alu-005 (também em risco nas notas)
const PERFIL_FREQ = {
  'alu-001': 'excelente', 'alu-006': 'excelente',
  'alu-010': 'excelente', 'alu-014': 'excelente',
  'alu-004': 'critico',   'alu-005': 'critico',
};

let _fc = 0; // freq counter

const frequencias = alunos.flatMap(aluno => {
  const perfil = PERFIL_FREQ[aluno.id] || 'regular';
  return [1, 2].map(bimestre => {
    _fc++;
    const totalAulas = 50;
    const presencas =
      perfil === 'excelente' ? 48 + (bimestre - 1)
      : perfil === 'critico' ? 30 + (bimestre - 1) * 4
      :                        40 + (bimestre - 1) * 3;
    const faltas = totalAulas - presencas;
    return {
      id:         `freq-${String(_fc).padStart(3, '0')}`,
      alunoId:    aluno.id,
      turmaId:    aluno.turmaId,
      bimestre,
      totalAulas,
      presencas,
      faltas,
      percentual: parseFloat(((presencas / totalAulas) * 100).toFixed(1)),
    };
  });
});

// ─── ATIVIDADES (15) ──────────────────────────────────────────────────────────

const atividades = [
  { id: 'atv-001', titulo: 'Redação — Meio Ambiente',             disciplina: 'Português',   turmaId: 'tur-001', alunoId: 'alu-002', relevancia: 'Alta',  prazoEntrega: '2026-05-10', statusEntrega: 'Entregue no prazo',    data: '2026-04-28', descricao: '', observacao: '' },
  { id: 'atv-002', titulo: 'Lista de Exercícios — Frações',       disciplina: 'Matemática',  turmaId: 'tur-001', alunoId: 'alu-004', relevancia: 'Alta',  prazoEntrega: '2026-05-08', statusEntrega: 'Não entregue',         data: '2026-04-20', descricao: '', observacao: '' },
  { id: 'atv-003', titulo: 'Mapa — Regiões do Brasil',            disciplina: 'Geografia',   turmaId: 'tur-002', alunoId: 'alu-007', relevancia: 'Média', prazoEntrega: '2026-05-15', statusEntrega: 'Pendente',             data: '2026-05-01', descricao: '', observacao: '' },
  { id: 'atv-004', titulo: 'Experimento — Germinação de Sementes',disciplina: 'Ciências',    turmaId: 'tur-003', alunoId: 'alu-011', relevancia: 'Alta',  prazoEntrega: '2026-05-20', statusEntrega: 'Pendente',             data: '2026-05-05', descricao: '', observacao: '' },
  { id: 'atv-005', titulo: 'Linha do Tempo — Brasil Colonial',    disciplina: 'História',    turmaId: 'tur-003', alunoId: 'alu-012', relevancia: 'Média', prazoEntrega: '2026-05-05', statusEntrega: 'Entregue com atraso',  data: '2026-04-15', descricao: '', observacao: '' },
  { id: 'atv-006', titulo: 'Poema — Folclore Brasileiro',         disciplina: 'Português',   turmaId: 'tur-002', alunoId: 'alu-006', relevancia: 'Alta',  prazoEntrega: '2026-05-12', statusEntrega: 'Pendente',             data: '2026-04-30', descricao: '', observacao: '' },
  { id: 'atv-007', titulo: 'Cálculo Mental — Porcentagem',        disciplina: 'Matemática',  turmaId: 'tur-004', alunoId: 'alu-014', relevancia: 'Alta',  prazoEntrega: '2026-05-14', statusEntrega: 'Entregue no prazo',    data: '2026-04-22', descricao: '', observacao: '' },
  { id: 'atv-008', titulo: 'Releitura — Arte Brasileira',         disciplina: 'Artes',       turmaId: 'tur-001', alunoId: 'alu-003', relevancia: 'Média', prazoEntrega: '2026-04-28', statusEntrega: 'Entregue com atraso',  data: '2026-04-10', descricao: '', observacao: '' },
  { id: 'atv-009', titulo: 'Entrevista — História da Família',    disciplina: 'Português',   turmaId: 'tur-005', alunoId: 'alu-017', relevancia: 'Baixa', prazoEntrega: '2026-05-25', statusEntrega: 'Pendente',             data: '2026-05-03', descricao: '', observacao: '' },
  { id: 'atv-010', titulo: 'Relatório — Projeto Reciclagem',      disciplina: 'Ciências',    turmaId: 'tur-002', alunoId: 'alu-008', relevancia: 'Alta',  prazoEntrega: '2026-04-30', statusEntrega: 'Entregue no prazo',    data: '2026-04-18', descricao: '', observacao: '' },
  { id: 'atv-011', titulo: 'Quiz — Figuras Geométricas',          disciplina: 'Matemática',  turmaId: 'tur-003', alunoId: 'alu-013', relevancia: 'Média', prazoEntrega: '2026-05-18', statusEntrega: 'Não entregue',         data: '2026-05-01', descricao: '', observacao: '' },
  { id: 'atv-012', titulo: 'Cartaz — Independência do Brasil',    disciplina: 'História',    turmaId: 'tur-004', alunoId: 'alu-015', relevancia: 'Média', prazoEntrega: '2026-05-22', statusEntrega: 'Pendente',             data: '2026-05-06', descricao: '', observacao: '' },
  { id: 'atv-013', titulo: 'Pesquisa — Biomas Brasileiros',       disciplina: 'Ciências',    turmaId: 'tur-005', alunoId: 'alu-018', relevancia: 'Alta',  prazoEntrega: '2026-05-07', statusEntrega: 'Não entregue',         data: '2026-04-25', descricao: '', observacao: '' },
  { id: 'atv-014', titulo: 'Texto Livre — Minha Escola',          disciplina: 'Português',   turmaId: 'tur-006', alunoId: 'alu-019', relevancia: 'Baixa', prazoEntrega: '2026-06-01', statusEntrega: 'Pendente',             data: '2026-05-07', descricao: '', observacao: '' },
  { id: 'atv-015', titulo: 'Contagem — Dezenas e Centenas',       disciplina: 'Matemática',  turmaId: 'tur-006', alunoId: 'alu-020', relevancia: 'Alta',  prazoEntrega: '2026-05-28', statusEntrega: 'Pendente',             data: '2026-05-07', descricao: '', observacao: '' },
];

// ─── MENSALIDADES (1 por aluno, 20 registros) ─────────────────────────────────

const mensalidades = alunos.map((aluno, i) => {
  const turma = turmas.find(t => t.id === aluno.turmaId);
  const status =
    i < 14 ? 'pago'        :
    i < 17 ? 'pendente'    :
    i < 19 ? 'atrasado'    :
             'negociando';
  return {
    id:            `men-${String(i + 1).padStart(3, '0')}`,
    alunoId:       aluno.id,
    alunoNome:     aluno.nome,
    turma:         turma?.nome ?? '—',
    valor:         650.00,
    vencimento:    '2026-05-10',
    status,
    dataPagamento: status === 'pago' ? '2026-05-02' : '',
    observacao:    status === 'negociando' ? 'Aguardando acordo de parcelamento' : '',
  };
});

// ─── PAGAMENTOS DE PROFESSORES (1 por professor, 8 registros) ─────────────────

const pagamentosProfessores = professores.map((prof, i) => {
  const horasAula  = 40 + i * 5;
  const valorHora  = 45.00;
  const totalBruto = horasAula * valorHora;
  const descontos  = 100 + i * 25;
  const status     = i < 6 ? 'pago' : 'pendente';
  return {
    id:              `pagprof-${String(i + 1).padStart(3, '0')}`,
    professorId:     prof.id,
    professorNome:   prof.nome,
    disciplina:      prof.disciplina,
    horasAula,
    valorHora,
    totalBruto,
    descontos,
    totalLiquido:    totalBruto - descontos,
    mesReferencia:   '2026-04',
    status,
    dataPagamento:   status === 'pago' ? '2026-05-01' : '',
  };
});

// ─── CUSTOS (10 registros) ────────────────────────────────────────────────────

const custos = [
  { id: 'custo-001', descricao: 'Conta de energia elétrica',          categoria: 'Utilities',          valor: 850.00,  data: '2026-05-05', tipo: 'fixo'     },
  { id: 'custo-002', descricao: 'Material escolar — reposição mensal',categoria: 'Material escolar',   valor: 1200.00, data: '2026-05-03', tipo: 'variavel' },
  { id: 'custo-003', descricao: 'Manutenção ar-condicionado',         categoria: 'Manutenção',         valor: 450.00,  data: '2026-04-28', tipo: 'variavel' },
  { id: 'custo-004', descricao: 'Internet e telefonia',               categoria: 'Tecnologia',         valor: 280.00,  data: '2026-05-01', tipo: 'fixo'     },
  { id: 'custo-005', descricao: 'Serviço de limpeza mensal',          categoria: 'Serviços terceiros', valor: 1800.00, data: '2026-05-01', tipo: 'fixo'     },
  { id: 'custo-006', descricao: 'Impressões e materiais gráficos',    categoria: 'Material escolar',   valor: 320.00,  data: '2026-05-06', tipo: 'variavel' },
  { id: 'custo-007', descricao: 'Seguro predial',                     categoria: 'Administrativo',     valor: 540.00,  data: '2026-05-02', tipo: 'fixo'     },
  { id: 'custo-008', descricao: 'Compra de cadeiras — sala 3',        categoria: 'Manutenção',         valor: 2400.00, data: '2026-04-22', tipo: 'variavel' },
  { id: 'custo-009', descricao: 'Licença software pedagógico',        categoria: 'Tecnologia',         valor: 180.00,  data: '2026-05-01', tipo: 'fixo'     },
  { id: 'custo-010', descricao: 'Kit lanche — festa junina',          categoria: 'Eventos',            valor: 650.00,  data: '2026-04-30', tipo: 'variavel' },
];

// ─── EXPORTAÇÃO ───────────────────────────────────────────────────────────────

export const dadosTeste = {
  escolas,
  turmas,
  professores,
  alunos,
  notas,
  frequencias,
  atividades,
  mensalidades,
  pagamentosProfessores,
  custos,
};

export default dadosTeste;
