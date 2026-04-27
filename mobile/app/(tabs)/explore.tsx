import { useAuth } from '@/context/AuthContext'
import { C } from '@/constants/app-theme'
import { deletePost, getAllPosts, Post } from '@/services/api'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AdminScreen() {
  const { isTeacher } = useAuth()
  const router = useRouter()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isTeacher) {
      setLoading(false)
      return
    }
    getAllPosts()
      .then(setPosts)
      .catch(() => setError('Erro ao carregar posts.'))
      .finally(() => setLoading(false))
  }, [isTeacher])

  if (!isTeacher) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedDesc}>
            Este painel é exclusivo para professores. Faça login como professor para acessar.
          </Text>
        </View>
      </SafeAreaView>
    )
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

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.row}>
      <Pressable
        style={styles.rowContent}
        onPress={() => router.push(`/post/${item.id}`)}
      >
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rowMeta}>
          {item.author} · {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.rowExcerpt} numberOfLines={2}>{item.content}</Text>
      </Pressable>
      <View style={styles.rowActions}>
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
    </View>
  )

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🗂️ Painel Admin</Text>
          <Text style={styles.headerSub}>Gerencie os posts da plataforma</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.newBtn, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() => router.push('/admin/new')}
        >
          <Text style={styles.newBtnText}>+ Novo Post</Text>
        </Pressable>
      </View>

      {/* Stats */}
      {!loading && !error && (
        <View style={styles.statsBar}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{posts.length}</Text>
            <Text style={styles.statLabel}>Total de posts</Text>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum post criado ainda.</Text>
              <Pressable
                style={styles.createFirstBtn}
                onPress={() => router.push('/admin/new')}
              >
                <Text style={styles.createFirstText}>Criar o primeiro post →</Text>
              </Pressable>
            </View>
          }
        />
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
  newBtn: {
    backgroundColor: C.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  newBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.primaryLight,
  },
  statLabel: {
    fontSize: 13,
    color: C.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  row: {
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  rowContent: {
    gap: 4,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
  },
  rowMeta: {
    fontSize: 12,
    color: C.textMuted,
  },
  rowExcerpt: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 17,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
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
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: C.danger,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: C.textMuted,
    textAlign: 'center',
  },
  createFirstBtn: {
    marginTop: 4,
  },
  createFirstText: {
    fontSize: 14,
    color: C.primaryLight,
    fontWeight: '500',
  },
  restricted: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  restrictedIcon: {
    fontSize: 56,
  },
  restrictedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textPrimary,
  },
  restrictedDesc: {
    fontSize: 15,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
})
