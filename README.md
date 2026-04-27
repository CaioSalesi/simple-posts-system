# ClassHub — Simple Posts System

Plataforma de blogging educacional onde **professores** publicam, editam e gerenciam posts, e **alunos** leem e buscam conteúdos. Desenvolvido como Tech Challenge da Fase 3 da Pós Tech FIAP.

---

## Sumário

- [Arquitetura Geral](#arquitetura-geral)
- [Como Executar](#como-executar)
- [Backend](#backend)
- [Frontend](#frontend)
- [Mobile](#mobile)
- [Testes](#testes)
- [Tecnologias](#tecnologias)

---

## Arquitetura Geral

```
┌──────────────┐
│    Mobile    │
│ Expo/React   │
│ Native (Go)  │
└──────┬───────┘
       │ REST
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Frontend   │──────▶│   Backend    │──────▶│  PostgreSQL  │
│  React/Vite  │ REST  │ Express/Node │  SQL  │   (local)    │
│  porta 5173  │◀──────│  porta 3000  │◀──────│  porta 5432  │
└──────────────┘       └──────────────┘       └──────────────┘
```

O sistema segue uma arquitetura de três camadas:

- **Frontend Web** — SPA em React servida pelo Vite, consome a API REST do backend.
- **Frontend Mobile** — App em React Native com Expo, consome a mesma API REST.
- **Backend** — API REST em Node.js/Express com Sequelize como ORM.
- **Banco de dados** — PostgreSQL 18 local, acessado via `host.docker.internal`.

---

## Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

### 1. Configuração de ambiente

Clone o repositório e copie os arquivos de variáveis de ambiente a partir dos exemplos fornecidos:

```bash
git clone <url-do-repositorio>
cd simple-posts-system
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Ajuste os valores nos arquivos `.env` conforme necessário para o seu ambiente. Os arquivos `.env.example` contêm todas as variáveis necessárias com valores padrão.

### 2. Rodando com Docker (Recomendado)

Sobe o PostgreSQL e o backend em containers:

```bash
docker-compose up --build -d
```

Em seguida, inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

### 3. Desenvolvimento local (sem Docker para o app)

Se preferir rodar o backend fora do container, suba apenas o banco:

```bash
docker-compose up db -d
```

Depois, em terminais separados:

**Backend:**

```bash
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### 4. Acessando a aplicação


| Serviço       | URL                                            |
| ------------- | ---------------------------------------------- |
| Frontend      | [http://localhost:5173](http://localhost:5173) |
| Backend (API) | [http://localhost:3000](http://localhost:3000) |


---

## Backend

### Estrutura de diretórios

```
├── app.js                        # Entrada: Express, middleware, conexão DB
├── config/
│   └── database.js               # Instância Sequelize (PostgreSQL)
├── models/
│   └── Post.js                   # Model Post (UUID, title, content, author)
├── controllers/
│   └── postsController.js        # Handlers HTTP para posts
├── services/
│   └── postService.js            # Camada de acesso a dados (Sequelize)
├── routes/
│   └── posts.js                  # Definição das rotas /posts
├── tests/
│   ├── posts.controller.test.js  # Testes unitários do controller
│   └── postService.test.js       # Testes unitários do service
├── Dockerfile                    # Imagem Node.js para produção
└── docker-compose.yaml           # Stack: PostgreSQL + App
```

### Camadas

O backend segue o padrão **Routes → Controller → Service → Model**:

- **Routes** — definem os endpoints HTTP e delegam para controllers.
- **Controller** — valida a entrada, chama o service e formata a resposta HTTP.
- **Service** — encapsula a lógica de negócio e as queries Sequelize.
- **Model** — define o schema da tabela e suas validações.

### API REST

Todos os endpoints estão sob o prefixo `/posts`.


| Método   | Endpoint                | Descrição                                                 | Corpo                        |
| -------- | ----------------------- | --------------------------------------------------------- | ---------------------------- |
| `GET`    | `/posts`                | Lista todos os posts (mais recentes primeiro)             | —                            |
| `GET`    | `/posts/search?q=termo` | Busca posts por palavra-chave (título, conteúdo ou autor) | —                            |
| `GET`    | `/posts/:id`            | Retorna um post pelo ID                                   | —                            |
| `POST`   | `/posts`                | Cria um novo post                                         | `{ title, content, author }` |
| `PUT`    | `/posts/:id`            | Atualiza um post existente                                | `{ title, content, author }` |
| `DELETE` | `/posts/:id`            | Remove um post                                            | —                            |


### Model: Post


| Campo       | Tipo        | Regras                     |
| ----------- | ----------- | -------------------------- |
| `id`        | UUID (v4)   | PK, gerado automaticamente |
| `title`     | STRING(200) | Obrigatório                |
| `content`   | TEXT        | Obrigatório                |
| `author`    | STRING(100) | Obrigatório                |
| `createdAt` | TIMESTAMP   | Automático (Sequelize)     |
| `updatedAt` | TIMESTAMP   | Automático (Sequelize)     |


### Banco de dados

A conexão é configurada em `config/database.js` usando as variáveis de ambiente. Na inicialização, o backend executa `sequelize.sync({ alter: true })` para criar ou atualizar as tabelas automaticamente.

---

## Frontend

### Estrutura de diretórios

```
frontend/src/
├── main.jsx                 # Entrada: providers e estilos globais
├── App.jsx                  # Router e layout principal
├── components/
│   ├── ConfirmModal.jsx     # Modal de confirmação (exclusão)
│   ├── Navbar.jsx           # Barra de navegação responsiva
│   ├── PostCard.jsx         # Card de post na listagem
│   ├── PostForm.jsx         # Formulário de criação/edição
│   ├── ProtectedRoute.jsx   # Guard: apenas professores
│   ├── RequireAuth.jsx      # Guard: qualquer usuário logado
│   └── SearchBar.jsx        # Campo de busca com debounce
├── context/
│   └── AuthContext.jsx      # Estado global de autenticação
├── pages/
│   ├── AdminPage.jsx        # Painel administrativo
│   ├── CreatePostPage.jsx   # Criação de post
│   ├── EditPostPage.jsx     # Edição de post
│   ├── HomePage.jsx         # Listagem com busca
│   ├── LoginPage.jsx        # Seleção de perfil e login
│   └── PostDetailPage.jsx   # Leitura completa do post
├── services/
│   └── api.js               # Cliente HTTP (axios)
└── styles/
    ├── GlobalStyles.js      # Reset e estilos base
    └── theme.js             # Tokens de design
```

### Rotas


| Rota                    | Página                   | Acesso                  |
| ----------------------- | ------------------------ | ----------------------- |
| `/login`                | Tela de login            | Público                 |
| `/`                     | Lista de posts com busca | Qualquer usuário logado |
| `/posts/:id`            | Leitura completa do post | Qualquer usuário logado |
| `/admin`                | Painel administrativo    | Somente professores     |
| `/admin/posts/new`      | Criação de post          | Somente professores     |
| `/admin/posts/:id/edit` | Edição de post           | Somente professores     |


### Autenticação

A aplicação utiliza a **Context API** com persistência em `localStorage`. O login opera em modo demonstração — qualquer nome e senha não-vazios são aceitos. O estado do usuário (`{ name, role }`) determina o nível de acesso:

- **Aluno** — pode visualizar e buscar posts.
- **Professor** — acesso completo: criar, editar, excluir posts e acessar o painel administrativo.

Dois componentes de guard protegem as rotas:

- **RequireAuth** — redireciona para `/login` se não houver sessão ativa.
- **ProtectedRoute** — redireciona para `/login` se o usuário não for professor.

### Integração com o Backend

O módulo `services/api.js` configura uma instância **axios** com `baseURL` apontando para `VITE_API_URL/posts`, centralizando todas as chamadas à API REST.

### Estilização

O projeto usa **Styled Components** com um tema centralizado (`theme.js`) que define cores, tipografia (Inter), espaçamentos, bordas e breakpoints. A paleta segue um esquema dark com tons de slate, indigo e cyan. A aplicação é **responsiva**, com breakpoints em 640px, 768px, 1024px e 1280px.

### Guia de uso

1. **Login** — escolha o perfil (Aluno ou Professor) e entre com qualquer nome e senha.
2. **Página principal** — lista posts em cards com título, autor e trecho. Use a barra de busca para filtrar por palavras-chave.
3. **Leitura** — clique em um card para ver o conteúdo completo do post.
4. **Criação** (Professor) — acesse "Criar Post" na navbar, preencha título, autor e conteúdo.
5. **Edição** (Professor) — clique em "Editar" no card ou no painel administrativo.
6. **Painel** (Professor) — visualize todos os posts em tabela, com opções de editar e excluir.
7. **Logout** — clique em "Sair" na navbar para encerrar a sessão.

---

## Mobile

App em React Native com Expo Router que consome a mesma API do backend, com suporte a perfis de **Aluno** e **Professor**.

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)
- Celular e computador na **mesma rede Wi-Fi**

### 1. Instalar dependências

```bash
cd mobile
npm install
```

### 2. Configurar a URL da API

Abra `mobile/services/api.ts` e substitua o IP pelo IP local da sua máquina:

```ts
const API_BASE_URL = 'http://SEU_IP_LOCAL:3000'
```

Para descobrir seu IP no Windows:

```powershell
ipconfig
# Procure por "Endereço IPv4" na seção Wi-Fi
```

> **Atenção:** o celular precisa conseguir alcançar essa URL. Verifique se o Firewall do Windows permite conexões na porta 3000:
> ```powershell
> # Execute como Administrador
> New-NetFirewallRule -DisplayName "Allow port 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
> ```

### 3. Iniciar o app

Com o backend rodando (`docker-compose up -d app`), inicie o servidor Expo:

```bash
cd mobile
npx expo start
```

Aponte a câmera do celular para o QR Code exibido no terminal e o app abrirá no **Expo Go**.

### Estrutura de diretórios

```
mobile/
├── app/
│   ├── _layout.tsx          # Layout raiz com AuthProvider e navegação
│   ├── login.tsx            # Tela de login e seleção de perfil
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Navegação por abas
│   │   ├── index.tsx        # Lista de posts com busca
│   │   └── explore.tsx      # Painel administrativo (professores)
│   ├── post/
│   │   └── [id].tsx         # Leitura completa do post
│   └── admin/
│       ├── new.tsx          # Criação de post
│       └── [id]/
│           └── edit.tsx     # Edição de post
├── context/
│   └── AuthContext.tsx      # Estado global de autenticação
├── services/
│   └── api.ts               # Cliente HTTP (fetch) para a API REST
└── constants/
    └── app-theme.ts         # Tokens de cor do ClassHub
```

### Telas

| Tela | Acesso | Descrição |
|------|--------|-----------|
| Login | Público | Seleção de perfil (Aluno/Professor) e formulário de acesso |
| Posts (aba) | Todos | Lista de posts com busca por palavra-chave e pull-to-refresh |
| Detalhe do post | Todos | Conteúdo completo, data, autor |
| Admin (aba) | Professor | Tabela de posts com ações de editar e excluir |
| Criar post | Professor | Formulário com título, autor e conteúdo |
| Editar post | Professor | Formulário pré-preenchido com dados do post |

### Autenticação

O app opera em **modo demonstração** — qualquer nome e senha não-vazios são aceitos. O perfil escolhido define o nível de acesso:

- **Aluno** — visualiza e busca posts.
- **Professor** — acesso completo: criar, editar, excluir e acessar o painel admin.

> A sessão é mantida em memória e encerrada ao fechar o app.

### Guia de uso

1. **Abra o Expo Go** e escaneie o QR Code do terminal.
2. **Escolha o perfil** (Aluno ou Professor) na tela de login.
3. **Entre com qualquer nome e senha** — o modo demonstração aceita qualquer valor.
4. **Aba Posts** — veja todos os posts, use a barra de busca para filtrar. Professores têm botões de editar/excluir em cada card e um botão flutuante para criar novo post.
5. **Toque em um card** para ler o post completo.
6. **Aba Admin** (Professor) — visão em lista de todos os posts com ações rápidas.
7. **Criar post** — toque em "+ Novo Post" e preencha título, autor e conteúdo.
8. **Sair** — toque em "Sair" no canto superior direito da aba Posts.

---

## Testes

O backend possui testes unitários com **Jest**, cobrindo os controllers e services com mocks das camadas adjacentes.

```bash
npm test
```

Os testes geram relatório de cobertura automaticamente (`jest --coverage`).

---

## Tecnologias


| Camada       | Tecnologia              | Versão |
| ------------ | ----------------------- | ------ |
| **Frontend** | React                   | 18.2   |
|              | React Router DOM        | 6.22   |
|              | Styled Components       | 6.1    |
|              | Axios                   | 1.6    |
|              | Vite                    | 5.1    |
| **Backend**  | Node.js                 | 20+    |
|              | Express                 | 5.1    |
|              | Sequelize               | 6.37   |
|              | PostgreSQL              | 18     |
| **Mobile**   | React Native            | 0.83   |
|              | Expo                    | 55     |
|              | Expo Router             | 55     |
| **Testes**   | Jest                    | 29.7   |
| **Infra**    | Docker / Docker Compose | —      |


