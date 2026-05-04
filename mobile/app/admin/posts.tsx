import { C } from '@/constants/app-theme'
import { deletePost, getAllPosts, Post } from '@/services/api'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AdminPostsScreen() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch(() => setError('Erro ao carregar posts.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Excluir post?', `"${title}" será removido permanentemente.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(id)
            setPosts(prev => prev.filter(p => p.id !== id))
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.')
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.topBar}>
        <Text style={styles.count}>{posts.length} post(s)</Text>
        <Pressable style={styles.newBtn} onPress={() => router.push('/admin/new')}>
          <Text style={styles.newBtnText}>+ Novo</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Pressable style={styles.rowContent} onPress={() => router.push(`/post/${item.id}`)}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rowMeta}>{item.author} · {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
              </Pressable>
              <View style={styles.rowActions}>
                <Pressable style={styles.editBtn} onPress={() => router.push(`/admin/${item.id}/edit`)}>
                  <Text style={styles.editBtnText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.title)}>
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}><Text style={styles.emptyText}>Nenhum post criado ainda.</Text></View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  count: { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  newBtn: { backgroundColor: C.primary, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  list: { padding: 16, gap: 10 },
  row: { backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, gap: 10 },
  rowContent: { gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  rowMeta: { fontSize: 12, color: C.textMuted },
  rowActions: { flexDirection: 'row', gap: 8 },
  editBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.primary + '25', borderWidth: 1, borderColor: C.primary + '50' },
  editBtnText: { fontSize: 12, fontWeight: '600', color: C.primaryLight },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.danger + '20', borderWidth: 1, borderColor: C.danger + '40' },
  deleteBtnText: { fontSize: 12, fontWeight: '600', color: C.danger },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { fontSize: 14, color: C.danger, textAlign: 'center' },
  emptyText: { fontSize: 15, color: C.textMuted },
})
