import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Button from './Button'
import { Colors, Typography, Spacing } from '../../lib/theme'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  style?: ViewStyle
}

export default function EmptyState({
  icon = 'inbox-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon as any} size={44} color={Colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={styles.action}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.massive,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing.xl,
  },
})
