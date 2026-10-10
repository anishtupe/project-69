import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../../store/authStore'
import { useAuth } from '../../../hooks/useAuth'
import { useBrandByUserId } from '../../../hooks/useCampaigns'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { formatCurrency } from '../../../lib/utils'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import Card from '../../../components/shared/Card'
import Button from '../../../components/shared/Button'
import EmptyState from '../../../components/shared/EmptyState'

export default function BrandProfileScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { signOut } = useAuth()
  const {
    data: brand,
    isLoading,
    isRefetching,
    refetch,
  } = useBrandByUserId(user?.id ?? null)

  const handleEditProfile = () => {
    router.push('/(auth)/onboarding-brand')
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (!brand) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="domain"
          title="Brand Profile Not Found"
          description="We couldn't load your company profile. Please complete setup."
          actionLabel="Complete Setup"
          onAction={() => router.replace('/(auth)/onboarding-brand')}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Brand Account" subtitle="Company settings & billing summary" />

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
        <Card style={styles.mainCard}>
          <Text style={styles.brandName}>{brand.name}</Text>
          {brand.industry && <Text style={styles.industry}>{brand.industry}</Text>}
          {brand.website && <Text style={styles.website}>{brand.website}</Text>}
          {brand.description && <Text style={styles.desc}>{brand.description}</Text>}
        </Card>

        {/* Brand Metrics */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{brand.total_campaigns || 0}</Text>
            <Text style={styles.statLabel}>Total Campaigns</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(brand.total_spend || 0)}</Text>
            <Text style={styles.statLabel}>Total Spend</Text>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Edit Company Profile"
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
    padding: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  mainCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
  },
  brandName: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  industry: {
    ...Typography.labelMD,
    color: Colors.primary,
    marginBottom: 8,
  },
  website: {
    ...Typography.bodySM,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  desc: {
    ...Typography.bodyMD,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  statValue: {
    ...Typography.numericMD,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
  },
  actionsSection: {
    marginTop: Spacing.lg,
  },
})
