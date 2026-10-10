import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useCampaigns } from '../../../hooks/useCampaigns'
import { Campaign } from '../../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { formatBudgetRange, formatDate } from '../../../lib/utils'
import { NICHES } from '../../../lib/constants'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import Card from '../../../components/shared/Card'
import Badge from '../../../components/shared/Badge'
import Tag from '../../../components/shared/Tag'
import EmptyState from '../../../components/shared/EmptyState'
import { SkeletonCampaignCard } from '../../../components/shared/Skeleton'

export default function CreatorExploreScreen() {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)

  const {
    data: campaigns,
    isLoading,
    isRefetching,
    refetch,
  } = useCampaigns({
    status: 'active',
    niches: selectedNiche ? [selectedNiche] : undefined,
  })

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <Card style={styles.campaignCard}>
      <View style={styles.cardTop}>
        <View style={styles.brandInfo}>
          <Text style={styles.brandName}>{item.brands?.name || 'Brand Campaign'}</Text>
          <Text style={styles.campaignTitle}>{item.name}</Text>
        </View>
        <Badge
          label={item.objective ? item.objective.toUpperCase() : 'ACTIVE'}
          variant="status"
          value="active"
        />
      </View>

      {item.brief && (
        <Text style={styles.brief} numberOfLines={2}>
          {item.brief}
        </Text>
      )}

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Budget</Text>
          <Text style={styles.detailValue}>
            {formatBudgetRange(item.budget_min, item.budget_max)}
          </Text>
        </View>
        {item.end_date && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Deadline</Text>
            <Text style={styles.detailValue}>{formatDate(item.end_date)}</Text>
          </View>
        )}
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
      <ScreenHeader title="Explore Campaigns" subtitle="Find collaborations with top brands" />

      {/* Niches Filter Scroll */}
      <View style={styles.filterWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...NICHES.slice(0, 10)]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => {
            const isAll = item === 'All'
            const isSelected = isAll ? selectedNiche === null : selectedNiche === item
            return (
              <TouchableOpacity
                onPress={() => setSelectedNiche(isAll ? null : isSelected ? null : item)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
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
              title="No campaigns found"
              description={
                selectedNiche
                  ? `No active campaigns in "${selectedNiche}". Try another niche.`
                  : 'There are no active campaigns available at this time.'
              }
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
  filterWrap: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.labelSM,
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  skeletonContainer: {
    padding: Spacing.lg,
  },
  campaignCard: {
    marginBottom: Spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  brandInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  brandName: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  campaignTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  brief: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
  },
  detailValue: {
    ...Typography.labelMD,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
