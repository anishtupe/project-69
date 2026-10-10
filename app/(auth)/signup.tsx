import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../lib/theme'
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'

export default function SignUpScreen() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [role, setRole] = useState<UserRole>('creator')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await signUp(email.trim(), password, role)
      // If user session is immediate, root layout redirects to onboarding.
      // If email confirmation is needed, router pushes to login.
      if (role === 'creator') {
        router.replace('/(auth)/onboarding-creator')
      } else {
        router.replace('/(auth)/onboarding-brand')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brandTitle}>
            INFLUDE<Text style={{ color: Colors.primary }}>AI</Text>
          </Text>
          <Text style={styles.subtitle}>Join as a Creator or a Brand</Text>
        </View>

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleOption, role === 'creator' && styles.roleOptionActive]}
            onPress={() => setRole('creator')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleText, role === 'creator' && styles.roleTextActive]}>
              Creator
            </Text>
            <Text style={styles.roleSub}>Monetize your audience</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleOption, role === 'brand' && styles.roleOptionActive]}
            onPress={() => setRole('brand')}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleText, role === 'brand' && styles.roleTextActive]}>
              Brand
            </Text>
            <Text style={styles.roleSub}>Hire top influencers</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email-outline"
          />

          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="lock-check-outline"
          />

          <Button
            title={`Sign Up as ${role === 'creator' ? 'Creator' : 'Brand'}`}
            onPress={handleSignUp}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  brandTitle: {
    ...Typography.displayMD,
    color: Colors.textPrimary,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleOption: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  roleOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  roleText: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleTextActive: {
    color: Colors.primary,
  },
  roleSub: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
  errorBox: {
    backgroundColor: Colors.coralMuted,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.coral,
  },
  errorText: {
    ...Typography.bodySM,
    color: Colors.coral,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
  footerLink: {
    ...Typography.bodyMD,
    color: Colors.primary,
    fontFamily: 'Syne_700Bold',
  },
})
