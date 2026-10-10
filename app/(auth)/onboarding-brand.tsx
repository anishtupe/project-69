import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import { useBrandByUserId } from '../../hooks/useCampaigns'
import { supabase } from '../../lib/supabase'
import { Colors, Typography, Spacing } from '../../lib/theme'
import { INDUSTRIES } from '../../lib/constants'
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'
import Tag from '../../components/shared/Tag'

export default function BrandOnboardingScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: brand, isLoading: isFetching, refetch } = useBrandByUserId(user?.id ?? null)

  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brand) {
      if (brand.name) setName(brand.name)
      if (brand.industry) setIndustry(brand.industry)
      if (brand.website) setWebsite(brand.website)
      if (brand.description) setDescription(brand.description)
    }
  }, [brand])

  const handleComplete = async () => {
    const cleanName = name.trim()
    if (!cleanName) {
      setError('Please provide your brand or company name.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (!brand?.id) {
        throw new Error('Brand record not found. Please try again.')
      }

      const { error: updateError } = await supabase
        .from('brands')
        .update({
          name: cleanName,
          industry: industry.trim() || null,
          website: website.trim() || null,
          description: description.trim() || null,
        })
        .eq('id', brand.id)

      if (updateError) throw updateError

      await refetch()
      router.replace('/(brand)')
    } catch (err: any) {
      setError(err.message || 'Failed to save brand details.')
    } finally {
      setLoading(false)
    }
  }

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.stepTag}>BRAND ONBOARDING</Text>
          <Text style={styles.title}>Company profile</Text>
          <Text style={styles.subtitle}>
            Tell creators who you are and what your brand stands for.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Company / Brand Name *"
            placeholder="e.g. Acme Studio"
            value={name}
            onChangeText={setName}
            leftIcon="domain"
          />

          <Text style={styles.sectionLabel}>Select Primary Industry</Text>
          <View style={styles.tagsContainer}>
            {INDUSTRIES.slice(0, 12).map((ind) => (
              <Tag
                key={ind}
                label={ind}
                selected={industry === ind}
                onPress={() => setIndustry(industry === ind ? '' : ind)}
              />
            ))}
          </View>

          <Input
            label="Website"
            placeholder="https://acme.com"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            autoCapitalize="none"
            leftIcon="web"
          />

          <Input
            label="About Brand"
            placeholder="Short overview of your mission, audience, and campaign goals..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            containerStyle={{ minHeight: 100 }}
          />

          <Button
            title="Complete Setup"
            onPress={handleComplete}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.massive,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  stepTag: {
    ...Typography.labelSM,
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.labelMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xl,
  },
  submitBtn: {
    marginTop: Spacing.xl,
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
})
