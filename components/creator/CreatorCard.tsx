import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Creator } from '../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../lib/theme'
import { formatFollowers, formatEngagement, getPlatformColor } from '../../lib/utils'
import { PlatformIcons } from '../../lib/theme'
import Avatar from '../shared/Avatar'
import Tag from '../shared/Tag'
import Card from '../shared/Card'

interface CreatorCardProps {
  creator: Creator
  onPress?: () => void
  compact?: boolean
}

export default function CreatorCard({ creator, onPress, compact = false }: CreatorCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push(`/(brand)/discovery/${creator.handle}`)
    }
  }

  const topPlatforms = creator.creator_platforms?.slice(0, 3) ?? []

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Card style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Avatar uri={creator.avatar} name={creator.name} size="lg" verified={creator.is_verified} />
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {creator.name}
              </Text>
              {creator.is_verified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={14}
                  color={Colors.primary}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <Text style={styles.handle} numberOfLines={1}>
              @{creator.handle}
            </Text>
            {creator.location && (
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.location}>{creator.location}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        {!compact && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatFollowers(creator.total_followers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatEngagement(creator.avg_engagement_rate)}</Text>
              <Text style={styles.statLabel}>Engagement</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatFollowers(creator.avg_reach)}</Text>
              <Text style={styles.statLabel}>Avg Reach</Text>
            </View>
          </View>
        )}

        {/* Platforms */}
        {topPlatforms.length > 0 && (
          <View style={styles.platforms}>
            {topPlatforms.map((p) => (
              <View
                key={p.id}
                style={[
                  styles.platformPill,
                  { backgroundColor: `${getPlatformColor(p.platform)}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={PlatformIcons[p.platform] as any}
                  size={12}
                  color={getPlatformColor(p.platform)}
                />
                <Text style={[styles.platformLabel, { color: getPlatformColor(p.platform) }]}>
                  {formatFollowers(p.followers)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Niches */}
        {creator.niches?.length > 0 && (
          <View style={styles.niches}>
            {creator.niches.slice(0, 3).map((n) => (
              <Tag key={n} label={n} />
            ))}
            {creator.niches.length > 3 && (
              <Text style={styles.moreNiches}>+{creator.niches.length - 3}</Text>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  header: { flexDirection: 'row', marginBottom: Spacing.lg },
  headerText: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  verifiedIcon: { marginLeft: 4 },
  handle: { ...Typography.bodySM, color: Colors.textMuted, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  location: { ...Typography.bodyXS, color: Colors.textMuted, marginLeft: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.xs,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: { ...Typography.numericSM, color: Colors.textPrimary },
  statLabel: { ...Typography.bodyXS, color: Colors.textMuted, marginTop: 2 },
  platforms: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.sm },
  platformPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  platformLabel: { ...Typography.bodyXS, marginLeft: 4, fontFamily: 'Syne_700Bold' },
  niches: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  moreNiches: { ...Typography.bodyXS, color: Colors.textMuted, alignSelf: 'center', marginLeft: 4 },
})
