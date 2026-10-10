import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useCreators } from '../../../hooks/useCreators'
import { Creator } from '../../../lib/types'
import { Colors, Typography, Spacing, Radius } from '../../../lib/theme'
import { NICHES } from '../../../lib/constants'
import ScreenHeader from '../../../components/shared/ScreenHeader'
import CreatorCard from '../../../components/creator/CreatorCard'
import EmptyState from '../../../components/shared/EmptyState'
import { SkeletonCreatorCard } from '../../../components/shared/Skeleton'

export default function BrandDashboardScreen() {
  const [search, setSearch] = useState('')
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)

  const {
    data: creators,
    isLoading,
    isRefetching,
    refetch,
  } = useCreators({
    search: search.trim() || undefined,
    niches: selectedNiche ? [selectedNiche] : undefined,
  })

  // Filter out un-onboarded blank creator handles
  const validCreators = (creators || []).filter(
    (c) => c.handle && c.handle.trim().length > 0 && c.name && c.name.trim().length > 0
  )

  const renderCreator = ({ item }: { item: Creator }) => <CreatorCard creator={item} />

  return (
    <View style={styles.container}>
      <ScreenHeader title="Creator Discovery" subtitle="Discover verified creators for campaigns" />

      {/* Search Input Bar */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={Colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, handle, or bio..."
            placeholderTextColor={Colors.textDisabled}
            value={search}
            onChangeText={setSearch}
            cursorColor={Colors.primary}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
          <SkeletonCreatorCard />
          <SkeletonCreatorCard />
          <SkeletonCreatorCard />
        </View>
      ) : (
        <FlatList
          data={validCreators}
          keyExtractor={(item) => item.id}
          renderItem={renderCreator}
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
              icon="account-search-outline"
              title="No creators found"
              description={
                search || selectedNiche
                  ? 'No creators match your current search and filters. Try adjusting them.'
                  : 'No creators have completed their profiles yet.'
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
  searchBarWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.textPrimary,
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
})
