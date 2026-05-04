import { AuthProvider } from '@/context/AuthContext'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="post/[id]"
            options={{ title: 'Post', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/new"
            options={{ title: 'Novo Post', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/[id]/edit"
            options={{ title: 'Editar Post', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/posts"
            options={{ title: 'Posts', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/teachers/index"
            options={{ title: 'Professores', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/teachers/new"
            options={{ title: 'Novo Professor', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/teachers/[id]/edit"
            options={{ title: 'Editar Professor', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/students/index"
            options={{ title: 'Alunos', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/students/new"
            options={{ title: 'Novo Aluno', headerBackTitle: 'Voltar' }}
          />
          <Stack.Screen
            name="admin/students/[id]/edit"
            options={{ title: 'Editar Aluno', headerBackTitle: 'Voltar' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  )
}
