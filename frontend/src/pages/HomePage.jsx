import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import ConfirmModal from '../components/ConfirmModal'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { deletePost, getAllPosts, searchPosts } from '../services/api'

export default function HomePage() {
  const { isTeacher } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchPosts = useCallback(async (searchQuery) => {
    setLoading(true)
    setError('')
    try {
      let data
      if (searchQuery) {
        const res = await searchPosts(searchQuery)
        data = res.data.results
      } else {
        const res = await getAllPosts()
        data = res.data
      }
      setPosts(data)
    } catch (err) {
      setError('Erro ao carregar posts. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(query)
  }, [query, fetchPosts])

  const handleSearch = useCallback((q) => {
    setQuery(q)
  }, [])

  const handleDelete = (id) => {
    setDeleteTarget(id)
  }

  const confirmDelete = async () => {
    try {
      await deletePost(deleteTarget)
      setPosts(prev => prev.filter(p => p.id !== deleteTarget))
    } catch {
      // silently fail — modal closes either way
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <Page>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir post?"
        message="Esta ação não pode ser desfeita. O post será removido permanentemente."
        confirmLabel="Sim, excluir"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Hero>
        <HeroContent>
          <HeroLabel>Plataforma Educacional</HeroLabel>
          <HeroTitle>Conhecimento para <GradientText>todos</GradientText></HeroTitle>
          <HeroSubtitle>
            Posts e aulas compartilhados por professores da rede pública,
            disponíveis para toda a comunidade.
          </HeroSubtitle>
        </HeroContent>
      </Hero>

      <Container>
        <SearchWrapper>
          <SearchBar onSearch={handleSearch} placeholder="Buscar por título ou palavras-chave..." />
          {query && (
            <SearchInfo>
              Resultados para: <strong>"{query}"</strong>
              {!loading && ` — ${posts.length} post(s)`}
            </SearchInfo>
          )}
        </SearchWrapper>

        {loading && <LoadingState>Carregando posts...</LoadingState>}

        {error && <ErrorState>{error}</ErrorState>}

        {!loading && !error && posts.length === 0 && (
          <EmptyState>
            {query
              ? `Nenhum post encontrado para "${query}".`
              : 'Nenhum post publicado ainda.'}
          </EmptyState>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <SectionHeader>
              <SectionTitle>
                {query ? `Resultados (${posts.length})` : `Todos os posts (${posts.length})`}
              </SectionTitle>
            </SectionHeader>
            <Grid>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  isTeacher={isTeacher}
                  onDelete={handleDelete}
                />
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Page>
  )
}

const Page = styled.div`
  min-height: calc(100vh - 64px);
`

const Hero = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.bgCard} 0%, ${({ theme }) => theme.colors.bg} 100%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
`

const HeroContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`

const HeroLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const HeroTitle = styled.h1`
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const GradientText = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const HeroSubtitle = styled.p`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

const SearchInfo = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0 4px;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`

const LoadingState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing['3xl']};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`

const ErrorState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.danger}10;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.xl};
`

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.spacing['3xl']};
  font-size: 16px;
`
