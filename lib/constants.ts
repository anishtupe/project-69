// ============================================================
// Influde AI — App Constants
// ============================================================

export const NICHES = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Food',
  'Travel',
  'Technology',
  'Gaming',
  'Lifestyle',
  'Finance',
  'Education',
  'Entertainment',
  'Music',
  'Sports',
  'Health & Wellness',
  'Parenting',
  'Business',
  'Photography',
  'Art & Design',
  'Automotive',
  'Home & Decor',
  'Sustainability',
  'Pet Care',
  'Comedy',
  'Personal Development',
]

export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
] as const

export const INDUSTRIES = [
  'E-commerce',
  'Fashion & Apparel',
  'Beauty & Personal Care',
  'Food & Beverage',
  'Technology',
  'Health & Wellness',
  'Travel & Hospitality',
  'Finance & Fintech',
  'Entertainment & Media',
  'Automotive',
  'Education & EdTech',
  'Real Estate',
  'Sports & Fitness',
  'Home & Lifestyle',
  'Gaming',
  'Retail',
  'Sustainability & Environment',
  'Non-profit',
  'Other',
]

export const OBJECTIVES = [
  { value: 'awareness', label: 'Brand Awareness', description: 'Increase visibility and reach' },
  { value: 'conversions', label: 'Drive Conversions', description: 'Generate sales and sign-ups' },
  { value: 'ugc', label: 'User-Generated Content', description: 'Get authentic creator content' },
  { value: 'event', label: 'Event Promotion', description: 'Promote a launch or event' },
] as const

export const DELIVERABLE_TYPES = [
  { value: 'reel', label: 'Instagram Reel', platform: 'instagram' },
  { value: 'story', label: 'Instagram Story', platform: 'instagram' },
  { value: 'post', label: 'Instagram Post', platform: 'instagram' },
  { value: 'youtube_video', label: 'YouTube Video', platform: 'youtube' },
  { value: 'tiktok', label: 'TikTok Video', platform: 'tiktok' },
  { value: 'tweet', label: 'Twitter/X Post', platform: 'twitter' },
] as const

export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Urdu',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Japanese',
  'Korean',
  'Mandarin',
  'Arabic',
]

export const LOCATIONS = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'New York',
  'Los Angeles',
  'London',
  'Dubai',
  'Singapore',
  'Toronto',
  'Sydney',
  'Paris',
  'Tokyo',
  'Seoul',
]

export const FOLLOWER_RANGES = [
  { label: 'Nano (1K–10K)', min: 1000, max: 10000 },
  { label: 'Micro (10K–100K)', min: 10000, max: 100000 },
  { label: 'Mid (100K–500K)', min: 100000, max: 500000 },
  { label: 'Macro (500K–1M)', min: 500000, max: 1000000 },
  { label: 'Mega (1M+)', min: 1000000, max: null },
]

export const GENDER_OPTIONS = [
  { value: 'all', label: 'All Genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-Binary' },
]

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  review: 'In Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  negotiating: 'Negotiating',
  hired: 'Hired',
  rejected: 'Rejected',
}

export const TAB_BAR_HEIGHT = 80
export const HEADER_HEIGHT = 56
export const BOTTOM_INSET = 34

export const SUPABASE_STORAGE_BUCKET = 'avatars'
