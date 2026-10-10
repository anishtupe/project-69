import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../../store/authStore'
import { useAuth } from '../../../hooks/useAuth'
import { useCreatorByUserId } from '../../../hooks/useCreators'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { formatCurrency } from '../../../lib/utils'
import CreatorProfileHeader from '../../../components/creator/CreatorProfileHeader'
import PlatformStatRow from '../../../components/creator/PlatformStatRow'
import Card from '../../../components/shared/Card'
import Button from '../../../components/shared/Button'
import EmptyState from '../../../components/shared/EmptyState'

export default function CreatorProfileScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { signOut } = useAuth()
  const {
    data: creator,
    isLoading,
    isRefetching,
    refetch,
  } = useCreatorByUserId(user?.id ?? null)

  const handleEditProfile = () => {
    router.push('/(auth)/onboarding-creator')
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (!creator) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="account-alert-outline"
          title="Profile Not Found"
          description="We couldn't load your creator profile. Please complete setup."
          actionLabel="Complete Setup"
          onAction={() => router.replace('/(auth)/onboarding-creator')}
        />
      </View>
    )
  }

  const platforms = creator.creator_platforms || []

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={Colors.primary}
        />
      }
    >
      <CreatorProfileHeader
        creator={creator}
        isOwnProfile
        onEdit={handleEditProfile}
      />

      {/* Pricing / Deliverables Rates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content Rates</Text>
        <View style={styles.ratesGrid}>
          <Card style={styles.rateCard}>
            <Text style={styles.rateLabel}>Instagram Reel</Text>
            <Text style={styles.rateValue}>
              {creator.rate_reel ? formatCurrency(creator.rate_reel) : '—'}
            </Text>
          </Card>
          <Card style={styles.rateCard}>
            <Text style={styles.rateLabel}>Instagram Story</Text>
            <Text style={styles.rateValue}>
              {creator.rate_story ? formatCurrency(creator.rate_story) : '—'}
            </Text>
          </Card>
          <Card style={styles.rateCard}>
            <Text style={styles.rateLabel}>Static Post</Text>
            <Text style={styles.rateValue}>
              {creator.rate_post ? formatCurrency(creator.rate_post) : '—'}
            </Text>
          </Card>
          <Card style={styles.rateCard}>
            <Text style={styles.rateLabel}>YouTube Video</Text>
            <Text style={styles.rateValue}>
              {creator.rate_youtube_video ? formatCurrency(creator.rate_youtube_video) : '—'}
            </Text>
          </Card>
        </View>
      </View>

      {/* Connected Platforms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Socials</Text>
        {platforms.length > 0 ? (
          platforms.map((p) => <PlatformStatRow key={p.id} platform={p} />)
        ) : (
          <Card style={styles.emptySocialsCard}>
            <Text style={styles.emptySocialsText}>No social accounts connected yet.</Text>
          </Card>
        )}
      </View>

      {/* Account Actions */}
      <View style={styles.actionsSection}>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={handleEditProfile}
          fullWidth
          style={{ marginBottom: Spacing.md }}
        />
        <Button
          title="Sign Out"
          variant="danger"
          onPress={signOut}
          fullWidth
        />
      </View>
    </ScrollView>
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
  content: {
    paddingBottom: Spacing.massive,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  ratesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  rateCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  rateLabel: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  rateValue: {
    ...Typography.numericSM,
    color: Colors.primary,
  },
  emptySocialsCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptySocialsText: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
})
