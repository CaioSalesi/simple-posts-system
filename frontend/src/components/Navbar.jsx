import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isTeacher, isStudent } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Nav>
      <Inner>
        <Logo to="/">
          <LogoIcon>📚</LogoIcon>
          <LogoText>ClassHub</LogoText>
        </Logo>

        <Links>
          <NavLink to="/">Posts</NavLink>
          {isTeacher && (
            <>
              <NavLink to="/admin">Painel</NavLink>
              <NavLink to="/admin/posts/new">Criar Post</NavLink>
            </>
          )}
        </Links>

        <UserArea>
          {user ? (
            <>
              {isTeacher && (
                <UserBadge role="teacher">
                  👨‍🏫 Professor
                  <span>{user.name}</span>
                </UserBadge>
              )}
              {isStudent && (
                <UserBadge role="student">
                  🎓 Aluno
                  <span>{user.name}</span>
                </UserBadge>
              )}
              <LogoutBtn onClick={handleLogout}>Sair</LogoutBtn>
            </>
          ) : (
            <LoginBtn to="/login">Entrar</LoginBtn>
          )}
        </UserArea>
      </Inner>
    </Nav>
  )
}

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  height: 64px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
  }
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`

const LogoIcon = styled.span`
  font-size: 24px;
`

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`

const NavLink = styled(Link)`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme, role }) => role === 'teacher' ? theme.colors.primary : theme.colors.accent};
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme, role }) => role === 'teacher' ? theme.colors.primary + '50' : theme.colors.accent + '50'};

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      display: none;
    }
  }
`

const LogoutBtn = styled.button`
  padding: 7px 16px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger}44;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.danger}22;
  }
`

const LoginBtn = styled(Link)`
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`
