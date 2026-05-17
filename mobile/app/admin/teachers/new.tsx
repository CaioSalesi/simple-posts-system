import { C } from '@/constants/app-theme'
import { Ionicons } from '@expo/vector-icons'
import { createTeacher } from '@/services/api'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NewTeacherScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nome é obrigatório.'
    if (!email.trim()) e.email = 'E-mail é obrigatório.'
    if (!password.trim()) e.password = 'Senha é obrigatória.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await createTeacher({ name: name.trim(), email: email.trim(), password })
      router.back()
    } catch (err: any) {
      if (err.message?.includes('409')) {
        setErrors({ email: 'E-mail já cadastrado.' })
      } else {
        Alert.alert('Erro', 'Não foi possível cadastrar o professor.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>👨‍🏫 Novo Professor</Text>

          {(['name', 'email', 'password'] as const).map(field => (
            <View key={field} style={styles.field}>
              <Text style={styles.label}>
                {field === 'name' ? 'Nome' : field === 'email' ? 'E-mail' : 'Senha'}
              </Text>
              <View style={field === 'password' ? styles.inputRow : undefined}>
                <TextInput
                  style={[styles.input, !!errors[field] && styles.inputError, field === 'password' && { flex: 1 }]}
                  placeholder={field === 'name' ? 'Nome completo' : field === 'email' ? 'email@exemplo.com' : '••••••••'}
                  placeholderTextColor={C.textMuted}
                  value={field === 'name' ? name : field === 'email' ? email : password}
                  onChangeText={t => {
                    if (field === 'name') setName(t)
                    else if (field === 'email') setEmail(t)
                    else setPassword(t)
                    setErrors(e => ({ ...e, [field]: '' }))
                  }}
                  keyboardType={field === 'email' ? 'email-address' : 'default'}
                  autoCapitalize={field === 'email' || field === 'password' ? 'none' : 'words'}
                  secureTextEntry={field === 'password' && !showPassword}
                />
                {field === 'password' && (
                  <Pressable onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={C.textMuted} />
                  </Pressable>
                )}
              </View>
              {!!errors[field] && <Text style={styles.fieldError}>{errors[field]}</Text>}
            </View>
          ))}

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={() => router.back()} disabled={submitting}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, { opacity: submitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>{submitting ? 'Cadastrando...' : 'Cadastrar'}</Text>
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
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  input: { backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: C.textPrimary },
  inputError: { borderColor: C.danger },
  fieldError: { fontSize: 12, color: C.danger },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: C.textSecondary },
  submitBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
})
