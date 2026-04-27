import { useAuth } from '@/context/AuthContext'
import { C } from '@/constants/app-theme'
import { Redirect, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

type Role = 'teacher' | 'student'

const ROLES: { id: Role; icon: string; label: string; description: string; color: string }[] = [
  {
    id: 'student',
    icon: '🎓',
    label: 'Aluno',
    description: 'Acesse e leia os posts dos seus professores',
    color: C.accent,
  },
  {
    id: 'teacher',
    icon: '👨‍🏫',
    label: 'Professor',
    description: 'Gerencie, crie e edite postagens educacionais',
    color: C.primary,
  },
]

export default function LoginScreen() {
  const { user, login } = useAuth()
  const router = useRouter()

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Redirect href="/(tabs)" />

  const activeRole = ROLES.find(r => r.id === selectedRole)

  const handleSubmit = () => {
    if (!selectedRole) return
    const ok = login(name, password, selectedRole)
    if (ok) {
      router.replace('/(tabs)')
    } else {
      setError('Nome e senha são obrigatórios.')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>📚</Text>
          <Text style={styles.appName}>ClassHub</Text>
          <Text style={styles.tagline}>Plataforma de educação conectada</Text>
        </View>

        {!selectedRole ? (
          <>
            <Text style={styles.chooseTitle}>Como você quer entrar?</Text>
            <View style={styles.roleGrid}>
              {ROLES.map(role => (
                <Pressable
                  key={role.id}
                  style={({ pressed }) => [
                    styles.roleCard,
                    { borderColor: role.color + '50', opacity: pressed ? 0.8 : 1 },
                  ]}
                  onPress={() => { setSelectedRole(role.id); setError('') }}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text style={styles.roleLabel}>{role.label}</Text>
                  <Text style={styles.roleDesc}>{role.description}</Text>
                  <Text style={[styles.roleArrow, { color: role.color }]}>→</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <Pressable style={styles.backBtn} onPress={() => { setSelectedRole(null); setError('') }}>
              <Text style={styles.backBtnText}>← Voltar</Text>
            </Pressable>

            <View style={[styles.roleHeader, { borderColor: activeRole!.color + '50', backgroundColor: activeRole!.color + '18' }]}>
              <Text style={styles.roleHeaderIcon}>{activeRole!.icon}</Text>
              <View>
                <Text style={styles.roleHeaderTitle}>Entrar como {activeRole!.label}</Text>
                <Text style={styles.roleHeaderDesc}>{activeRole!.description}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor={C.textMuted}
                value={name}
                onChangeText={t => { setName(t); setError('') }}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={t => { setPassword(t); setError('') }}
                secureTextEntry
              />
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: activeRole!.color, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>Entrar como {activeRole!.label}</Text>
            </Pressable>

            <View style={styles.demoNotice}>
              <Text style={styles.demoText}>
                <Text style={{ color: C.warning, fontWeight: '700' }}>💡 Modo demonstração:</Text>
                {' '}qualquer nome e senha são aceitos.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
    gap: 20,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: C.primaryLight,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: C.textMuted,
  },
  chooseTitle: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: C.textSecondary,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  roleIcon: {
    fontSize: 36,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
  },
  roleDesc: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  roleArrow: {
    fontSize: 18,
    marginTop: 4,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: '500',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  roleHeaderIcon: {
    fontSize: 32,
  },
  roleHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 2,
  },
  roleHeaderDesc: {
    fontSize: 12,
    color: C.textMuted,
    flexShrink: 1,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  input: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: C.textPrimary,
  },
  errorBox: {
    backgroundColor: C.danger + '20',
    borderWidth: 1,
    borderColor: C.danger + '50',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: C.danger,
    fontSize: 13,
  },
  submitBtn: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  demoNotice: {
    backgroundColor: C.warning + '10',
    borderWidth: 1,
    borderColor: C.warning + '30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  demoText: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
})
