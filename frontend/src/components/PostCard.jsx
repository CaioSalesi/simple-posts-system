import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function PostCard({ post, onDelete, isTeacher }) {
    const excerpt = post.content?.length > 150
        ? post.content.slice(0, 150) + '...'
        : post.content

    const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        })
        : null

    return (
        <Card>
            <CardContent>
                <Meta>
                    <AuthorTag>✍️ {post.author}</AuthorTag>
                    {formattedDate && <DateTag>{formattedDate}</DateTag>}
                </Meta>

                <CardLink to={`/posts/${post.id}`}>
                    <Title>{post.title}</Title>
                </CardLink>

                <Excerpt>{excerpt}</Excerpt>
            </CardContent>

            <CardFooter>
                <ReadBtn to={`/posts/${post.id}`}>Ler post →</ReadBtn>
                {isTeacher && (
                    <AdminActions>
                        <EditBtn to={`/admin/posts/${post.id}/edit`}>Editar</EditBtn>
                        <DeleteBtn onClick={() => onDelete(post.id)}>Excluir</DeleteBtn>
                    </AdminActions>
                )}
            </CardFooter>
        </Card>
    )
}

const Card = styled.article`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.25s ease;
  cursor: default;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}88;
    box-shadow: ${({ theme }) => theme.shadows.glow};
    transform: translateY(-2px);
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const AuthorTag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accent}15;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.accent}40;
`

const DateTag = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const CardLink = styled(Link)`
  display: block;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  transition: color 0.2s ease;

  ${CardLink}:hover & {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`

const Excerpt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
`

const ReadBtn = styled(Link)`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryLight};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const AdminActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const EditBtn = styled(Link)`
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}40;
  }
`

const DeleteBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.danger}20;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.danger}40;
  }
`
