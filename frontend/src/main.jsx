import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import GlobalStyles from './styles/GlobalStyles'
import { theme } from './styles/theme'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <GlobalStyles />
                <App />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
)
