import { C } from '@/constants/app-theme'
import { deleteStudent, getAllStudents, Student } from '@/services/api'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StudentsListScreen() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const fetchPage = useCallback(async (p: number, append = false) => {
    try {
      const res = await getAllStudents(p)
      setTotal(res.total)
      setStudents(prev => append ? [...prev, ...res.students] : res.students)
    } catch {
      setError('Erro ao carregar alunos.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const handleFocus = useCallback(() => {
    fetchPage(1)
  }, [fetchPage])

  useFocusEffect(handleFocus)

  const handleLoadMore = () => {
    if (loadingMore || students.length >= total) return
    const next = page + 1
    setPage(next)
    setLoadingMore(true)
    fetchPage(next, true)
  }

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Excluir aluno?', `"${name}" será removido permanentemente.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            await deleteStudent(id)
            setStudents(prev => prev.filter(s => s.id !== id))
            setTotal(prev => prev - 1)
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
        <Text style={styles.count}>{total} aluno(s)</Text>
        <Pressable style={styles.newBtn} onPress={() => router.push('/admin/students/new')}>
          <Text style={styles.newBtnText}>+ Novo</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={C.primary} style={{ marginVertical: 16 }} /> : null}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowEmail}>{item.email}</Text>
                <Text style={styles.rowDate}>Desde {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable style={styles.editBtn} onPress={() => router.push(`/admin/students/${item.id}/edit`)}>
                  <Text style={styles.editBtnText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum aluno cadastrado.</Text>
              <Pressable onPress={() => router.push('/admin/students/new')}>
                <Text style={styles.emptyLink}>Cadastrar o primeiro →</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  count: { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  newBtn: { backgroundColor: C.accent, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  list: { padding: 16, gap: 10 },
  row: { backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, gap: 10 },
  rowInfo: { gap: 3 },
  rowName: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  rowEmail: { fontSize: 13, color: C.accent },
  rowDate: { fontSize: 11, color: C.textMuted },
  rowActions: { flexDirection: 'row', gap: 8 },
  editBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.primary + '25', borderWidth: 1, borderColor: C.primary + '50' },
  editBtnText: { fontSize: 12, fontWeight: '600', color: C.primaryLight },
  deleteBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.danger + '20', borderWidth: 1, borderColor: C.danger + '40' },
  deleteBtnText: { fontSize: 12, fontWeight: '600', color: C.danger },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  errorText: { fontSize: 14, color: C.danger, textAlign: 'center' },
  emptyText: { fontSize: 15, color: C.textMuted },
  emptyLink: { fontSize: 14, color: C.primaryLight, fontWeight: '500' },
})
