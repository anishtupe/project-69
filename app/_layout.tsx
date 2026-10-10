import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts, Syne_700Bold } from '@expo-google-fonts/syne'
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { useCreatorByUserId } from '../hooks/useCreators'
import { useBrandByUserId } from '../hooks/useCampaigns'
import { Colors } from '../lib/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
})

function NavigationRoot() {
  const router = useRouter()
  const segments = useSegments() as string[]
  const { user, role, isLoading } = useAuthStore()
  useAuth() // initialize auth listener

  const { data: creator, isLoading: isCreatorLoading } = useCreatorByUserId(
    role === 'creator' ? user?.id ?? null : null
  )
  const { data: brand, isLoading: isBrandLoading } = useBrandByUserId(
    role === 'brand' ? user?.id ?? null : null
  )

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login')
      }
      return
    }

    // Check onboarding status
    if (role === 'creator') {
      if (isCreatorLoading) return
      const isCreatorOnboarded = !!creator?.handle && creator.handle.trim().length > 0
      if (!isCreatorOnboarded) {
        if (segments[1] !== 'onboarding-creator') {
          router.replace('/(auth)/onboarding-creator')
        }
        return
      }

      if (inAuthGroup) {
        router.replace('/(creator)')
      }
    } else if (role === 'brand') {
      if (isBrandLoading) return
      const isBrandOnboarded = !!brand?.name && brand.name.trim().length > 0
      if (!isBrandOnboarded) {
        if (segments[1] !== 'onboarding-brand') {
          router.replace('/(auth)/onboarding-brand')
        }
        return
      }

      if (inAuthGroup) {
        router.replace('/(brand)')
      }
    }
  }, [user, role, isLoading, creator, brand, isCreatorLoading, isBrandLoading, segments])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(creator)" options={{ headerShown: false }} />
        <Stack.Screen name="(brand)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_700Bold,
    DMSans_400Regular,
  })

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationRoot />
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
