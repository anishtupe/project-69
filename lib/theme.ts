// ============================================================
// Influde AI — Design System Tokens
// ============================================================

export const Colors = {
  // Background
  bg: '#080808',
  surface: '#111111',
  surfaceElevated: '#191919',
  surfaceHighlight: '#202020',

  // Borders
  border: 'rgba(255,255,255,0.07)',
  borderBright: 'rgba(255,255,255,0.15)',
  borderFocus: 'rgba(255,255,255,0.30)',

  // Primary
  primary: '#1D9E75',
  primaryLight: '#24c490',
  primaryDark: '#15784f',
  primaryMuted: 'rgba(29,158,117,0.15)',

  // Accents
  purple: '#a78bfa',
  purpleMuted: 'rgba(167,139,250,0.15)',
  coral: '#ff6b6b',
  coralMuted: 'rgba(255,107,107,0.15)',
  amber: '#fbbf24',
  amberMuted: 'rgba(251,191,36,0.15)',

  // Text
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  textDisabled: '#525252',

  // White overlays
  white10: 'rgba(255,255,255,0.10)',
  white20: 'rgba(255,255,255,0.20)',
  white05: 'rgba(255,255,255,0.05)',

  // Status
  statusActive: '#1D9E75',
  statusReview: '#fbbf24',
  statusCompleted: '#a78bfa',
  statusRejected: '#ff6b6b',
  statusDraft: '#737373',
  statusCancelled: '#ff6b6b',
  statusApplied: '#60a5fa',
  statusShortlisted: '#1D9E75',
  statusNegotiating: '#fbbf24',
  statusHired: '#a78bfa',

  // Platforms
  instagram: '#E1306C',
  youtube: '#FF0000',
  tiktok: '#69C9D0',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
} as const

export const Typography = {
  // Display — Syne Bold
  displayXL: { fontFamily: 'Syne_700Bold', fontSize: 36, lineHeight: 42 },
  displayLG: { fontFamily: 'Syne_700Bold', fontSize: 28, lineHeight: 34 },
  displayMD: { fontFamily: 'Syne_700Bold', fontSize: 22, lineHeight: 28 },
  displaySM: { fontFamily: 'Syne_700Bold', fontSize: 18, lineHeight: 24 },

  // Heading — Syne Bold
  h1: { fontFamily: 'Syne_700Bold', fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: 'Syne_700Bold', fontSize: 20, lineHeight: 26 },
  h3: { fontFamily: 'Syne_700Bold', fontSize: 17, lineHeight: 22 },
  h4: { fontFamily: 'Syne_700Bold', fontSize: 15, lineHeight: 20 },

  // Body — DM Sans Regular
  bodyLG: { fontFamily: 'DMSans_400Regular', fontSize: 16, lineHeight: 24 },
  bodyMD: { fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 21 },
  bodySM: { fontFamily: 'DMSans_400Regular', fontSize: 12, lineHeight: 18 },
  bodyXS: { fontFamily: 'DMSans_400Regular', fontSize: 11, lineHeight: 16 },

  // Label/Button — Syne Bold
  labelLG: { fontFamily: 'Syne_700Bold', fontSize: 14, lineHeight: 20 },
  labelMD: { fontFamily: 'Syne_700Bold', fontSize: 12, lineHeight: 16 },
  labelSM: { fontFamily: 'Syne_700Bold', fontSize: 11, lineHeight: 14 },

  // Mono for numbers
  numericLG: { fontFamily: 'Syne_700Bold', fontSize: 28, lineHeight: 34 },
  numericMD: { fontFamily: 'Syne_700Bold', fontSize: 20, lineHeight: 26 },
  numericSM: { fontFamily: 'Syne_700Bold', fontSize: 16, lineHeight: 20 },
} as const

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
} as const

export const StatusColors: Record<string, string> = {
  active: Colors.statusActive,
  review: Colors.statusReview,
  completed: Colors.statusCompleted,
  rejected: Colors.statusRejected,
  draft: Colors.statusDraft,
  cancelled: Colors.statusCancelled,
  applied: Colors.statusApplied,
  shortlisted: Colors.statusShortlisted,
  negotiating: Colors.statusNegotiating,
  hired: Colors.statusHired,
}

export const PlatformColors: Record<string, string> = {
  instagram: Colors.instagram,
  youtube: Colors.youtube,
  tiktok: Colors.tiktok,
  twitter: Colors.twitter,
  linkedin: Colors.linkedin,
}

export const PlatformIcons: Record<string, string> = {
  instagram: 'instagram',
  youtube: 'youtube',
  tiktok: 'music-note',
  twitter: 'twitter',
  linkedin: 'linkedin',
}
