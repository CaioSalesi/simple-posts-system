import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RequireAuth from './components/RequireAuth'
import AdminPage from './pages/AdminPage'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PostDetailPage from './pages/PostDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Main>
        <Routes>
          {/* Only public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Requires any login (student or teacher) */}
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/posts/:id" element={<RequireAuth><PostDetailPage /></RequireAuth>} />

          {/* Teacher-only routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/posts/new" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={
            <NotFound>
              <h1>404</h1>
              <p>Página não encontrada.</p>
              <a href="/">Voltar ao início</a>
            </NotFound>
          } />
        </Routes>
      </Main>
    </BrowserRouter>
  )
}

const Main = styled.main`
  flex: 1;
`

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: calc(100vh - 64px);
  text-align: center;
  padding: 24px;

  h1 { font-size: 80px; font-weight: 800; opacity: 0.2; }
  p { color: ${({ theme }) => theme.colors.textSecondary}; }
  a { color: ${({ theme }) => theme.colors.primaryLight}; font-weight: 500; }
`
