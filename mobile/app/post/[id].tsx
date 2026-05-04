import { useAuth } from '@/context/AuthContext'
import { C } from '@/constants/app-theme'
import { getPostById, Post } from '@/services/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { isTeacher } = useAuth()
  const router = useRouter()

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPostById(id)
      .then(setPost)
      .catch(err => {
        setError(
          err.message?.includes('404')
            ? 'Post não encontrado.'
            : 'Erro ao carregar o post.'
        )
      })
      .finally(() => setLoading(false))
  }, [id])

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

  if (error || !post) {
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <View style={styles.center}>
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error || 'Post não encontrado.'}</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Voltar para a lista</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const wasEdited = post.updatedAt && post.updatedAt !== post.createdAt
  const editedDate = wasEdited
    ? new Date(post.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null

  const paragraphs = post.content.split('\n').filter(p => p.trim())

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.authorTag}>
            <Text style={styles.authorTagText}>✍️ {post.author}</Text>
          </View>
          {!!editedDate && (
            <Text style={styles.editedText}>Editado em {editedDate}</Text>
          )}
        </View>

        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.title}>{post.title}</Text>

        {isTeacher && (
          <Pressable
            style={({ pressed }) => [styles.editBtn, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => router.push(`/admin/${post.id}/edit`)}
          >
            <Text style={styles.editBtnText}>✏️ Editar post</Text>
          </Pressable>
        )}

        <View style={styles.divider} />

        <View style={styles.content}>
          {paragraphs.map((paragraph, i) => (
            <Text key={i} style={styles.paragraph}>{paragraph}</Text>
          ))}
        </View>

        <Pressable onPress={() => router.back()} style={styles.backLinkBottom}>
          <Text style={styles.backLinkText}>← Voltar para a lista</Text>
        </Pressable>
      </ScrollView>
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
    gap: 12,
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
  errorBox: {
    backgroundColor: C.danger + '15',
    borderWidth: 1,
    borderColor: C.danger + '40',
    borderRadius: 12,
    padding: 16,
    maxWidth: 320,
  },
  errorText: {
    color: C.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  authorTag: {
    backgroundColor: C.accent + '20',
    borderWidth: 1,
    borderColor: C.accent + '40',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  authorTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  editedText: {
    fontSize: 11,
    color: C.textMuted,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 13,
    color: C.textMuted,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.textPrimary,
    lineHeight: 34,
  },
  editBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.primary + '25',
    borderWidth: 1,
    borderColor: C.primary + '50',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.primaryLight,
  },
  divider: {
    height: 1,
    backgroundColor: C.surface,
    marginVertical: 4,
  },
  content: {
    gap: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: C.textPrimary,
  },
  backLink: {
    marginTop: 8,
  },
  backLinkBottom: {
    marginTop: 24,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: C.primaryLight,
  },
})
