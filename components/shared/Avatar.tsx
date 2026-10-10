import React from 'react'
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Typography, Radius } from '../../lib/theme'
import { getInitials } from '../../lib/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 72,
  xxl: 96,
}

interface AvatarProps {
  uri?: string | null
  name?: string
  size?: AvatarSize
  style?: ViewStyle
  verified?: boolean
}

export default function Avatar({ uri, name = '', size = 'md', style, verified = false }: AvatarProps) {
  const dim = SIZE_MAP[size]
  const initials = getInitials(name || '?')
  const fontSize = dim * 0.35

  return (
    <View style={[style]}>
      <View
        style={[
          styles.container,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
          />
        ) : (
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        )}
      </View>

      {verified && (
        <View style={[styles.verifiedBadge, { bottom: 0, right: 0 }]}>
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    ...Typography.labelLG,
    color: Colors.textSecondary,
  },
  verifiedBadge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  verifiedIcon: {
    fontSize: 9,
    color: Colors.bg,
    fontWeight: 'bold',
  },
})
