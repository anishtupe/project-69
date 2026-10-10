import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Radius } from '../../lib/theme'

interface SkeletonProps {
  width?: number | string
  height?: number
  radius?: number
  style?: ViewStyle
}

export function Skeleton({ width = '100%', height = 16, radius = Radius.xs, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: Colors.surfaceElevated,
          opacity,
        },
        style,
      ]}
    />
  )
}

export function SkeletonCreatorCard() {
  return (
    <View style={styles.creatorCard}>
      <View style={styles.cardHeader}>
        <Skeleton width={52} height={52} radius={26} />
        <View style={styles.cardHeaderText}>
          <Skeleton height={14} width="60%" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="40%" />
        </View>
      </View>
      <View style={styles.stats}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.stat}>
            <Skeleton height={18} width={60} style={{ marginBottom: 4 }} />
            <Skeleton height={11} width={48} />
          </View>
        ))}
      </View>
      <View style={styles.tags}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width={60} height={24} radius={12} style={{ marginRight: 6 }} />
        ))}
      </View>
    </View>
  )
}

export function SkeletonCampaignCard() {
  return (
    <View style={styles.campaignCard}>
      <View style={styles.cardHeader}>
        <Skeleton width={40} height={40} radius={8} />
        <View style={styles.cardHeaderText}>
          <Skeleton height={14} width="70%" style={{ marginBottom: 6 }} />
          <Skeleton height={11} width="50%" />
        </View>
        <Skeleton width={60} height={22} radius={11} />
      </View>
      <Skeleton height={12} width="90%" style={{ marginBottom: 6, marginTop: 12 }} />
      <Skeleton height={12} width="75%" style={{ marginBottom: 12 }} />
      <View style={styles.stats}>
        {[1, 2].map((i) => (
          <Skeleton key={i} width={80} height={32} radius={8} style={{ marginRight: 8 }} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  creatorCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
  },
})
