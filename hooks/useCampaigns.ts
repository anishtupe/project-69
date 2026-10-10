import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Campaign, CampaignFilters, Brand } from '../lib/types'

const CAMPAIGN_SELECT = `*, brands(*), campaign_deliverables(*)`

export function useCampaigns(filters?: CampaignFilters) {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns', filters],
    queryFn: async (): Promise<Campaign[]> => {
      let query = supabase
        .from('campaigns')
        .select(CAMPAIGN_SELECT)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.platforms?.length) {
        query = query.overlaps('platforms', filters.platforms)
      }
      if (filters?.niches?.length) {
        query = query.overlaps('niches', filters.niches)
      }
      if (filters?.budgetMin != null) {
        query = query.gte('budget_max', filters.budgetMin)
      }
      if (filters?.budgetMax != null) {
        query = query.lte('budget_min', filters.budgetMax)
      }

      const { data, error } = await query
      if (error) throw error
      return (data as unknown as Campaign[]) || []
    },
  })
}

export function useBrandCampaigns(brandId: string | null, status?: string) {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns', 'brand', brandId, status],
    queryFn: async (): Promise<Campaign[]> => {
      let query = supabase
        .from('campaigns')
        .select(CAMPAIGN_SELECT)
        .eq('brand_id', brandId!)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return (data as unknown as Campaign[]) || []
    },
    enabled: !!brandId,
  })
}

export function useCampaign(id: string | null) {
  return useQuery<Campaign | null>({
    queryKey: ['campaign', id],
    queryFn: async (): Promise<Campaign | null> => {
      const { data, error } = await supabase
        .from('campaigns')
        .select(CAMPAIGN_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return (data as unknown as Campaign) ?? null
    },
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      campaign,
      deliverables,
    }: {
      campaign: Record<string, unknown>
      deliverables: { type: string; quantity: number; notes?: string }[]
    }) => {
      const { data: newCampaign, error } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single()
      if (error) throw error

      if (deliverables.length > 0) {
        const { error: delivError } = await supabase.from('campaign_deliverables').insert(
          deliverables.map((d) => ({
            campaign_id: (newCampaign as any).id,
            type: d.type,
            quantity: d.quantity,
            notes: d.notes ?? null,
          }))
        )
        if (delivError) throw delivError
      }

      return newCampaign as unknown as Campaign
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select(CAMPAIGN_SELECT)
        .single()
      if (error) throw error
      return data as unknown as Campaign
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaigns').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useBrandByUserId(userId: string | null) {
  return useQuery<Brand | null>({
    queryKey: ['brand', 'user', userId],
    queryFn: async (): Promise<Brand | null> => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', userId!)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return (data as unknown as Brand) ?? null
    },
    enabled: !!userId,
  })
}
