import { createContext, useContext, useState } from 'react'
import { login as apiLogin, setAuthToken } from '@/services/api'

type Role = 'teacher' | 'student'
type User = { id: string; name: string; email: string; role: Role }

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string, role: Role) => Promise<string | null>
  logout: () => void
  isTeacher: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Returns null on success, error message on failure
  const login = async (email: string, password: string, role: Role): Promise<string | null> => {
    try {
      const res = await apiLogin(email, password, role)
      setAuthToken(res.token)
      setToken(res.token)
      setUser(res.user)
      return null
    } catch (err: any) {
      if (err.message?.includes('401')) return 'Credenciais inválidas.'
      if (err.message?.includes('404')) return 'Usuário não encontrado.'
      return 'Erro ao conectar. Verifique a conexão.'
    }
  }

  const logout = () => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
