import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useAuthStore } from '../../../store/authStore'
import { useBrandByUserId } from '../../../hooks/useCampaigns'
import { useConversations } from '../../../hooks/useMessages'
import { Conversation } from '../../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { formatRelativeTime } from '../../../lib/utils'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import Avatar from '../../../components/shared/Avatar'
import Card from '../../../components/shared/Card'
import EmptyState from '../../../components/shared/EmptyState'

export default function BrandMessagesScreen() {
  const { user } = useAuthStore()
  const { data: brand } = useBrandByUserId(user?.id ?? null)
  const {
    data: conversations,
    isLoading,
    isRefetching,
    refetch,
  } = useConversations(brand?.id ?? null, null)

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity activeOpacity={0.75}>
      <Card style={styles.convCard}>
        <Avatar
          uri={item.creators?.avatar}
          name={item.creators?.name || 'Creator'}
          size="md"
          verified={item.creators?.is_verified}
        />
        <View style={styles.convDetails}>
          <View style={styles.convHeader}>
            <Text style={styles.creatorName} numberOfLines={1}>
              {item.creators?.name || 'Creator'}
            </Text>
            <Text style={styles.time}>{formatRelativeTime(item.last_message_at)}</Text>
          </View>
          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.last_message || 'Start a conversation...'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <ScreenHeader title="Creator Messages" subtitle="Direct chats with partnered influencers" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations || []}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
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
              icon="message-text-outline"
              title="No chats yet"
              description="Initiate conversations from creator profiles or campaign applications."
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
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  convDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  creatorName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    flex: 1,
  },
  time: {
    ...Typography.bodyXS,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  lastMsg: {
    ...Typography.bodySM,
    color: Colors.textSecondary,
  },
})
