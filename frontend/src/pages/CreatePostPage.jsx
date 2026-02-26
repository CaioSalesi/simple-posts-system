import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import PostForm from '../components/PostForm'
import { createPost } from '../services/api'

export default function CreatePostPage() {
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        await createPost(data)
        navigate('/')
    }

    return (
        <Page>
            <Container>
                <Header>
                    <Title>✍️ Criar novo post</Title>
                    <Subtitle>Compartilhe seu conhecimento com os alunos</Subtitle>
                </Header>
                <FormCard>
                    <PostForm onSubmit={handleSubmit} submitLabel="Publicar Post" />
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
