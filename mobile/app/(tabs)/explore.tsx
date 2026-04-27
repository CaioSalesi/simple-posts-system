import { useAuth } from '@/context/AuthContext'
import { C } from '@/constants/app-theme'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Section = {
  icon: string
  label: string
  description: string
  route: string
}

const SECTIONS: Section[] = [
  {
    icon: '📝',
    label: 'Posts',
    description: 'Gerenciar todas as postagens',
    route: '/admin/posts',
  },
  {
    icon: '👨‍🏫',
    label: 'Professores',
    description: 'Cadastrar, editar e excluir professores',
    route: '/admin/teachers',
  },
  {
    icon: '🎓',
    label: 'Alunos',
    description: 'Cadastrar, editar e excluir alunos',
    route: '/admin/students',
  },
]

export default function AdminMenuScreen() {
  const { user, isTeacher } = useAuth()
  const router = useRouter()

  if (!isTeacher) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.restricted}>
          <Text style={styles.restrictedIcon}>🔒</Text>
          <Text style={styles.restrictedTitle}>Acesso Restrito</Text>
          <Text style={styles.restrictedDesc}>
            Este painel é exclusivo para professores.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗂️ Painel Admin</Text>
        <Text style={styles.headerSub}>Bem-vindo, {user?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Gerenciar</Text>
        {SECTIONS.map(s => (
          <Pressable
            key={s.route}
            style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
            onPress={() => router.push(s.route as any)}
          >
            <Text style={styles.cardIcon}>{s.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>{s.label}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.textPrimary },
  headerSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  scroll: { padding: 16, gap: 10 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, color: C.textMuted, marginBottom: 4,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 18,
  },
  cardIcon: { fontSize: 32 },
  cardContent: { flex: 1 },
  cardLabel: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  cardDesc: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  cardArrow: { fontSize: 22, color: C.textMuted },
  restricted: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16,
  },
  restrictedIcon: { fontSize: 56 },
  restrictedTitle: { fontSize: 22, fontWeight: '800', color: C.textPrimary },
  restrictedDesc: { fontSize: 15, color: C.textMuted, textAlign: 'center', lineHeight: 22 },
})
