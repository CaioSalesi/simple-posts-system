import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  {
    id: 'student',
    icon: '🎓',
    label: 'Aluno',
    description: 'Acesse e leia os posts dos seus professores',
    color: '#06B6D4', // cyan / accent
  },
  {
    id: 'teacher',
    icon: '👨‍🏫',
    label: 'Professor',
    description: 'Gerencie, crie e edite postagens educacionais',
    color: '#4F46E5', // indigo / primary
  },
]

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [selectedRole, setSelectedRole] = useState(null)
  const [form, setForm] = useState({ name: '', password: '' })
  const [error, setError] = useState('')

  if (user) {
    navigate(from, { replace: true })
    return null
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    const success = login(form.name.trim(), form.password, selectedRole)
    if (success) {
      navigate(from, { replace: true })
    } else {
      setError('Nome e senha são obrigatórios.')
    }
  }

  const activeRole = ROLES.find(r => r.id === selectedRole)

  return (
    <Page>
      <Card>
        <LogoArea>
          <Logo>📚</Logo>
          <AppName>ClassHub</AppName>
          <Tagline>Plataforma de educação conectada</Tagline>
        </LogoArea>

        {!selectedRole ? (
          <>
            <ChooseTitle>Como você quer entrar?</ChooseTitle>
            <RoleGrid>
              {ROLES.map(role => (
                <RoleCard
                  key={role.id}
                  color={role.color}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <RoleIcon>{role.icon}</RoleIcon>
                  <RoleLabel>{role.label}</RoleLabel>
                  <RoleDesc>{role.description}</RoleDesc>
                  <RoleArrow color={role.color}>→</RoleArrow>
                </RoleCard>
              ))}
            </RoleGrid>
          </>
        ) : (
          <>
            <BackBtn type="button" onClick={() => { setSelectedRole(null); setError('') }}>
              ← Voltar
            </BackBtn>

            <RoleHeader color={activeRole.color}>
              <span>{activeRole.icon}</span>
              <div>
                <h2>Entrar como {activeRole.label}</h2>
                <p>{activeRole.description}</p>
              </div>
            </RoleHeader>

            <Form onSubmit={handleSubmit} noValidate>
              <Field>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  autoFocus
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </Field>

              {error && <ErrorMsg role="alert">⚠️ {error}</ErrorMsg>}

              <SubmitBtn type="submit" color={activeRole.color}>
                Entrar como {activeRole.label}
              </SubmitBtn>
            </Form>

            <DemoNotice>
              <strong>💡 Modo demonstração:</strong> qualquer nome e senha são aceitos.
            </DemoNotice>
          </>
        )}
      </Card>
    </Page>
  )
}

/* ─── Styled Components ─── */

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; }`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: radial-gradient(ellipse at 60% 0%, #1e1b4b 0%, ${({ theme }) => theme.colors.bg} 60%);
`

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const LogoArea = styled.div`
  text-align: center;
`

const Logo = styled.div`
  font-size: 40px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const AppName = styled.h1`
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Tagline = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`

const ChooseTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`

const RoleCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: ${({ color }) => color}88;
    background: ${({ color }) => color}0f;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({ color }) => color}20;
  }
`

const RoleIcon = styled.span`
  font-size: 36px;
`

const RoleLabel = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const RoleDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`

const RoleArrow = styled.span`
  font-size: 18px;
  color: ${({ color }) => color};
  margin-top: ${({ theme }) => theme.spacing.xs};
  transition: transform 0.2s ease;

  ${RoleCard}:hover & {
    transform: translateX(4px);
  }
`

const BackBtn = styled.button`
  align-self: flex-start;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px 0;
  transition: color 0.2s ease;

  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`

const RoleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ color }) => color}10;
  border: 1px solid ${({ color }) => color}30;
  border-radius: ${({ theme }) => theme.radii.md};

  span { font-size: 32px; flex-shrink: 0; }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 2px;
  }

  p {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const Input = styled.input`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 15px;
  transition: all 0.2s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }
`

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.danger}15;
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 10px 14px;
  font-size: 13px;
`

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 15px;
  font-weight: 700;
  color: white;
  background: ${({ color, theme }) => color
    ? `linear-gradient(135deg, ${color}dd, ${color})`
    : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`
  };
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.88; }
`

const DemoNotice = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 1.6;
  padding: 12px;
  background: ${({ theme }) => theme.colors.warning}08;
  border: 1px solid ${({ theme }) => theme.colors.warning}20;
  border-radius: ${({ theme }) => theme.radii.sm};

  strong { color: ${({ theme }) => theme.colors.warning}; }
`
