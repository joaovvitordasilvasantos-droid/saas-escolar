# PedagoAI - MVP

Este é o MVP do projeto **PedagoAI**, uma plataforma de gestão escolar inteligente projetada para escolas particulares, com um design premium (dark mode). 

O sistema simula uma gestão pedagógica completa, incluindo a integração de um "Relatório IA" e outras rotinas acadêmicas (Frequência, Boletim, Coordenação e Agenda).

## Tecnologias e Frameworks
- **Frontend**: React.js (via Vite)
- **Roteamento**: React Router DOM v7
- **Estilização**: Tailwind CSS v4 + Vanilla CSS (index.css para custom properties)
- **Ícones**: Material Symbols / Google Fonts (via index.html)
- **Persistência**: LocalStorage (simulando um backend sem servidor)

## Pré-requisitos
Para dar continuidade ao desenvolvimento, certifique-se de ter o **Node.js** instalado na sua máquina (versão LTS recomendada).

## Instalação e Execução

### 1. Instalar as dependências
Abra o terminal na pasta raiz do projeto (`pedagoai_app`) e execute:
```bash
npm install
```

### 2. Rodar em ambiente de desenvolvimento
```bash
npm run dev
```
O servidor será iniciado localmente (geralmente em `http://localhost:5173/`).

### 3. Fazer o Build para Produção
Para compilar os arquivos e prepará-los para um deploy (na Vercel, Netlify, etc), execute:
```bash
npm run build
```

## Como continuar o desenvolvimento com o Claude Code no VS Code

O projeto está totalmente organizado. Não há senhas, tokens ou dados sensíveis chumbados no código.
Siga estes passos para avançar com o desenvolvimento:

1. **Abra o VS Code:**
   Abra a pasta `pedagoai_app` no seu editor.
2. **Inicie o Claude Code:**
   Se você usa a extensão ou CLI do Claude Code, inicie sua sessão na raiz desse repositório.
3. **Contexto:**
   A lógica de estados (CRUD principal e simulação do banco) fica no arquivo central `src/context/DataContext.jsx`. É dali que todas as páginas (`src/pages/*`) extraem os dados de alunos, turmas, notas, eventos, etc.
4. **Design System:**
   Se precisar mexer em cores ou criar componentes globais, as classes base estão configuradas em `src/index.css` juntamente com as definições estéticas.

*Bom código!*
