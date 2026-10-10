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
import { useCreatorByUserId, useUpdateCreator } from '../../hooks/useCreators'
import { Colors, Typography, Spacing } from '../../lib/theme'
import { NICHES, LOCATIONS, LANGUAGES } from '../../lib/constants'
import { toggleArrayItem } from '../../lib/utils'
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'
import Tag from '../../components/shared/Tag'

export default function CreatorOnboardingScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: creator, isLoading: isFetching } = useCreatorByUserId(user?.id ?? null)
  const updateCreatorMutation = useUpdateCreator()

  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [rateReel, setRateReel] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Pre-fill existing data if resuming incomplete onboarding
  useEffect(() => {
    if (creator) {
      if (creator.handle) setHandle(creator.handle)
      if (creator.name) setName(creator.name)
      if (creator.bio) setBio(creator.bio)
      if (creator.niches?.length) setSelectedNiches(creator.niches)
      if (creator.location) setLocation(creator.location)
      if (creator.rate_reel) setRateReel(creator.rate_reel.toString())
    }
  }, [creator])

  const handleComplete = async () => {
    const cleanHandle = handle.trim().replace(/^@/, '')
    const cleanName = name.trim()

    if (!cleanHandle || !cleanName) {
      setError('Please provide your name and a unique handle.')
      return
    }

    if (selectedNiches.length === 0) {
      setError('Please select at least one content niche.')
      return
    }

    try {
      setError(null)
      if (!creator?.id) {
        throw new Error('Creator profile record not found. Please try again.')
      }

      await updateCreatorMutation.mutateAsync({
        id: creator.id,
        updates: {
          handle: cleanHandle,
          name: cleanName,
          bio: bio.trim() || null,
          niches: selectedNiches,
          location: location.trim() || null,
          rate_reel: rateReel ? parseFloat(rateReel) || 0 : 0,
          profile_strength: 60,
        },
      })

      router.replace('/(creator)')
    } catch (err: any) {
      setError(err.message || 'Failed to save creator profile.')
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
          <Text style={styles.stepTag}>CREATOR ONBOARDING</Text>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>
            Brands discover and hire you based on this information.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="e.g. Alex Rivers"
            value={name}
            onChangeText={setName}
            leftIcon="account-outline"
          />

          <Input
            label="Handle / Username *"
            placeholder="alexrivers"
            prefix="@"
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
            leftIcon="at"
          />

          <Input
            label="Bio"
            placeholder="Tell brands what makes your content stand out..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            containerStyle={{ minHeight: 90 }}
          />

          <Text style={styles.sectionLabel}>Select Content Niches *</Text>
          <View style={styles.nichesContainer}>
            {NICHES.slice(0, 15).map((n) => {
              const isSelected = selectedNiches.includes(n)
              return (
                <Tag
                  key={n}
                  label={n}
                  selected={isSelected}
                  onPress={() => setSelectedNiches(toggleArrayItem(selectedNiches, n))}
                />
              )
            })}
          </View>

          <Input
            label="Location"
            placeholder="e.g. Mumbai, Delhi, Bengaluru"
            value={location}
            onChangeText={setLocation}
            leftIcon="map-marker-outline"
          />

          <Input
            label="Base Rate per Reel (₹)"
            placeholder="e.g. 15000"
            value={rateReel}
            onChangeText={setRateReel}
            keyboardType="numeric"
            leftIcon="currency-inr"
          />

          <Button
            title="Complete Setup"
            onPress={handleComplete}
            loading={updateCreatorMutation.isPending}
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
  nichesContainer: {
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
