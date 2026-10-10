import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useAuthStore } from '../../../store/authStore'
import { useBrandByUserId, useBrandCampaigns } from '../../../hooks/useCampaigns'
import { Campaign } from '../../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { formatBudgetRange, formatDate } from '../../../lib/utils'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import Card from '../../../components/shared/Card'
import Badge from '../../../components/shared/Badge'
import Tag from '../../../components/shared/Tag'
import EmptyState from '../../../components/shared/EmptyState'

export default function BrandCampaignsScreen() {
  const { user } = useAuthStore()
  const { data: brand } = useBrandByUserId(user?.id ?? null)
  const {
    data: campaigns,
    isLoading,
    isRefetching,
    refetch,
  } = useBrandCampaigns(brand?.id ?? null)

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <Card style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.info}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.objective}>
            {item.objective ? `Objective: ${item.objective.toUpperCase()}` : 'Standard Campaign'}
          </Text>
        </View>
        <Badge label={item.status.toUpperCase()} variant="status" value={item.status} />
      </View>

      {item.brief && (
        <Text style={styles.brief} numberOfLines={2}>
          {item.brief}
        </Text>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>
            {formatBudgetRange(item.budget_min, item.budget_max)}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Applicants</Text>
          <Text style={styles.statValue}>{item.applicant_count || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Created</Text>
          <Text style={styles.statValue}>{formatDate(item.created_at)}</Text>
        </View>
      </View>

      {item.niches?.length > 0 && (
        <View style={styles.tagsRow}>
          {item.niches.slice(0, 3).map((n) => (
            <Tag key={n} label={n} disabled />
          ))}
        </View>
      )}
    </Card>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader title="Brand Campaigns" subtitle="Manage your open and active campaigns" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={campaigns || []}
          keyExtractor={(item) => item.id}
          renderItem={renderCampaign}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="bullhorn-outline"
              title="No campaigns created"
              description="Create your first influencer marketing campaign to start receiving creator pitches."
            />
          }
        />
      )}
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
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  objective: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    marginTop: 2,
  },
  brief: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
  },
  statValue: {
    ...Typography.labelMD,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
