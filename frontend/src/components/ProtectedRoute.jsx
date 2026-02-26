import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { isTeacher } = useAuth()

    if (!isTeacher) {
        return <Navigate to="/login" replace />
    }

    return children
}
