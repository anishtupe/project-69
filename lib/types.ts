// ============================================================
// Influde AI — Database Types (mirrors Supabase schema)
// ============================================================

export type UserRole = 'creator' | 'brand'

export type CampaignStatus = 'draft' | 'active' | 'review' | 'completed' | 'cancelled'
export type CampaignObjective = 'awareness' | 'conversions' | 'ugc' | 'event'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'negotiating' | 'hired' | 'rejected'
export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin'
export type DeliverableType = 'reel' | 'story' | 'post' | 'youtube_video' | 'tiktok' | 'tweet'

// ── Profile ──────────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  role: UserRole
  created_at: string
}

// ── Creator ──────────────────────────────────────────────────
export interface Creator {
  id: string
  user_id: string
  handle: string
  name: string
  avatar: string | null
  bio: string | null
  is_verified: boolean
  niches: string[]
  location: string | null
  languages: string[]
  profile_strength: number
  total_followers: number
  avg_engagement_rate: number
  avg_reach: number
  posts_per_week: number
  total_earned: number
  rate_reel: number
  rate_story: number
  rate_post: number
  rate_youtube_video: number
  rate_tiktok: number
  created_at: string
  // joined
  creator_platforms?: CreatorPlatform[]
  creator_audience?: CreatorAudience | null
  creator_posts?: CreatorPost[]
  creator_past_campaigns?: CreatorPastCampaign[]
}

// ── Creator Platforms ─────────────────────────────────────────
export interface CreatorPlatform {
  id: string
  creator_id: string
  platform: Platform
  handle: string
  followers: number
  engagement_rate: number
  avg_reach: number
  connected: boolean
  created_at: string
}

// ── Audience Demographics ─────────────────────────────────────
export interface AgeRange {
  label: string // e.g. "18-24"
  percentage: number
}

export interface GenderSplit {
  male: number
  female: number
  other: number
}

export interface TopCity {
  city: string
  percentage: number
}

export interface CreatorAudience {
  id: string
  creator_id: string
  age_ranges: AgeRange[]
  gender_split: GenderSplit
  top_cities: TopCity[]
  updated_at: string
}

// ── Creator Posts ─────────────────────────────────────────────
export interface CreatorPost {
  id: string
  creator_id: string
  platform: Platform
  thumbnail: string | null
  post_type: string | null
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  engagement_rate: number
  posted_at: string | null
  created_at: string
}

// ── Past Brand Collaborations ─────────────────────────────────
export interface CreatorPastCampaign {
  id: string
  creator_id: string
  brand_name: string
  brand_logo: string | null
  campaign_name: string
  deliverables: string | null
  completed_at: string | null
  rating: number | null
  created_at: string
}

// ── Brand ─────────────────────────────────────────────────────
export interface Brand {
  id: string
  user_id: string
  name: string
  logo: string | null
  industry: string | null
  website: string | null
  description: string | null
  total_campaigns: number
  total_spend: number
  created_at: string
}

// ── Campaign ──────────────────────────────────────────────────
export interface Campaign {
  id: string
  brand_id: string
  name: string
  objective: CampaignObjective | null
  status: CampaignStatus
  platforms: Platform[]
  niches: string[]
  budget_min: number | null
  budget_max: number | null
  target_age_min: number | null
  target_age_max: number | null
  target_gender: string
  target_locations: string[]
  target_languages: string[]
  start_date: string | null
  end_date: string | null
  brief: string | null
  dos: string[]
  donts: string[]
  applicant_count: number
  created_at: string
  // joined
  brands?: Brand
  campaign_deliverables?: CampaignDeliverable[]
}

// ── Campaign Deliverables ─────────────────────────────────────
export interface CampaignDeliverable {
  id: string
  campaign_id: string
  type: DeliverableType
  quantity: number
  notes: string | null
  created_at: string
}

// ── Application ───────────────────────────────────────────────
export interface Application {
  id: string
  campaign_id: string
  creator_id: string
  pitch: string | null
  proposed_rate: number | null
  portfolio_links: string[]
  status: ApplicationStatus
  applied_at: string
  updated_at: string
  // joined
  campaigns?: Campaign
  creators?: Creator
}

// ── Saved Creators ────────────────────────────────────────────
export interface SavedCreator {
  id: string
  brand_id: string
  creator_id: string
  created_at: string
  creators?: Creator
}

// ── Conversation ──────────────────────────────────────────────
export interface Conversation {
  id: string
  brand_id: string
  creator_id: string
  campaign_id: string | null
  last_message: string | null
  last_message_at: string
  created_at: string
  brands?: Brand
  creators?: Creator
}

// ── Message ───────────────────────────────────────────────────
export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_role: UserRole
  content: string
  read: boolean
  sent_at: string
}

// ── Form Types ────────────────────────────────────────────────
export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

export interface LoginForm {
  email: string
  password: string
}

export interface CreatorSetupForm {
  handle: string
  name: string
  bio: string
  niches: string[]
  location: string
  languages: string[]
}

export interface BrandSetupForm {
  name: string
  industry: string
  website: string
  description: string
}

export interface CampaignCreateForm {
  name: string
  objective: CampaignObjective
  platforms: Platform[]
  niches: string[]
  budget_min: number
  budget_max: number
  target_age_min: number
  target_age_max: number
  target_gender: string
  target_locations: string[]
  start_date: string
  end_date: string
  brief: string
  dos: string[]
  donts: string[]
  deliverables: { type: DeliverableType; quantity: number; notes?: string }[]
}

export interface ApplicationForm {
  pitch: string
  proposed_rate: number
  portfolio_links: string[]
}

// ── Filter Types ──────────────────────────────────────────────
export interface CreatorFilters {
  niches?: string[]
  platforms?: Platform[]
  followerMin?: number
  followerMax?: number
  engagementMin?: number
  location?: string
  search?: string
}

export interface CampaignFilters {
  status?: CampaignStatus
  platforms?: Platform[]
  niches?: string[]
  budgetMin?: number
  budgetMax?: number
}
