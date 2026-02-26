import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ConfirmModal from '../components/ConfirmModal'
import { deletePost, getAllPosts } from '../services/api'

export default function AdminPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts()
        setPosts(res.data)
      } catch {
        setError('Erro ao carregar posts.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleDelete = (id) => {
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    try {
      await deletePost(deleteTarget)
      setPosts(prev => prev.filter(p => p.id !== deleteTarget))
    } catch {
      // silently fail
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <Page>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir post?"
        message="Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Sim, excluir"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Container>
        <Header>
          <TitleGroup>
            <Title>🗂️ Painel Administrativo</Title>
            <Subtitle>Gerencie todos os posts da plataforma</Subtitle>
          </TitleGroup>
          <CreateBtn to="/admin/posts/new">+ Novo Post</CreateBtn>
        </Header>

        <StatsBar>
          <Stat>
            <StatValue>{posts.length}</StatValue>
            <StatLabel>Total de posts</StatLabel>
          </Stat>
        </StatsBar>

        {loading && <StatusMsg>Carregando...</StatusMsg>}
        {error && <ErrorMsg>{error}</ErrorMsg>}

        {!loading && !error && posts.length === 0 && (
          <EmptyState>
            <p>Nenhum post criado ainda.</p>
            <Link to="/admin/posts/new">Criar o primeiro post →</Link>
          </EmptyState>
        )}

        {!loading && !error && posts.length > 0 && (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th hide="sm">Autor</Th>
                <Th hide="sm">Data</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <Td>
                    <PostTitle to={`/posts/${post.id}`}>{post.title}</PostTitle>
                    <PostExcerpt>
                      {post.content?.slice(0, 80)}{post.content?.length > 80 ? '...' : ''}
                    </PostExcerpt>
                  </Td>
                  <Td hide="sm">
                    <AuthorText>{post.author}</AuthorText>
                  </Td>
                  <Td hide="sm">
                    <DateText>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </DateText>
                  </Td>
                  <Td align="right">
                    <Actions>
                      <ActionBtn to={`/admin/posts/${post.id}/edit`} variant="edit">
                        Editar
                      </ActionBtn>
                      <DeleteActionBtn onClick={() => handleDelete(post.id)}>
                        Excluir
                      </DeleteActionBtn>
                    </Actions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </Page>
  )
}

const Page = styled.div`
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`

const TitleGroup = styled.div``

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const CreateBtn = styled(Link)`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  flex-shrink: 0;

  &:hover { opacity: 0.85; }
`

const StatsBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px 20px;
`

const StatValue = styled.span`
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const StatLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const Th = styled.th`
  padding: 12px 16px;
  text-align: ${({ align }) => align || 'left'};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ hide }) => hide ? 'none' : 'table-cell'};
  }
`

const Td = styled.td`
  padding: 14px 16px;
  text-align: ${({ align }) => align || 'left'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
  vertical-align: middle;

  tr:last-child & { border-bottom: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ hide }) => hide ? 'none' : 'table-cell'};
  }
`

const PostTitle = styled(Link)`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  margin-bottom: 2px;
  transition: color 0.2s ease;

  &:hover { color: ${({ theme }) => theme.colors.primaryLight}; }
`

const PostExcerpt = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const AuthorText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
`

const ActionBtn = styled(Link)`
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  transition: all 0.2s ease;

  &:hover { background: ${({ theme }) => theme.colors.primary}40; }
`

const DeleteActionBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.danger}20;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  transition: all 0.2s ease;

  &:hover { background: ${({ theme }) => theme.colors.danger}40; }
`

const StatusMsg = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing['2xl']};
`

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.danger}10;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  a {
    color: ${({ theme }) => theme.colors.primaryLight};
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
`
