import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Creator, CreatorFilters, SavedCreator } from '../lib/types'

const CREATOR_SELECT = `
  *,
  creator_platforms(*),
  creator_audience(*),
  creator_posts(*),
  creator_past_campaigns(*)
`

export function useCreators(filters?: CreatorFilters) {
  return useQuery<Creator[]>({
    queryKey: ['creators', filters],
    queryFn: async (): Promise<Creator[]> => {
      let query = supabase.from('creators').select(CREATOR_SELECT)

      if (filters?.niches?.length) {
        query = query.overlaps('niches', filters.niches)
      }
      if (filters?.followerMin != null) {
        query = query.gte('total_followers', filters.followerMin)
      }
      if (filters?.followerMax != null) {
        query = query.lte('total_followers', filters.followerMax)
      }
      if (filters?.engagementMin != null) {
        query = query.gte('avg_engagement_rate', filters.engagementMin)
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,handle.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query.order('total_followers', { ascending: false })
      if (error) throw error
      return (data as unknown as Creator[]) || []
    },
  })
}

export function useCreator(handle: string) {
  return useQuery<Creator | null>({
    queryKey: ['creator', handle],
    queryFn: async (): Promise<Creator | null> => {
      const { data, error } = await supabase
        .from('creators')
        .select(CREATOR_SELECT)
        .eq('handle', handle)
        .single()
      if (error) throw error
      return (data as unknown as Creator) ?? null
    },
    enabled: !!handle,
  })
}

export function useCreatorByUserId(userId: string | null) {
  return useQuery<Creator | null>({
    queryKey: ['creator', 'user', userId],
    queryFn: async (): Promise<Creator | null> => {
      const { data, error } = await supabase
        .from('creators')
        .select(CREATOR_SELECT)
        .eq('user_id', userId!)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return (data as unknown as Creator) ?? null
    },
    enabled: !!userId,
  })
}

export function useUpdateCreator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('creators')
        .update(updates)
        .eq('id', id)
        .select(CREATOR_SELECT)
        .single()
      if (error) throw error
      return data as unknown as Creator
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator'] })
      queryClient.invalidateQueries({ queryKey: ['creators'] })
    },
  })
}

export function useSaveCreator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ brandId, creatorId }: { brandId: string; creatorId: string }) => {
      const { data, error } = await supabase
        .from('saved_creators')
        .insert({ brand_id: brandId, creator_id: creatorId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-creators'] })
    },
  })
}

export function useUnsaveCreator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ brandId, creatorId }: { brandId: string; creatorId: string }) => {
      const { error } = await supabase
        .from('saved_creators')
        .delete()
        .eq('brand_id', brandId)
        .eq('creator_id', creatorId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-creators'] })
    },
  })
}

export function useSavedCreators(brandId: string | null) {
  return useQuery<SavedCreator[]>({
    queryKey: ['saved-creators', brandId],
    queryFn: async (): Promise<SavedCreator[]> => {
      const { data, error } = await supabase
        .from('saved_creators')
        .select(`*, creators(${CREATOR_SELECT})`)
        .eq('brand_id', brandId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data as unknown as SavedCreator[]) || []
    },
    enabled: !!brandId,
  })
}
