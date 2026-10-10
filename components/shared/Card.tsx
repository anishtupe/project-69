import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Radius, Spacing } from '../../lib/theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: number
  noPadding?: boolean
  elevated?: boolean
  highlighted?: boolean
}

export default function Card({
  children,
  style,
  padding = Spacing.lg,
  noPadding = false,
  elevated = false,
  highlighted = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        highlighted && styles.highlighted,
        !noPadding && { padding },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
  },
  highlighted: {
    borderColor: Colors.borderBright,
  },
})
