import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { getPostById } from '../services/api'

export default function PostDetailPage() {
    const { id } = useParams()
    const { isTeacher } = useAuth()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(id)
                setPost(res.data)
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Post não encontrado.')
                } else {
                    setError('Erro ao carregar o post.')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    if (loading) return <StatusPage><PulseText>Carregando post...</PulseText></StatusPage>
    if (error) return (
        <StatusPage>
            <ErrorBox>{error}</ErrorBox>
            <BackLink to="/">← Voltar para a lista</BackLink>
        </StatusPage>
    )

    const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('pt-BR', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        })
        : null

    const updatedDate = post.updatedAt && post.updatedAt !== post.createdAt
        ? new Date(post.updatedAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric'
        })
        : null

    return (
        <Page>
            <Container>
                <Breadcrumb>
                    <Link to="/">Posts</Link>
                    <Separator>/</Separator>
                    <span>{post.title}</span>
                </Breadcrumb>

                <Article>
                    <ArticleHeader>
                        <Meta>
                            <AuthorTag>✍️ {post.author}</AuthorTag>
                            {formattedDate && <DateTag>{formattedDate}</DateTag>}
                            {updatedDate && <UpdatedTag>Editado em {updatedDate}</UpdatedTag>}
                        </Meta>

                        <Title>{post.title}</Title>

                        {isTeacher && (
                            <TeacherActions>
                                <Link to={`/admin/posts/${post.id}/edit`}>
                                    <EditBtn>✏️ Editar post</EditBtn>
                                </Link>
                            </TeacherActions>
                        )}
                    </ArticleHeader>

                    <Divider />

                    <Content>
                        {post.content.split('\n').map((paragraph, i) =>
                            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                        )}
                    </Content>
                </Article>

                <Footer>
                    <BackLink to="/">← Voltar para a lista</BackLink>
                </Footer>
            </Container>
        </Page>
    )
}

const Page = styled.div`
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  a {
    color: ${({ theme }) => theme.colors.primaryLight};
    &:hover { text-decoration: underline; }
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
`

const Separator = styled.span`
  opacity: 0.4;
`

const Article = styled.article`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.radii.md};
  }
`

const ArticleHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const AuthorTag = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accent}15;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.accent}40;
`

const DateTag = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const UpdatedTag = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`

const Title = styled.h1`
  font-size: clamp(22px, 4vw, 36px);
  font-weight: 800;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const TeacherActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const EditBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  padding: 7px 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}40;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`

const Content = styled.div`
  font-size: 16px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.textPrimary};

  p { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  p:last-child { margin-bottom: 0; }
`

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const BackLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primaryLight};
  transition: color 0.2s ease;

  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`

const StatusPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.xl};
`

const PulseText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`

const ErrorBox = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.danger}10;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  text-align: center;
`
