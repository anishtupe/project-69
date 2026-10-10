// ============================================================
// Influde AI — Utility Functions
// ============================================================

import { StatusColors, PlatformColors } from './theme'

// ── Number / Follower Formatters ──────────────────────────────

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`
  }
  return count.toString()
}

export function formatCurrency(amount: number, currency = '₹'): string {
  if (amount >= 100_000) {
    return `${currency}${(amount / 100_000).toFixed(1)}L`
  }
  if (amount >= 1_000) {
    return `${currency}${(amount / 1_000).toFixed(1)}K`
  }
  return `${currency}${amount.toFixed(0)}`
}

export function formatEngagement(rate: number): string {
  return `${rate.toFixed(1)}%`
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

// ── Date Formatters ───────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(dateStr)
}

export function formatTimeOnly(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// ── Color Helpers ─────────────────────────────────────────────

export function getStatusColor(status: string): string {
  return StatusColors[status] ?? '#737373'
}

export function getPlatformColor(platform: string): string {
  return PlatformColors[platform] ?? '#737373'
}

// ── String Helpers ────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural ?? singular + 's'}`
}

// ── Validation Helpers ────────────────────────────────────────

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidHandle(handle: string): boolean {
  return /^[a-zA-Z0-9._]{3,30}$/.test(handle)
}

// ── Array Helpers ─────────────────────────────────────────────

export function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}

export function uniqueArray<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

// ── Profile Strength Calculator ───────────────────────────────

export function calculateProfileStrength(creator: {
  bio?: string | null
  avatar?: string | null
  niches?: string[]
  location?: string | null
  creator_platforms?: { connected: boolean }[]
  rate_reel?: number
}): number {
  let score = 0
  if (creator.bio) score += 20
  if (creator.avatar) score += 20
  if (creator.niches && creator.niches.length > 0) score += 20
  if (creator.location) score += 10
  if (creator.creator_platforms?.some((p) => p.connected)) score += 20
  if (creator.rate_reel && creator.rate_reel > 0) score += 10
  return score
}

// ── Budget Display ────────────────────────────────────────────

export function formatBudgetRange(min: number | null, max: number | null): string {
  if (!min && !max) return 'Negotiable'
  if (!min) return `Up to ${formatCurrency(max!)}`
  if (!max) return `From ${formatCurrency(min)}`
  return `${formatCurrency(min)} – ${formatCurrency(max)}`
}
