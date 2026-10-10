import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../lib/theme'

export default function BrandLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="discovery/[handle]" options={{ presentation: 'card' }} />
    </Stack>
  )
}
