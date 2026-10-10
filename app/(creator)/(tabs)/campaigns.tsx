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
import { useCreatorByUserId } from '../../../hooks/useCreators'
import { useApplications } from '../../../hooks/useApplications'
import { Application } from '../../../lib/types'
import { Colors, Typography, Spacing } from '../../../lib/theme'
import { formatCurrency, formatDate } from '../../../lib/utils'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import Card from '../../../components/shared/Card'
import Badge from '../../../components/shared/Badge'
import EmptyState from '../../../components/shared/EmptyState'

export default function CreatorCampaignsScreen() {
  const { user } = useAuthStore()
  const { data: creator } = useCreatorByUserId(user?.id ?? null)
  const {
    data: applications,
    isLoading,
    isRefetching,
    refetch,
  } = useApplications(creator?.id ?? null)

  const renderApplication = ({ item }: { item: Application }) => (
    <Card style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.info}>
          <Text style={styles.brandName}>
            {item.campaigns?.brands?.name || 'Brand Campaign'}
          </Text>
          <Text style={styles.campaignName}>{item.campaigns?.name || 'Campaign'}</Text>
        </View>
        <Badge label={item.status.toUpperCase()} variant="status" value={item.status} />
      </View>

      {item.pitch && (
        <Text style={styles.pitch} numberOfLines={2}>
          "{item.pitch}"
        </Text>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.rate}>
          Proposed: {item.proposed_rate ? formatCurrency(item.proposed_rate) : 'Standard Rate'}
        </Text>
        <Text style={styles.date}>Applied: {formatDate(item.applied_at)}</Text>
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Applications" subtitle="Track your collaboration submissions" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={applications || []}
          keyExtractor={(item) => item.id}
          renderItem={renderApplication}
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
              icon="clipboard-text-outline"
              title="No applications yet"
              description="Browse active campaigns in Explore and submit pitches to get hired."
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
  brandName: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  campaignName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  pitch: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  rate: {
    ...Typography.bodySM,
    color: Colors.primary,
    fontFamily: 'Syne_700Bold',
  },
  date: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
  },
})
