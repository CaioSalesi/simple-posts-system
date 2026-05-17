import { useAuth } from '@/context/AuthContext'
import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { C } from '@/constants/app-theme'
import { Redirect, Tabs } from 'expo-router'
import { Pressable, Text } from 'react-native'

export default function TabLayout() {
  const { user, isTeacher, logout } = useAuth()

  if (!user) return <Redirect href="/login" />

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primaryLight,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: C.bgCard,
          borderTopColor: C.border,
        },
        headerStyle: { backgroundColor: C.bgCard },
        headerTintColor: C.textPrimary,
        tabBarButton: HapticTab,
        headerRight: () => (
          <Pressable
            onPress={logout}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500' }}>
              Sair
            </Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Posts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="gear.fill" color={color} />
          ),
          href: isTeacher ? '/explore' : null,
        }}
      />
    </Tabs>
  )
}
