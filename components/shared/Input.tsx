import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors, Typography, Radius, Spacing } from '../../lib/theme'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  hint?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  containerStyle?: ViewStyle
  prefix?: string
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  prefix,
  secureTextEntry,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = secureTextEntry
  const isSecure = isPassword && !showPassword

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon as any}
            size={18}
            color={Colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        {prefix && <Text style={styles.prefix}>{prefix}</Text>}

        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isSecure}
          cursorColor={Colors.primary}
          selectionColor={Colors.primaryMuted}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconBtn}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            disabled={!onRightIconPress}
          >
            <MaterialCommunityIcons
              name={rightIcon as any}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
  },
  inputWrapperError: {
    borderColor: Colors.coral,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  prefix: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
    marginRight: 4,
  },
  input: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  rightIconBtn: {
    padding: 4,
    marginLeft: Spacing.sm,
  },
  error: {
    ...Typography.bodySM,
    color: Colors.coral,
    marginTop: 4,
  },
  hint: {
    ...Typography.bodySM,
    color: Colors.textMuted,
    marginTop: 4,
  },
})
