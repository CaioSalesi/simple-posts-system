# Simple Posts System
Sistema de postagem de matérias para alunos e professores.

## 🚀 Como Executar

### 1. Requisitos
- Node.js (v20+)
- Docker e Docker Compose

### 2. Configuração de Ambiente
Copie o arquivo `.env.example` para `.env` e ajuste as portas se necessário:
```bash
cp .env.example .env
```

### 3. Rodando com Docker (Recomendado)
Para subir o banco de dados e o backend em containers:
```bash
docker-compose up --build -d
```
> [!TIP]
> Use sempre a flag `--build` ao fazer alterações no código do backend para garantir que a imagem seja atualizada.

### 4. Desenvolvimento Local
Se preferir rodar os componentes separadamente para desenvolvimento:

#### Backend
```bash
npm install
npm run dev
```
O servidor rodará na porta `3000`.

#### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
O frontend rodará na porta `5173` e fará o proxy das chamadas de API para `http://localhost:3000`.

## 🧪 Testes
Para rodar os testes unitários do backend:
```bash
npm test
```

## 🛠️ Tecnologias
- **Backend**: Node.js, Express, Sequelize (PostgreSQL)
- **Frontend**: React, Vite, Styled Components
- **Infra**: Docker, Docker Compose