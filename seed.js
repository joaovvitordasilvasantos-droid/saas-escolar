/**
 * PedagoAI — Script de Seed de Dados
 * Cole este conteúdo no console do navegador com o app aberto.
 * Após executar, recarregue a página (F5) para ver os dados.
 */
(function seedPedagoAI() {
  const uuid = () => crypto.randomUUID();
  const now = () => new Date().toISOString();

  // ── ESCOLA ──────────────────────────────────────────────────────────────────
  const escolaId = uuid();
  const escolas = [{
    id: escolaId,
    nome: 'Escola Municipal Prof. João Silva',
    cnpj: '12.345.678/0001-90',
    responsavel: 'Maria Aparecida Santos',
    email: 'contato@emjoaosilva.edu.br',
    phone: '(11) 3456-7890',
    address: 'Rua das Acácias, 150 — Centro',
    createdAt: now()
  }];

  // ── PROFESSORES ─────────────────────────────────────────────────────────────
  const profIds = [uuid(), uuid(), uuid()];
  const professores = [
    { id: profIds[0], nome: 'Ana Carvalho',    email: 'ana@emjoaosilva.edu.br',    phone: '(11) 91234-5678', disciplina: 'Matemática', status: 'Ativo', foto: '', createdAt: now() },
    { id: profIds[1], nome: 'Bruno Ferreira',  email: 'bruno@emjoaosilva.edu.br',  phone: '(11) 92345-6789', disciplina: 'Português',  status: 'Ativo', foto: '', createdAt: now() },
    { id: profIds[2], nome: 'Carla Oliveira',  email: 'carla@emjoaosilva.edu.br',  phone: '(11) 93456-7890', disciplina: 'Ciências',   status: 'Ativo', foto: '', createdAt: now() },
  ];

  // ── TURMAS ──────────────────────────────────────────────────────────────────
  const turmaIds = [uuid(), uuid(), uuid()];
  const turmaNomes = ['9A', '9B', '1M'];
  const turmas = [
    { id: turmaIds[0], nome: '9A', serie: '9º Ano',   turno: 'Manhã', professorId: profIds[0], escolaId, ano: '2026', limite: '30', createdAt: now() },
    { id: turmaIds[1], nome: '9B', serie: '9º Ano',   turno: 'Tarde', professorId: profIds[1], escolaId, ano: '2026', limite: '30', createdAt: now() },
    { id: turmaIds[2], nome: '1M', serie: '1º Médio', turno: 'Manhã', professorId: profIds[2], escolaId, ano: '2026', limite: '30', createdAt: now() },
  ];

  // ── ALUNOS (30 — 10 por turma) ──────────────────────────────────────────────
  const nomesAlunos = [
    // Turma 9A
    'Lucas Almeida',      'Mariana Costa',    'Pedro Rodrigues',  'Juliana Lima',
    'Gabriel Souza',      'Fernanda Pereira', 'Rafael Oliveira',  'Isabela Santos',
    'Matheus Carvalho',   'Beatriz Ferreira',
    // Turma 9B
    'Henrique Martins',   'Larissa Gomes',    'Thiago Barros',    'Camila Ribeiro',
    'Diego Araújo',       'Natália Mendes',   'Felipe Cardoso',   'Bruna Nascimento',
    'Eduardo Dias',       'Letícia Moreira',
    // Turma 1M
    'Vinícius Castro',    'Amanda Teixeira',  'Guilherme Lopes',  'Priscila Melo',
    'André Freitas',      'Tatiane Rocha',    'Caio Correia',     'Simone Borges',
    'Murilo Pinto',       'Daniela Campos'
  ];

  const alunoIds = nomesAlunos.map(() => uuid());
  const alunos = nomesAlunos.map((nome, i) => ({
    id: alunoIds[i],
    nome,
    nascimento: `${2008 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 25) + 1).padStart(2, '0')}`,
    genero: i % 2 === 0 ? 'Masculino' : 'Feminino',
    turmaId: turmaIds[Math.floor(i / 10)],
    responsavel: `Família de ${nome.split(' ')[0]}`,
    phone: `(11) 9${String(9000 + i)}-${String(1000 + i)}`,
    email: `${nome.split(' ')[0].toLowerCase()}@aluno.edu.br`,
    status: 'Ativo',
    foto: '',
    frequencia: 85 + (i % 15),
    createdAt: now()
  }));

  // ── NOTAS (2 por aluno = 60 registros) ──────────────────────────────────────
  // Nota 1: Matemática  |  Nota 2: Português  — período 1º Bimestre
  const valoresBase = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];
  const notas = [];
  alunoIds.forEach((alunoId, i) => {
    notas.push({
      id: uuid(), alunoId,
      disciplina: 'Matemática',
      periodo: '1º Bimestre',
      valor: String(valoresBase[(i + 0) % valoresBase.length]),
      faltas: (i % 5),
      createdAt: now()
    });
    notas.push({
      id: uuid(), alunoId,
      disciplina: 'Português',
      periodo: '1º Bimestre',
      valor: String(valoresBase[(i + 3) % valoresBase.length]),
      faltas: (i % 4),
      createdAt: now()
    });
  });

  // ── ATIVIDADES (1 por aluno) ─────────────────────────────────────────────────
  const titulosAtiv = [
    'Redação sobre Meio Ambiente',    'Mapa Conceitual de Equações',   'Poesia Livre',
    'Experimento de Física',          'Trabalho de História',          'Cartaz de Ciências',
    'Resolução de Problemas',         'Produção Textual',              'Pesquisa Bibliográfica',
    'Apresentação Oral',              'Debate em Sala',                'Projeto Interdisciplinar',
    'Análise Literária',              'Cálculo Geométrico',            'Relatório de Leitura',
    'Seminário Temático',             'Exercício Prático',             'Composição Musical',
    'Portfólio Fotográfico',          'Maquete Geográfica',            'Atividade Lúdica',
    'Redação Argumentativa',          'Prova Prática',                 'Trabalho em Grupo',
    'Estudo Dirigido',                'Exercício de Fixação',          'Produção Visual',
    'Debate Científico',              'Análise de Texto',              'Pesquisa de Campo'
  ];
  const discAtiv   = ['Matemática', 'Português', 'Ciências', 'História', 'Artes'];
  const relevOpts  = ['Alta', 'Média', 'Baixa'];
  const statusOpts = ['Entregue no prazo', 'Entregue no prazo', 'Entregue no prazo', 'Pendente', 'Entregue com atraso'];

  const atividades = alunoIds.map((alunoId, i) => ({
    id: uuid(),
    titulo: titulosAtiv[i],
    data: `2026-0${(i % 3) + 2}-${String((i % 20) + 1).padStart(2, '0')}`,
    disciplina: discAtiv[i % 5],
    alunoId,
    turmaId: turmaIds[Math.floor(i / 10)],
    descricao: `Atividade de ${titulosAtiv[i].toLowerCase()} desenvolvida para avaliar o aprendizado do estudante.`,
    observacao: i % 3 === 0 ? 'Excelente criatividade e empenho.' : i % 3 === 1 ? 'Precisa de maior atenção nos próximos trabalhos.' : '',
    relevancia: relevOpts[i % 3],
    prazoEntrega: `2026-0${(i % 3) + 2}-${String((i % 20) + 5).padStart(2, '0')}`,
    statusEntrega: statusOpts[i % statusOpts.length],
    createdAt: now()
  }));

  // ── RELATÓRIOS (1 por aluno) ─────────────────────────────────────────────────
  const reports = alunoIds.map((alunoId, i) => {
    const aluno     = alunos[i];
    const nAluno    = notas.filter(n => n.alunoId === alunoId);
    const media     = (nAluno.reduce((s, n) => s + parseFloat(n.valor), 0) / nAluno.length).toFixed(1);
    const totalFalt = nAluno.reduce((s, n) => s + n.faltas, 0);
    const turmaNome = turmaNomes[Math.floor(i / 10)];

    let desenv;
    if (parseFloat(media) >= 8.0)      desenv = 'O estudante apresenta excelente desenvolvimento cognitivo e acadêmico, demonstrando facilidade na assimilação dos conteúdos propostos.';
    else if (parseFloat(media) >= 6.0) desenv = 'O estudante apresenta desenvolvimento satisfatório, acompanhando a turma na maioria das disciplinas.';
    else                               desenv = 'O estudante apresenta dificuldades significativas, necessitando de intervenção e apoio contínuo.';

    const recom = parseFloat(media) < 6.0 || totalFalt > 10
      ? '- Agendar reunião com os responsáveis.\n- Inserir aluno no programa de recuperação paralela.'
      : '- Manter o incentivo ao estudo contínuo.\n- Propor atividades de aprofundamento.';

    const content =
      `RELATÓRIO PEDAGÓGICO INTELIGENTE - PEDAGOAI\n\n` +
      `ESTUDANTE: ${aluno.nome.toUpperCase()}\n` +
      `TURMA: ${turmaNome}\nPERÍODO: 1º BIMESTRE\nDATA DE EMISSÃO: ${new Date().toLocaleDateString()}\n` +
      `--------------------------------------------------\nRESUMO ACADÊMICO\n--------------------------------------------------\n` +
      `Média Global: ${media}\nTotal de Faltas no Período: ${totalFalt}\n\n` +
      `DESENVOLVIMENTO PEDAGÓGICO:\n${desenv}\n\n` +
      `RECOMENDAÇÕES:\n${recom}\n\n` +
      `Documento gerado automaticamente pelo núcleo de processamento PedagoAI Premium (Simulação Local).`;

    return {
      id: uuid(), alunoId,
      alunoNome: aluno.nome,
      turmaId: aluno.turmaId,
      periodo: '1º Bimestre',
      content,
      date: new Date().toLocaleDateString(),
      status: i % 5 === 0 ? 'Pendente' : 'Aprovado',
      createdAt: now()
    };
  });

  // ── FERIADO MUNICIPAL — 30/04/2026 ───────────────────────────────────────────
  const eventosExistentes = JSON.parse(localStorage.getItem('pa_eventos') || '[]');
  const novoEvento = {
    id: uuid(),
    titulo: 'Aniversário do Município',
    tipo: 'Feriado Municipal',
    dataInicial: '2026-04-30',
    dataFinal:   '2026-04-30',
    descricao: 'Feriado municipal em comemoração ao aniversário da cidade.',
    turmaId: '', professorId: '',
    status: 'programado',
    createdAt: now()
  };
  const eventos = [...eventosExistentes, novoEvento];

  // ── SALVAR NO LOCALSTORAGE ────────────────────────────────────────────────────
  localStorage.setItem('pa_escolas',     JSON.stringify(escolas));
  localStorage.setItem('pa_professores', JSON.stringify(professores));
  localStorage.setItem('pa_turmas',      JSON.stringify(turmas));
  localStorage.setItem('pa_alunos',      JSON.stringify(alunos));
  localStorage.setItem('pa_notas',       JSON.stringify(notas));
  localStorage.setItem('pa_atividades',  JSON.stringify(atividades));
  localStorage.setItem('pa_reports',     JSON.stringify(reports));
  localStorage.setItem('pa_eventos',     JSON.stringify(eventos));
  localStorage.setItem('pa_config',      JSON.stringify({ instituicao: 'E.M. Prof. João Silva', anoLetivo: '2026', bimestre: '1º Bimestre' }));

  console.log('%c✅ PedagoAI Seed Concluído!', 'color:#0FA77B;font-weight:bold;font-size:14px');
  console.table({
    Escolas:    escolas.length,
    Professores: professores.length,
    Turmas:     turmas.length,
    Alunos:     alunos.length,
    Notas:      notas.length,
    Atividades: atividades.length,
    Relatórios: reports.length,
    'Feriado Municipal': '30/04/2026'
  });
  console.log('%c⚡ Recarregue a página (F5) para ver os dados.', 'color:#F59E0B;font-weight:bold');
})();
