import React, { createContext, useContext, useState, useEffect } from 'react';
import dadosTeste from '../data/dadosTeste';

const DataContext = createContext();

const baseHolidays = [
  { id: crypto.randomUUID(), titulo: 'Confraternização Universal', tipo: 'Feriado Nacional', dataInicial: '2024-01-01', dataFinal: '2024-01-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Tiradentes', tipo: 'Feriado Nacional', dataInicial: '2024-04-21', dataFinal: '2024-04-21', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Dia do Trabalho', tipo: 'Feriado Nacional', dataInicial: '2024-05-01', dataFinal: '2024-05-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Independência do Brasil', tipo: 'Feriado Nacional', dataInicial: '2024-09-07', dataFinal: '2024-09-07', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Nossa Sra. Aparecida', tipo: 'Feriado Nacional', dataInicial: '2024-10-12', dataFinal: '2024-10-12', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Finados', tipo: 'Feriado Nacional', dataInicial: '2024-11-02', dataFinal: '2024-11-02', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Proclamação da República', tipo: 'Feriado Nacional', dataInicial: '2024-11-15', dataFinal: '2024-11-15', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Natal', tipo: 'Feriado Nacional', dataInicial: '2024-12-25', dataFinal: '2024-12-25', status: 'programado', createdAt: new Date().toISOString() },
  // Feriados 2025
  { id: crypto.randomUUID(), titulo: 'Confraternização Universal', tipo: 'Feriado Nacional', dataInicial: '2025-01-01', dataFinal: '2025-01-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Tiradentes', tipo: 'Feriado Nacional', dataInicial: '2025-04-21', dataFinal: '2025-04-21', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Dia do Trabalho', tipo: 'Feriado Nacional', dataInicial: '2025-05-01', dataFinal: '2025-05-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Independência do Brasil', tipo: 'Feriado Nacional', dataInicial: '2025-09-07', dataFinal: '2025-09-07', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Nossa Sra. Aparecida', tipo: 'Feriado Nacional', dataInicial: '2025-10-12', dataFinal: '2025-10-12', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Finados', tipo: 'Feriado Nacional', dataInicial: '2025-11-02', dataFinal: '2025-11-02', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Proclamação da República', tipo: 'Feriado Nacional', dataInicial: '2025-11-15', dataFinal: '2025-11-15', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Natal', tipo: 'Feriado Nacional', dataInicial: '2025-12-25', dataFinal: '2025-12-25', status: 'programado', createdAt: new Date().toISOString() },
  // Feriados 2026
  { id: crypto.randomUUID(), titulo: 'Confraternização Universal', tipo: 'Feriado Nacional', dataInicial: '2026-01-01', dataFinal: '2026-01-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Tiradentes', tipo: 'Feriado Nacional', dataInicial: '2026-04-21', dataFinal: '2026-04-21', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Dia do Trabalho', tipo: 'Feriado Nacional', dataInicial: '2026-05-01', dataFinal: '2026-05-01', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Independência do Brasil', tipo: 'Feriado Nacional', dataInicial: '2026-09-07', dataFinal: '2026-09-07', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Nossa Sra. Aparecida', tipo: 'Feriado Nacional', dataInicial: '2026-10-12', dataFinal: '2026-10-12', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Finados', tipo: 'Feriado Nacional', dataInicial: '2026-11-02', dataFinal: '2026-11-02', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Proclamação da República', tipo: 'Feriado Nacional', dataInicial: '2026-11-15', dataFinal: '2026-11-15', status: 'programado', createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), titulo: 'Natal', tipo: 'Feriado Nacional', dataInicial: '2026-12-25', dataFinal: '2026-12-25', status: 'programado', createdAt: new Date().toISOString() },
];

// Helper: lê localStorage ou retorna fallback dos dadosTeste
const fromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw && raw !== '[]' && raw !== 'null') return JSON.parse(raw);
  } catch (_) { /* ignora erro de parse */ }
  return fallback;
};

export function DataProvider({ children }) {
  // ── Estados existentes (com dadosTeste como fallback) ──────────────────────
  const [escolas, setEscolas] = useState(() => fromStorage('pa_escolas', dadosTeste.escolas));
  const [turmas, setTurmas] = useState(() => fromStorage('pa_turmas', dadosTeste.turmas));
  const [alunos, setAlunos] = useState(() => fromStorage('pa_alunos', dadosTeste.alunos));
  const [professores, setProfessores] = useState(() => fromStorage('pa_professores', dadosTeste.professores));
  const [reports, setReports] = useState(() => fromStorage('pa_reports', []));
  const [config, setConfig] = useState(() => fromStorage('pa_config', { instituicao: 'PedagoAI', anoLetivo: '2024', bimestre: '2º Bimestre' }));

  // Novos estados para o MVP evoluído
  const [notas, setNotas] = useState(() => fromStorage('pa_notas', dadosTeste.notas));
  const [atividades, setAtividades] = useState(() => fromStorage('pa_atividades', dadosTeste.atividades));
  const [eventos, setEventos] = useState(() => {
    const saved = localStorage.getItem('pa_eventos');
    if (saved && saved !== '[]') return JSON.parse(saved);
    return baseHolidays; // Pré-carrega feriados se estiver vazio
  });

  // ── Novos estados adicionados com dadosTeste ───────────────────────────────
  const [frequencias, setFrequencias] = useState(() => fromStorage('pa_frequencias', dadosTeste.frequencias));
  const [mensalidades, setMensalidades] = useState(() => fromStorage('pa_mensalidades', dadosTeste.mensalidades));
  const [pagamentosProfessores, setPagamentosProfessores] = useState(() => fromStorage('pa_pagamentos_professores', dadosTeste.pagamentosProfessores));
  const [custos, setCustos] = useState(() => fromStorage('pa_custos', dadosTeste.custos));

  const [searchQuery, setSearchQuery] = useState('');

  // ── Persistência no localStorage ──────────────────────────────────────────
  useEffect(() => localStorage.setItem('pa_escolas', JSON.stringify(escolas)), [escolas]);
  useEffect(() => localStorage.setItem('pa_turmas', JSON.stringify(turmas)), [turmas]);
  useEffect(() => localStorage.setItem('pa_alunos', JSON.stringify(alunos)), [alunos]);
  useEffect(() => localStorage.setItem('pa_professores', JSON.stringify(professores)), [professores]);
  useEffect(() => localStorage.setItem('pa_reports', JSON.stringify(reports)), [reports]);
  useEffect(() => localStorage.setItem('pa_config', JSON.stringify(config)), [config]);

  // Persistir novos estados originais
  useEffect(() => localStorage.setItem('pa_notas', JSON.stringify(notas)), [notas]);
  useEffect(() => localStorage.setItem('pa_atividades', JSON.stringify(atividades)), [atividades]);
  useEffect(() => localStorage.setItem('pa_eventos', JSON.stringify(eventos)), [eventos]);

  // Persistir novos estados adicionados
  useEffect(() => localStorage.setItem('pa_frequencias', JSON.stringify(frequencias)), [frequencias]);
  useEffect(() => localStorage.setItem('pa_mensalidades', JSON.stringify(mensalidades)), [mensalidades]);
  useEffect(() => localStorage.setItem('pa_pagamentos_professores', JSON.stringify(pagamentosProfessores)), [pagamentosProfessores]);
  useEffect(() => localStorage.setItem('pa_custos', JSON.stringify(custos)), [custos]);

  // ── CRUD Helpers ──────────────────────────────────────────────────────────
  const addEntity = (setter) => (item) => setter(prev => [...prev, { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
  const updateEntity = (setter) => (id, updates) => setter(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  const removeEntity = (setter) => (id) => setter(prev => prev.filter(item => item.id !== id));

  // Custom helper for notas since they might be updated per student/discipline/period
  const saveNota = (alunoId, disciplina, periodo, valor, faltas = 0) => {
    setNotas(prev => {
      const index = prev.findIndex(n => n.alunoId === alunoId && n.disciplina === disciplina && n.periodo === periodo);
      if (index >= 0) {
        const next = [...prev];
        next[index] = { ...next[index], valor, faltas, updatedAt: new Date().toISOString() };
        return next;
      }
      return [...prev, { id: crypto.randomUUID(), alunoId, disciplina, periodo, valor, faltas, createdAt: new Date().toISOString() }];
    });
  };

  const value = {
    // Entidades originais
    escolas, addEscola: addEntity(setEscolas), updateEscola: updateEntity(setEscolas), removeEscola: removeEntity(setEscolas),
    turmas, addTurma: addEntity(setTurmas), updateTurma: updateEntity(setTurmas), removeTurma: removeEntity(setTurmas),
    alunos, addAluno: addEntity(setAlunos), updateAluno: updateEntity(setAlunos), removeAluno: removeEntity(setAlunos),
    professores, addProfessor: addEntity(setProfessores), updateProfessor: updateEntity(setProfessores), removeProfessor: removeEntity(setProfessores),
    reports, addReport: addEntity(setReports), updateReport: updateEntity(setReports), removeReport: removeEntity(setReports),
    notas, saveNota,
    atividades, addAtividade: addEntity(setAtividades), updateAtividade: updateEntity(setAtividades), removeAtividade: removeEntity(setAtividades),
    eventos, addEvento: addEntity(setEventos), updateEvento: updateEntity(setEventos), removeEvento: removeEntity(setEventos),
    config, setConfig,
    searchQuery, setSearchQuery,

    // Novos estados adicionados
    frequencias, addFrequencia: addEntity(setFrequencias), updateFrequencia: updateEntity(setFrequencias), removeFrequencia: removeEntity(setFrequencias),
    mensalidades, addMensalidade: addEntity(setMensalidades), updateMensalidade: updateEntity(setMensalidades), removeMensalidade: removeEntity(setMensalidades),
    pagamentosProfessores, addPagamentoProfessor: addEntity(setPagamentosProfessores), updatePagamentoProfessor: updateEntity(setPagamentosProfessores), removePagamentoProfessor: removeEntity(setPagamentosProfessores),
    custos, addCusto: addEntity(setCustos), updateCusto: updateEntity(setCustos), removeCusto: removeEntity(setCustos),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
