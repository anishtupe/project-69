import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native'
import { Colors, Typography, Radius, Spacing } from '../../lib/theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.bg : Colors.primary}
        />
      ) : (
        <View style={styles.inner}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderBright,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.coralMuted,
    borderWidth: 1,
    borderColor: Colors.coral,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  size_md: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  size_lg: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    minHeight: 56,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.45,
  },

  // Text styles
  text: {
    ...Typography.labelLG,
  },
  text_primary: {
    color: Colors.bg,
  },
  text_secondary: {
    color: Colors.textPrimary,
  },
  text_outline: {
    color: Colors.primary,
  },
  text_ghost: {
    color: Colors.textSecondary,
  },
  text_danger: {
    color: Colors.coral,
  },

  // Text sizes
  textSize_sm: {
    ...Typography.labelMD,
  },
  textSize_md: {
    ...Typography.labelLG,
  },
  textSize_lg: {
    ...Typography.h4,
  },
})
