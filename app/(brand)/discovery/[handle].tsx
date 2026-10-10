import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCreator, useSaveCreator, useUnsaveCreator } from '../../../hooks/useCreators'
import { useBrandByUserId } from '../../../hooks/useCampaigns'
import { useAuthStore } from '../../../store/authStore'
import { useCreateConversation } from '../../../hooks/useMessages'
import { Colors, Typography, Spacing } from '../../../lib/theme'
import { formatCurrency } from '../../../lib/utils'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import CreatorProfileHeader from '../../../components/creator/CreatorProfileHeader'
import PlatformStatRow from '../../../components/creator/PlatformStatRow'
import Card from '../../../components/shared/Card'
import EmptyState from '../../../components/shared/EmptyState'

export default function CreatorDetailScreen() {
  const router = useRouter()
  const { handle } = useLocalSearchParams<{ handle: string }>()
  const { user } = useAuthStore()
  const { data: brand } = useBrandByUserId(user?.id ?? null)

  const {
    data: creator,
    isLoading,
    isRefetching,
    refetch,
  } = useCreator(handle || '')

  const createConversationMutation = useCreateConversation()

  const handleMessage = async () => {
    if (!brand?.id || !creator?.id) return
    try {
      await createConversationMutation.mutateAsync({
        brandId: brand.id,
        creatorId: creator.id,
      })
      router.push('/(brand)/(tabs)/messages')
    } catch (e) {
      console.error(e)
    }
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
        <ScreenHeader title="Creator Profile" showBack />
        <EmptyState
          icon="account-question-outline"
          title="Creator Not Found"
          description={`No creator profile found for @${handle}`}
        />
      </View>
    )
  }

  const platforms = creator.creator_platforms || []

  return (
    <View style={styles.container}>
      <ScreenHeader title={`@${creator.handle}`} showBack />

      <ScrollView
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
          isOwnProfile={false}
          onMessage={handleMessage}
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

        {/* Social Platforms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Reach</Text>
          {platforms.length > 0 ? (
            platforms.map((p) => <PlatformStatRow key={p.id} platform={p} />)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No linked platforms.</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
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
  emptyCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyMD,
    color: Colors.textMuted,
  },
})
