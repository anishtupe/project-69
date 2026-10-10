import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Typography, Radius, Spacing } from '../../lib/theme'

interface TagProps {
  label: string
  selected?: boolean
  onPress?: () => void
  color?: string
  style?: ViewStyle
  disabled?: boolean
}

export default function Tag({ label, selected = false, onPress, color, style, disabled = false }: TagProps) {
  const tagColor = color ?? Colors.primary

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.tag,
        selected
          ? [styles.selected, { backgroundColor: `${tagColor}25`, borderColor: `${tagColor}80` }]
          : styles.unselected,
        style,
      ]}
    >
      <Text style={[styles.label, selected ? { color: tagColor } : styles.unselectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  selected: {},
  unselected: {
    backgroundColor: Colors.white05,
    borderColor: Colors.border,
  },
  label: {
    ...Typography.bodySM,
    fontFamily: 'DMSans_400Regular',
  },
  unselectedLabel: {
    color: Colors.textMuted,
  },
})
