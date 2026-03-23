# ClassHub — Frontend

Interface gráfica da plataforma **ClassHub**, um sistema de blogging educacional onde professores publicam posts e alunos os leem. Desenvolvido em **React** com **Vite**, **Styled Components** e **Context API**.

---

## Setup Inicial

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- Backend rodando na porta 3000 (ver [README da raiz](../README.md))

### Instalação

```bash
cd frontend
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme necessário para o seu ambiente:

```bash
cp .env.example .env
```

O arquivo `.env.example` contém todas as variáveis necessárias com valores padrão.

### Executando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**. O Vite possui um proxy configurado que redireciona requisições em `/posts` para o backend, permitindo também o uso de URLs relativas.

### Build de produção

```bash
npm run build
npm run preview   # para visualizar o build localmente
```

---

## Arquitetura da Aplicação

### Estrutura de diretórios

```
frontend/src/
├── main.jsx                 # Ponto de entrada: providers e estilos globais
├── App.jsx                  # Router e layout principal
├── components/              # Componentes reutilizáveis
│   ├── ConfirmModal.jsx     # Modal de confirmação (exclusão de posts)
│   ├── Navbar.jsx           # Barra de navegação responsiva
│   ├── PostCard.jsx         # Card de exibição de post na listagem
│   ├── PostForm.jsx         # Formulário de criação/edição de post
│   ├── ProtectedRoute.jsx   # Guard: apenas professores
│   ├── RequireAuth.jsx      # Guard: qualquer usuário autenticado
│   └── SearchBar.jsx        # Campo de busca com debounce
├── context/
│   └── AuthContext.jsx      # Estado global de autenticação
├── pages/
│   ├── AdminPage.jsx        # Painel administrativo do professor
│   ├── CreatePostPage.jsx   # Criação de novo post
│   ├── EditPostPage.jsx     # Edição de post existente
│   ├── HomePage.jsx         # Listagem de posts com busca
│   ├── LoginPage.jsx        # Seleção de perfil e login
│   └── PostDetailPage.jsx   # Leitura completa de um post
├── services/
│   └── api.js               # Cliente HTTP (axios) para o backend
└── styles/
    ├── GlobalStyles.js      # Reset CSS e estilos base
    └── theme.js             # Tokens de design (cores, espaçamentos, breakpoints)
```

### Diagrama de dependências

```
main.jsx
  ├── ThemeProvider (styled-components) + theme.js
  ├── AuthProvider (context/AuthContext.jsx)
  ├── GlobalStyles
  └── App.jsx
        ├── Navbar
        └── Routes
              ├── /login ──────────── LoginPage
              ├── / ───── RequireAuth ── HomePage
              ├── /posts/:id ─ RequireAuth ── PostDetailPage
              ├── /admin ──── ProtectedRoute ── AdminPage
              ├── /admin/posts/new ── ProtectedRoute ── CreatePostPage
              ├── /admin/posts/:id/edit ── ProtectedRoute ── EditPostPage
              └── * ──────────── Página 404
```

### Rotas

| Rota | Página | Acesso |
|------|--------|--------|
| `/login` | LoginPage | Público |
| `/` | HomePage | Qualquer usuário autenticado |
| `/posts/:id` | PostDetailPage | Qualquer usuário autenticado |
| `/admin` | AdminPage | Somente professores |
| `/admin/posts/new` | CreatePostPage | Somente professores |
| `/admin/posts/:id/edit` | EditPostPage | Somente professores |
| `*` | 404 | Público |

### Autenticação

A autenticação utiliza a **Context API** (`AuthContext`) com persistência em `localStorage`. O fluxo funciona da seguinte forma:

1. O usuário acessa `/login` e escolhe o perfil (Aluno ou Professor).
2. Preenche nome e senha — em modo demonstração, qualquer credencial não-vazia é aceita.
3. O estado `{ name, role }` é salvo no contexto e no `localStorage` (chave `classhub_user`).
4. Os guards de rota (`RequireAuth` e `ProtectedRoute`) verificam o contexto antes de renderizar as páginas protegidas.

Dois níveis de proteção são aplicados:

- **RequireAuth** — redireciona para `/login` se não houver usuário logado. Usado em páginas de leitura.
- **ProtectedRoute** — redireciona para `/login` se o usuário não for professor. Usado em páginas de administração.

### Integração com o Backend

O módulo `services/api.js` configura uma instância do **axios** com `baseURL` apontando para `VITE_API_URL/posts`. Todas as operações de dados passam por este módulo:

| Função | Método HTTP | Endpoint | Descrição |
|--------|-------------|----------|-----------|
| `getAllPosts()` | GET | `/posts/` | Lista todos os posts |
| `getPostById(id)` | GET | `/posts/:id` | Obtém um post pelo ID |
| `searchPosts(q)` | GET | `/posts/search?q=...` | Busca posts por palavra-chave |
| `createPost(data)` | POST | `/posts/` | Cria um novo post |
| `updatePost(id, data)` | PUT | `/posts/:id` | Atualiza um post existente |
| `deletePost(id)` | DELETE | `/posts/:id` | Remove um post |

### Estilização

O projeto utiliza **Styled Components** com um tema centralizado (`styles/theme.js`) injetado via `ThemeProvider`. O tema define:

- **Cores**: paleta dark com fundo em tons de slate, primária em indigo e accent em cyan.
- **Tipografia**: fonte Inter (Google Fonts), carregada no `index.html`.
- **Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).
- **Espaçamentos e bordas**: tokens reutilizáveis (`spacing`, `radii`, `shadows`).

Os estilos globais (`GlobalStyles.js`) aplicam reset CSS, scrollbar customizada e defaults para links, botões e inputs.

---

## Guia de Uso

### Login

Ao acessar a aplicação, o usuário é direcionado à tela de login, onde escolhe seu perfil:

- **Aluno** — acesso às páginas de listagem e leitura de posts.
- **Professor** — acesso completo, incluindo criação, edição e painel administrativo.

### Navegação (Aluno)

1. **Página principal** (`/`) — exibe todos os posts em cards com título, autor e trecho do conteúdo. O campo de busca filtra posts por palavras-chave com debounce de 400ms.
2. **Leitura de post** (`/posts/:id`) — ao clicar em um card, o conteúdo completo é exibido com breadcrumb para voltar à listagem.

### Navegação (Professor)

Além das funcionalidades do aluno, o professor tem acesso a:

1. **Criar Post** (`/admin/posts/new`) — formulário com campos de título, autor e conteúdo. O envio faz uma requisição POST ao backend.
2. **Editar Post** (`/admin/posts/:id/edit`) — carrega os dados atuais do post no formulário para edição. Salvar envia uma requisição PUT.
3. **Painel Administrativo** (`/admin`) — tabela com todos os posts e contagem total. Cada linha possui ações de editar e excluir. A exclusão exibe um modal de confirmação antes de enviar a requisição DELETE.
4. **Exclusão rápida** — na página principal, o professor também pode excluir posts diretamente pelos cards.

### Navbar responsiva

A barra de navegação se adapta ao tamanho da tela:

- **Desktop** — exibe todos os links (Posts, Painel, Criar Post) e o badge com nome e perfil do usuário.
- **Mobile** — os links ficam em um menu dropdown acessível pelo botão hamburguer (☰). O badge é compactado para mostrar apenas o ícone do perfil.

### Logout

O botão **Sair** na navbar encerra a sessão, limpa o `localStorage` e redireciona para a página principal.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2 | Biblioteca de UI |
| React Router DOM | 6.22 | Roteamento SPA |
| Styled Components | 6.1 | Estilização CSS-in-JS |
| Axios | 1.6 | Cliente HTTP |
| Vite | 5.1 | Bundler e dev server |
