import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('classhub_user')
        return saved ? JSON.parse(saved) : null
    })

    const login = (name, password, role = 'student') => {
        // Demo login: any non-empty name/password grants access with the chosen role
        if (!name || !password) return false
        const userData = { name, role }   // role: 'teacher' | 'student'
        setUser(userData)
        localStorage.setItem('classhub_user', JSON.stringify(userData))
        return true
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('classhub_user')
    }

    const isTeacher = user?.role === 'teacher'
    const isStudent = user?.role === 'student'

    return (
        <AuthContext.Provider value={{ user, login, logout, isTeacher, isStudent }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
