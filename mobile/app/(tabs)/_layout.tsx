import { useAuth } from '@/context/AuthContext'
import { HapticTab } from '@/components/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { C } from '@/constants/app-theme'
import { Redirect, Tabs } from 'expo-router'

export default function TabLayout() {
  const { user, isTeacher } = useAuth()

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
          title: isTeacher ? 'Admin' : 'Painel',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
