import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function NotasFrequencia() {
  const { turmas, alunos, notas, saveNota } = useData();
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('1º Bimestre');
  const [nomeAlunoFiltro, setNomeAlunoFiltro] = useState('');
  const [formData, setFormData] = useState({});
  const [savedMessage, setSavedMessage] = useState(false);

  const disciplinas = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês', 'Artes', 'Educação Física'];
  const periodos = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

  const alunosDaTurma = alunos.filter(a => {
    const naTurma = a.turmaId === selectedTurma;
    const nomeMatch = nomeAlunoFiltro === '' || a.nome.toLowerCase().includes(nomeAlunoFiltro.toLowerCase());
    return naTurma && nomeMatch;
  });

  // Carregar dados existentes
  useEffect(() => {
    if (selectedTurma && selectedDisciplina && selectedPeriodo) {
      const data = {};
      alunos.filter(a => a.turmaId === selectedTurma).forEach(aluno => {
        const notaExistente = notas.find(n => n.alunoId === aluno.id && n.disciplina === selectedDisciplina && n.periodo === selectedPeriodo);
        data[aluno.id] = {
          valor: notaExistente ? notaExistente.valor : '',
          faltas: notaExistente ? notaExistente.faltas : 0
        };
      });
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [selectedTurma, selectedDisciplina, selectedPeriodo, notas]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNotaChange = (alunoId, val) => {
    setFormData(prev => ({ ...prev, [alunoId]: { ...prev[alunoId], valor: val } }));
  };

  const handleFaltaChange = (alunoId, val) => {
    setFormData(prev => ({ ...prev, [alunoId]: { ...prev[alunoId], faltas: val } }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach(alunoId => {
      const { valor, faltas } = formData[alunoId];
      if (valor !== '' || faltas !== 0) {
        saveNota(alunoId, selectedDisciplina, selectedPeriodo, valor, faltas);
      }
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="py-8 max-w-container_max_width mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-black text-on-surface tracking-tight">Notas e Frequência</h1>
          <p className="text-on-surface-variant font-inter">Lançamento de desempenho e acompanhamento de faltas por disciplina.</p>
        </div>
      </div>

      {/* Filtros principais */}
      <div className="glass border border-outline/30 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 orange-gradient opacity-50"></div>

        <SelectGroup label="Turma" value={selectedTurma} onChange={e => setSelectedTurma(e.target.value)}>
          <option value="">Selecione uma turma...</option>
          {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </SelectGroup>

        <SelectGroup label="Disciplina" value={selectedDisciplina} onChange={e => setSelectedDisciplina(e.target.value)}>
          <option value="">Selecione a disciplina...</option>
          {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
        </SelectGroup>

        <SelectGroup label="Período" value={selectedPeriodo} onChange={e => setSelectedPeriodo(e.target.value)}>
          {periodos.map(p => <option key={p} value={p}>{p}</option>)}
        </SelectGroup>

        {/* Novo campo: Nome do Aluno (filtro) */}
        <InputGroup
          label="Nome do Aluno"
          placeholder="Filtrar por nome..."
          value={nomeAlunoFiltro}
          onChange={e => setNomeAlunoFiltro(e.target.value)}
        />


      </div>

      {selectedTurma && selectedDisciplina && (
        <div className="glass border border-outline/30 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline/30 bg-surface-container-low/30 flex justify-between items-center">
            <h2 className="font-outfit font-bold text-on-surface">
              Lançamento da Turma {turmas.find(t => t.id === selectedTurma)?.nome}
              {nomeAlunoFiltro && <span className="text-sm font-normal text-on-surface-variant ml-2">— filtrado por "{nomeAlunoFiltro}"</span>}
            </h2>
            {savedMessage && (
              <span className="text-primary font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span> Dados salvos com sucesso!
              </span>
            )}
          </div>

          {alunosDaTurma.length === 0 ? (
            <div className="p-10 text-center text-on-surface-variant">
              {nomeAlunoFiltro ? 'Nenhum aluno encontrado com esse nome nesta turma.' : 'Nenhum aluno matriculado nesta turma.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50 text-[13px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-outline/10">
                    <th className="p-6 w-1/2">Estudante</th>
                    <th className="p-6 w-1/4">Nota (0 a 10)</th>
                    <th className="p-6 w-1/4 text-center">Faltas (Bimestre)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {alunosDaTurma.map(aluno => (
                    <tr key={aluno.id} className="border-b border-outline/5 hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline/30 flex items-center justify-center font-black text-xs shrink-0"
                            style={{ backgroundColor: aluno.foto ? 'transparent' : '#DBEAFE', color: '#1A3C6E' }}>
                            {aluno.foto ? (
                              <img src={aluno.foto} alt={aluno.nome} className="w-full h-full object-cover" />
                            ) : (
                              aluno.nome.charAt(0)
                            )}
                          </div>
                          <span className="font-bold text-on-surface">{aluno.nome}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-24 h-10 px-3 bg-surface-container border border-outline/50 rounded-xl focus:border-primary outline-none text-on-surface font-outfit font-bold"
                          placeholder="Ex: 8.5"
                          value={formData[aluno.id]?.valor || ''}
                          onChange={e => handleNotaChange(aluno.id, e.target.value)}
                        />
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline/30 flex items-center justify-center transition-colors"
                            onClick={() => handleFaltaChange(aluno.id, Math.max(0, (formData[aluno.id]?.faltas || 0) - 1))}
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="font-outfit font-bold text-lg w-8">{formData[aluno.id]?.faltas || 0}</span>
                          <button
                            className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline/30 flex items-center justify-center transition-colors"
                            onClick={() => handleFaltaChange(aluno.id, (formData[aluno.id]?.faltas || 0) + 1)}
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {alunosDaTurma.length > 0 && (
            <div className="p-6 border-t border-outline/20 flex justify-end">
              <button
                onClick={handleSave}
                className="orange-gradient text-black px-8 py-3 rounded-2xl font-black text-sm shadow-glow hover:shadow-glow-strong active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                Salvar Lançamentos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SelectGroup({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <select
        className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface appearance-none"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[13px] font-bold text-on-surface-variant uppercase tracking-[0.15em] group-focus-within:text-primary transition-colors">{label}</label>
      <input
        className="w-full h-12 px-4 bg-surface-container-low border border-outline/50 rounded-2xl focus:border-primary/50 outline-none transition-all text-on-surface placeholder:opacity-40"
        {...props}
      />
    </div>
  );
}
