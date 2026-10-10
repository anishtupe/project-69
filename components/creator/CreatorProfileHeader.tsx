import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Creator } from '../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../lib/theme'
import {
  formatFollowers,
  formatEngagement,
  formatCurrency,
  getPlatformColor,
} from '../../lib/utils'
import { PlatformIcons } from '../../lib/theme'
import Avatar from '../shared/Avatar'
import Tag from '../shared/Tag'
import Badge from '../shared/Badge'

interface CreatorProfileHeaderProps {
  creator: Creator
  onMessage?: () => void
  onSave?: () => void
  isSaved?: boolean
  isOwnProfile?: boolean
  onEdit?: () => void
}

export default function CreatorProfileHeader({
  creator,
  onMessage,
  onSave,
  isSaved = false,
  isOwnProfile = false,
  onEdit,
}: CreatorProfileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Avatar + Actions */}
      <View style={styles.topRow}>
        <Avatar uri={creator.avatar} name={creator.name} size="xxl" verified={creator.is_verified} />
        <View style={styles.actions}>
          {isOwnProfile ? (
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, isSaved && styles.actionBtnActive]}
                onPress={onSave}
              >
                <MaterialCommunityIcons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={isSaved ? Colors.primary : Colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.messageBtn]} onPress={onMessage}>
                <MaterialCommunityIcons name="message-outline" size={18} color={Colors.bg} />
                <Text style={styles.messageBtnText}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Name + Handle */}
      <View style={styles.nameSection}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{creator.name}</Text>
          {creator.is_verified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color={Colors.primary}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
        <Text style={styles.handle}>@{creator.handle}</Text>

        {/* Location + Languages */}
        <View style={styles.metaRow}>
          {creator.location && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{creator.location}</Text>
            </View>
          )}
          {creator.languages?.length > 0 && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="translate" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{creator.languages.slice(0, 2).join(', ')}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bio */}
      {creator.bio && <Text style={styles.bio}>{creator.bio}</Text>}

      {/* Niches */}
      {creator.niches?.length > 0 && (
        <View style={styles.niches}>
          {creator.niches.map((n) => (
            <Tag key={n} label={n} selected />
          ))}
        </View>
      )}

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFollowers(creator.total_followers)}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatEngagement(creator.avg_engagement_rate)}</Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatFollowers(creator.avg_reach)}</Text>
          <Text style={styles.statLabel}>Avg Reach</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{creator.posts_per_week || 0}</Text>
          <Text style={styles.statLabel}>Posts/Wk</Text>
        </View>
      </View>

      {/* Profile Strength */}
      {isOwnProfile && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>Profile Strength</Text>
            <Text style={styles.strengthPct}>{creator.profile_strength}%</Text>
          </View>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                { width: `${creator.profile_strength}%` as any },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  messageBtn: {
    flexDirection: 'row',
    width: 'auto',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    gap: 6,
  },
  messageBtnText: { ...Typography.labelMD, color: Colors.bg },
  nameSection: { marginBottom: Spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { ...Typography.h1, color: Colors.textPrimary },
  handle: { ...Typography.bodyMD, color: Colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { ...Typography.bodySM, color: Colors.textMuted, marginLeft: 4 },
  bio: { ...Typography.bodyMD, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  niches: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.lg },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: { ...Typography.numericMD, color: Colors.textPrimary },
  statLabel: { ...Typography.bodyXS, color: Colors.textMuted, marginTop: 4 },
  strengthContainer: { marginBottom: Spacing.md },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  strengthLabel: { ...Typography.labelMD, color: Colors.textMuted },
  strengthPct: { ...Typography.labelMD, color: Colors.primary },
  strengthBar: {
    height: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
})
