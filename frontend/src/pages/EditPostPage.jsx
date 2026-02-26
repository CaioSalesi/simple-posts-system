import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import PostForm from '../components/PostForm'
import { getPostById, updatePost } from '../services/api'

export default function EditPostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostById(id)
                setPost(res.data)
            } catch {
                setError('Post não encontrado.')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    const handleSubmit = async (data) => {
        await updatePost(id, data)
        navigate(`/posts/${id}`)
    }

    if (loading) return <StatusPage><PulseText>Carregando post...</PulseText></StatusPage>
    if (error) return <StatusPage><ErrorBox>{error}</ErrorBox></StatusPage>

    return (
        <Page>
            <Container>
                <Header>
                    <Title>✏️ Editar post</Title>
                    <Subtitle>Atualize o conteúdo do post abaixo</Subtitle>
                </Header>
                <FormCard>
                    <PostForm
                        initialData={post}
                        onSubmit={handleSubmit}
                        submitLabel="Salvar alterações"
                    />
                </FormCard>
            </Container>
        </Page>
    )
}

const Page = styled.div`
  min-height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
`

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

const StatusPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
`
