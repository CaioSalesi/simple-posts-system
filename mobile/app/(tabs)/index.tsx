import { C } from '@/constants/app-theme'
import { useAuth } from '@/context/AuthContext'
import { deletePost, getAllPosts, Post, searchPosts } from '@/services/api'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { user, isTeacher, logout } = useAuth()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryRef = useRef(query)
  queryRef.current = query
  const isFirstFocusRef = useRef(true)

  const fetchPosts = useCallback(async (q: string) => {
    setError('')
    try {
      if (q.trim()) {
        const res = await searchPosts(q.trim())
        setPosts(res.results)
      } else {
        const data = await getAllPosts()
        setPosts(data)
      }
    } catch {
      setError('Erro ao carregar posts. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const handleFocus = useCallback(() => {
    const q = queryRef.current
    if (isFirstFocusRef.current) {
      isFirstFocusRef.current = false
      setLoading(true)
    } else {
      setRefreshing(true)
    }
    fetchPosts(q)
  }, [fetchPosts])

  useFocusEffect(handleFocus)

  const handleSearchChange = (text: string) => {
    setQuery(text)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      fetchPosts(text)
    }, 400)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchPosts(query)
  }

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Excluir post?',
      `"${title}" será removido permanentemente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(id)
              setPosts(prev => prev.filter(p => p.id !== id))
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o post.')
            }
          },
        },
      ]
    )
  }

  const renderPost = ({ item }: { item: Post }) => (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <View style={styles.cardMeta}>
        <Text style={styles.cardAuthor}>✍️ {item.author}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardExcerpt} numberOfLines={3}>
        {item.content}
      </Text>
      {isTeacher && (
        <View style={styles.cardActions}>
          <Pressable
            style={styles.editBtn}
            onPress={() => router.push(`/admin/${item.id}/edit`)}
          >
            <Text style={styles.editBtnText}>Editar</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id, item.title)}
          >
            <Text style={styles.deleteBtnText}>Excluir</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  )

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📚 ClassHub</Text>
          <Text style={styles.headerSub}>
            Olá, {user?.name} · {user?.role === 'teacher' ? 'Professor' : 'Aluno'}
          </Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou palavras-chave..."
          placeholderTextColor={C.textMuted}
          value={query}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
          <Text style={styles.loadingText}>Carregando posts...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => { setLoading(true); fetchPosts(query) }}>
            <Text style={styles.retryBtnText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={C.primary}
            />
          }
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>
              {query
                ? `Resultados para "${query}" (${posts.length})`
                : `Todos os posts (${posts.length})`}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {query
                  ? `Nenhum post encontrado para "${query}".`
                  : 'Nenhum post publicado ainda.'}
              </Text>
            </View>
          }
        />
      )}

      {/* FAB for teachers */}
      {isTeacher && (
        <Pressable
          style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() => router.push('/admin/new')}
        >
          <Text style={styles.fabText}>+ Novo Post</Text>
        </Pressable>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  logoutText: {
    fontSize: 13,
    color: C.textSecondary,
    fontWeight: '500',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: C.textMuted,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAuthor: {
    fontSize: 12,
    color: C.accent,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 11,
    color: C.textMuted,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.textPrimary,
    lineHeight: 22,
  },
  cardExcerpt: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 19,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.primary + '25',
    borderWidth: 1,
    borderColor: C.primary + '50',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.primaryLight,
  },
  deleteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.danger + '20',
    borderWidth: 1,
    borderColor: C.danger + '40',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.danger,
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
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 15,
    color: C.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.primary + '30',
    borderWidth: 1,
    borderColor: C.primary + '60',
  },
  retryBtnText: {
    fontSize: 14,
    color: C.primaryLight,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: C.primary,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
})
