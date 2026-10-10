import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const APPLICATION_SELECT = `*, campaigns(*, brands(*)), creators(*)`

export function useApplications(creatorId?: string | null, campaignId?: string | null) {
  return useQuery({
    queryKey: ['applications', creatorId, campaignId],
    queryFn: async () => {
      let query = supabase
        .from('applications')
        .select(APPLICATION_SELECT)
        .order('applied_at', { ascending: false })

      if (creatorId) query = query.eq('creator_id', creatorId)
      if (campaignId) query = query.eq('campaign_id', campaignId)

      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!(creatorId || campaignId),
  })
}

export function useApplication(id: string | null) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(APPLICATION_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (application: {
      campaign_id: string
      creator_id: string
      pitch?: string
      proposed_rate?: number
      portfolio_links?: string[]
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .insert(application)
        .select(APPLICATION_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', data.campaign_id] })
    },
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(APPLICATION_SELECT)
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

// Check if a creator has already applied to a campaign
export function useHasApplied(campaignId: string | null, creatorId: string | null) {
  return useQuery({
    queryKey: ['has-applied', campaignId, creatorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, status')
        .eq('campaign_id', campaignId!)
        .eq('creator_id', creatorId!)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!campaignId && !!creatorId,
  })
}
