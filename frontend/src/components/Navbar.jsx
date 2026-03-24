import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isTeacher, isStudent } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <Nav>
      <Inner>
        <Logo to="/" onClick={closeMenu}>
          <LogoIcon>📚</LogoIcon>
          <LogoText>ClassHub</LogoText>
        </Logo>

        <MenuButton onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </MenuButton>

        <Links open={menuOpen}>
          <NavLink to="/" onClick={closeMenu}>Posts</NavLink>
          {isTeacher && (
            <>
              <NavLink to="/admin" onClick={closeMenu}>Painel</NavLink>
              <NavLink to="/admin/posts/new" onClick={closeMenu}>Criar Post</NavLink>
            </>
          )}
        </Links>

        <UserArea>
          {user ? (
            <>
              {isTeacher && (
                <UserBadge role="teacher">
                  👨‍🏫 <span className="role">Professor</span>
                  <span className="name">{user.name}</span>
                </UserBadge>
              )}
              {isStudent && (
                <UserBadge role="student">
                  🎓 <span className="role">Aluno</span>
                  <span className="name">{user.name}</span>
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.sm};
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
    display: ${({ open }) => (open ? 'flex' : 'none')};
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bgCard};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    padding: ${({ theme }) => theme.spacing.sm} 0;
    z-index: 50;
  }
`

const MenuButton = styled.button`
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 4px 8px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    align-items: center;
    justify-content: center;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    text-align: center;
    padding: 12px 16px;
    border-radius: 0;
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
  white-space: nowrap;

  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    .name { display: none; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    .role { display: none; }
    padding: 6px 8px;
    font-size: 16px;
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
