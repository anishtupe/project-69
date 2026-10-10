import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CreatorPlatform } from '../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../lib/theme'
import { formatFollowers, formatEngagement, getPlatformColor } from '../../lib/utils'
import { PlatformIcons } from '../../lib/theme'

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
}

interface PlatformStatRowProps {
  platform: CreatorPlatform
}

export default function PlatformStatRow({ platform }: PlatformStatRowProps) {
  const color = getPlatformColor(platform.platform)
  const icon = PlatformIcons[platform.platform]

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.platformName}>{PLATFORM_LABELS[platform.platform]}</Text>
        <Text style={styles.handle}>@{platform.handle}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFollowers(platform.followers)}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatEngagement(platform.engagement_rate)}</Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFollowers(platform.avg_reach)}</Text>
          <Text style={styles.statLabel}>Avg Reach</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  platformName: { ...Typography.labelMD, color: Colors.textPrimary },
  handle: { ...Typography.bodyXS, color: Colors.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: Spacing.md },
  statItem: { alignItems: 'flex-end' },
  statValue: { ...Typography.labelMD, color: Colors.textPrimary },
  statLabel: { ...Typography.bodyXS, color: Colors.textMuted },
})
