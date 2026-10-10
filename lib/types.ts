// ============================================================
// Influde AI — Database Types (Generated from Supabase Schema)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'creator' | 'brand'
export type CampaignStatus = 'draft' | 'active' | 'review' | 'completed' | 'cancelled'
export type CampaignObjective = 'awareness' | 'conversions' | 'ugc' | 'event'
export type ApplicationStatus = 'applied' | 'shortlisted' | 'negotiating' | 'hired' | 'rejected'
export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin'
export type DeliverableType = 'reel' | 'story' | 'post' | 'youtube_video' | 'tiktok' | 'tweet'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      creators: {
        Row: {
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
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          handle?: string
          name?: string
          avatar?: string | null
          bio?: string | null
          is_verified?: boolean
          niches?: string[]
          location?: string | null
          languages?: string[]
          profile_strength?: number
          total_followers?: number
          avg_engagement_rate?: number
          avg_reach?: number
          posts_per_week?: number
          total_earned?: number
          rate_reel?: number
          rate_story?: number
          rate_post?: number
          rate_youtube_video?: number
          rate_tiktok?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          handle?: string
          name?: string
          avatar?: string | null
          bio?: string | null
          is_verified?: boolean
          niches?: string[]
          location?: string | null
          languages?: string[]
          profile_strength?: number
          total_followers?: number
          avg_engagement_rate?: number
          avg_reach?: number
          posts_per_week?: number
          total_earned?: number
          rate_reel?: number
          rate_story?: number
          rate_post?: number
          rate_youtube_video?: number
          rate_tiktok?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      creator_platforms: {
        Row: {
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
        Insert: {
          id?: string
          creator_id: string
          platform: Platform
          handle?: string
          followers?: number
          engagement_rate?: number
          avg_reach?: number
          connected?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          platform?: Platform
          handle?: string
          followers?: number
          engagement_rate?: number
          avg_reach?: number
          connected?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_platforms_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      creator_audience: {
        Row: {
          id: string
          creator_id: string
          age_ranges: Json
          gender_split: Json
          top_cities: Json
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          age_ranges?: Json
          gender_split?: Json
          top_cities?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          age_ranges?: Json
          gender_split?: Json
          top_cities?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_audience_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: true
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      creator_posts: {
        Row: {
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
        Insert: {
          id?: string
          creator_id: string
          platform: Platform
          thumbnail?: string | null
          post_type?: string | null
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          reach?: number
          engagement_rate?: number
          posted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          platform?: Platform
          thumbnail?: string | null
          post_type?: string | null
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          reach?: number
          engagement_rate?: number
          posted_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      creator_past_campaigns: {
        Row: {
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
        Insert: {
          id?: string
          creator_id: string
          brand_name: string
          brand_logo?: string | null
          campaign_name: string
          deliverables?: string | null
          completed_at?: string | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          brand_name?: string
          brand_logo?: string | null
          campaign_name?: string
          deliverables?: string | null
          completed_at?: string | null
          rating?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_past_campaigns_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      brands: {
        Row: {
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
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          logo?: string | null
          industry?: string | null
          website?: string | null
          description?: string | null
          total_campaigns?: number
          total_spend?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          logo?: string | null
          industry?: string | null
          website?: string | null
          description?: string | null
          total_campaigns?: number
          total_spend?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
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
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          objective?: CampaignObjective | null
          status?: CampaignStatus
          platforms?: Platform[]
          niches?: string[]
          budget_min?: number | null
          budget_max?: number | null
          target_age_min?: number | null
          target_age_max?: number | null
          target_gender?: string
          target_locations?: string[]
          target_languages?: string[]
          start_date?: string | null
          end_date?: string | null
          brief?: string | null
          dos?: string[]
          donts?: string[]
          applicant_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          objective?: CampaignObjective | null
          status?: CampaignStatus
          platforms?: Platform[]
          niches?: string[]
          budget_min?: number | null
          budget_max?: number | null
          target_age_min?: number | null
          target_age_max?: number | null
          target_gender?: string
          target_locations?: string[]
          target_languages?: string[]
          start_date?: string | null
          end_date?: string | null
          brief?: string | null
          dos?: string[]
          donts?: string[]
          applicant_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_deliverables: {
        Row: {
          id: string
          campaign_id: string
          type: DeliverableType
          quantity: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          type: DeliverableType
          quantity?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          type?: DeliverableType
          quantity?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_deliverables_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
      }
      applications: {
        Row: {
          id: string
          campaign_id: string
          creator_id: string
          pitch: string | null
          proposed_rate: number | null
          portfolio_links: string[]
          status: ApplicationStatus
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          creator_id: string
          pitch?: string | null
          proposed_rate?: number | null
          portfolio_links?: string[]
          status?: ApplicationStatus
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          creator_id?: string
          pitch?: string | null
          proposed_rate?: number | null
          portfolio_links?: string[]
          status?: ApplicationStatus
          applied_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_creators: {
        Row: {
          id: string
          brand_id: string
          creator_id: string
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          creator_id: string
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          creator_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_creators_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          brand_id: string
          creator_id: string
          campaign_id: string | null
          last_message: string | null
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          creator_id: string
          campaign_id?: string | null
          last_message?: string | null
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          creator_id?: string
          campaign_id?: string | null
          last_message?: string | null
          last_message_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_role: UserRole
          content: string
          read: boolean
          sent_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_role: UserRole
          content: string
          read?: boolean
          sent_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          sender_role?: UserRole
          content?: string
          read?: boolean
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}

// ── Application Domain Interfaces (matching DB schema rows + joined relations) ─

export interface Profile {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at?: string
}

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
  updated_at?: string
  // joined
  creator_platforms?: CreatorPlatform[]
  creator_audience?: CreatorAudience | null
  creator_posts?: CreatorPost[]
  creator_past_campaigns?: CreatorPastCampaign[]
}

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

export interface AgeRange {
  label: string
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
  updated_at?: string
}

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
  updated_at?: string
  // joined
  brands?: Brand
  campaign_deliverables?: CampaignDeliverable[]
}

export interface CampaignDeliverable {
  id: string
  campaign_id: string
  type: DeliverableType
  quantity: number
  notes: string | null
  created_at: string
}

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

export interface SavedCreator {
  id: string
  brand_id: string
  creator_id: string
  created_at: string
  creators?: Creator
}

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
  rate_reel?: number
  rate_story?: number
  rate_post?: number
  rate_youtube_video?: number
  rate_tiktok?: number
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
