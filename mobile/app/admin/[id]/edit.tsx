import { useAuth } from '@/context/AuthContext'
import { C } from '@/constants/app-theme'
import { getPostById, updatePost } from '@/services/api'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isTeacher } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    if (!isTeacher) return
    getPostById(id)
      .then(post => {
        setTitle(post.title)
        setContent(post.content)
        setAuthor(post.author)
      })
      .catch(() => setFetchError('Erro ao carregar o post.'))
      .finally(() => setLoading(false))
  }, [id, isTeacher])

  if (!isTeacher) return <Redirect href="/(tabs)" />

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Título é obrigatório.'
    if (!content.trim()) e.content = 'Conteúdo é obrigatório.'
    if (!author.trim()) e.author = 'Autor é obrigatório.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await updatePost(id, { title: title.trim(), content: content.trim(), author: author.trim() })
      router.back()
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
          <Text style={styles.loadingText}>Carregando post...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (fetchError) {
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{fetchError}</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>✏️ Editar post</Text>
          <Text style={styles.subheading}>Atualize as informações do post</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={[styles.input, !!errors.title && styles.inputError]}
              placeholder="Título do post"
              placeholderTextColor={C.textMuted}
              value={title}
              onChangeText={t => { setTitle(t); setErrors(e => ({ ...e, title: '' })) }}
            />
            {!!errors.title && <Text style={styles.fieldError}>{errors.title}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Autor</Text>
            <TextInput
              style={[styles.input, !!errors.author && styles.inputError]}
              placeholder="Nome do autor"
              placeholderTextColor={C.textMuted}
              value={author}
              onChangeText={t => { setAuthor(t); setErrors(e => ({ ...e, author: '' })) }}
            />
            {!!errors.author && <Text style={styles.fieldError}>{errors.author}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textarea, !!errors.content && styles.inputError]}
              placeholder="Conteúdo do post..."
              placeholderTextColor={C.textMuted}
              value={content}
              onChangeText={t => { setContent(t); setErrors(e => ({ ...e, content: '' })) }}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            {!!errors.content && <Text style={styles.fieldError}>{errors.content}</Text>}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.cancelBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.back()}
              disabled={submitting}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { opacity: pressed || submitting ? 0.7 : 1 },
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: C.textPrimary,
  },
  subheading: {
    fontSize: 14,
    color: C.textSecondary,
    marginTop: -8,
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
  inputError: {
    borderColor: C.danger,
  },
  textarea: {
    minHeight: 180,
    paddingTop: 12,
  },
  fieldError: {
    fontSize: 12,
    color: C.danger,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.textSecondary,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: C.textSecondary,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: C.danger,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.primaryLight,
  },
})
