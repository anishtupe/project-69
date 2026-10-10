import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Typography, Radius, Spacing } from '../../lib/theme'
import { getStatusColor, getPlatformColor, capitalize } from '../../lib/utils'

type BadgeVariant = 'status' | 'platform' | 'niche' | 'default' | 'success' | 'warning' | 'error'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  /** For status and platform variants — maps to the matching color */
  value?: string
  dot?: boolean
  style?: ViewStyle
}

export default function Badge({ label, variant = 'default', value, dot = false, style }: BadgeProps) {
  const getColor = (): string => {
    if (variant === 'status' && value) return getStatusColor(value)
    if (variant === 'platform' && value) return getPlatformColor(value)
    if (variant === 'success') return Colors.primary
    if (variant === 'warning') return Colors.amber
    if (variant === 'error') return Colors.coral
    return Colors.textMuted
  }

  const color = getColor()

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}20`, borderColor: `${color}50` },
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    ...Typography.labelSM,
  },
})
