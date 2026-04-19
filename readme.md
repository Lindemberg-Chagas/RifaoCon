# 🎟️ Rifas Vendidas - Gestão de Campanhas Beneficentes

O **Rifas Vendidas** é uma plataforma de gestão centralizada para campanhas de "Ação entre Amigos". Desenvolvido com foco em usabilidade mobile e transparência, o sistema permite que administradores gerenciem múltiplos modelos de rifas, acompanhem vendas em tempo real e gerem relatórios de prestação de contas.

Este projeto foi idealizado para atender às necessidades da **Paróquia Nossa Senhora de Fátima - Genibaú**, automatizando o controle de blocos entregues a bondosos (vendedores) e a arrecadação financeira.

---

## 🚀 Funcionalidades Principais

- **Gestão de Campanhas Multi-Modelos**: Crie e alterne entre diferentes rifas (ex: Rifa de Natal, Rifa de Páscoa) sem misturar os dados.
- **Dashboard Operacional**: Gráficos dinâmicos com percentual de meta atingida, rifas vendidas, pendentes e disponíveis.
- **Top 3 Bondosos**: Ranking gamificado (Ouro, Prata e Bronze) para incentivar o engajamento dos vendedores.
- **Gestão de Vendedores (Bondosos)**: Cadastro completo com cálculo automático de faixas numéricas (blocos de 12).
- **Relatórios em PDF**: Geração instantânea de relatórios de prestação de contas com todos os dados da campanha ativa.
- **Integração com WhatsApp**: Botão direto para contato com o vendedor via API do WhatsApp.
- **Design Mobile-First**: Interface otimizada para dispositivos móveis com proteção contra sobreposição de teclado em buscas.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React.js](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Relatórios**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Autenticação**: Google OAuth via Supabase

---

## 📦 Configuração do Ambiente

### 1. Requisitos
- Node.js (v18 ou superior)
- Conta no Supabase

### 2. Instalação
```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/rifas-vendidas.git](https://github.com/seu-usuario/rifas-vendidas.git)

# Entre na pasta
cd rifas-vendidas

# Instale as dependências
npm install