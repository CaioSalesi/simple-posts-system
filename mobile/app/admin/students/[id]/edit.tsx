import { C } from '@/constants/app-theme'
import { getStudentById, updateStudent } from '@/services/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    getStudentById(id)
      .then(s => { setName(s.name); setEmail(s.email) })
      .catch(() => setFetchError('Erro ao carregar aluno.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nome é obrigatório.'
    if (!email.trim()) e.email = 'E-mail é obrigatório.'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSubmitting(true)
    try {
      const data: any = { name: name.trim(), email: email.trim() }
      if (password.trim()) data.password = password
      await updateStudent(id, data)
      router.back()
    } catch (err: any) {
      if (err.message?.includes('409')) {
        setErrors({ email: 'E-mail já cadastrado.' })
      } else {
        Alert.alert('Erro', 'Não foi possível salvar as alterações.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
    </SafeAreaView>
  )

  if (fetchError) return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.center}><Text style={styles.errorText}>{fetchError}</Text></View>
    </SafeAreaView>
  )

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>✏️ Editar Aluno</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={[styles.input, !!errors.name && styles.inputError]}
              value={name}
              onChangeText={t => { setName(t); setErrors(e => ({ ...e, name: '' })) }}
              autoCapitalize="words"
              placeholderTextColor={C.textMuted}
            />
            {!!errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, !!errors.email && styles.inputError]}
              value={email}
              onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: '' })) }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={C.textMuted}
            />
            {!!errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nova Senha <Text style={styles.optional}>(opcional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Deixe em branco para não alterar"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={() => router.back()} disabled={submitting}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, { opacity: submitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>{submitting ? 'Salvando...' : 'Salvar'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },
  heading: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  optional: { fontSize: 11, color: C.textMuted, fontWeight: '400' },
  input: { backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: C.textPrimary },
  inputError: { borderColor: C.danger },
  fieldError: { fontSize: 12, color: C.danger },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
  submitBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { fontSize: 14, color: C.danger, textAlign: 'center' },
})
