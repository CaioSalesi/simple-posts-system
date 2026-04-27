import { createContext, useContext, useState } from 'react'

type Role = 'teacher' | 'student'
type User = { name: string; role: Role }

type AuthContextType = {
  user: User | null
  login: (name: string, password: string, role: Role) => boolean
  logout: () => void
  isTeacher: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (name: string, password: string, role: Role): boolean => {
    if (!name.trim() || !password.trim()) return false
    setUser({ name: name.trim(), role })
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider
      value={{
        user,
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
