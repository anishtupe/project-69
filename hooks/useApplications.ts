import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Application } from '../lib/types'

const APPLICATION_SELECT = `*, campaigns(*, brands(*)), creators(*)`

export function useApplications(creatorId?: string | null, campaignId?: string | null) {
  return useQuery<Application[]>({
    queryKey: ['applications', creatorId, campaignId],
    queryFn: async (): Promise<Application[]> => {
      let query = supabase
        .from('applications')
        .select(APPLICATION_SELECT)
        .order('applied_at', { ascending: false })

      if (creatorId) query = query.eq('creator_id', creatorId)
      if (campaignId) query = query.eq('campaign_id', campaignId)

      const { data, error } = await query
      if (error) throw error
      return (data as unknown as Application[]) || []
    },
    enabled: !!(creatorId || campaignId),
  })
}

export function useApplication(id: string | null) {
  return useQuery<Application | null>({
    queryKey: ['application', id],
    queryFn: async (): Promise<Application | null> => {
      const { data, error } = await supabase
        .from('applications')
        .select(APPLICATION_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return (data as unknown as Application) ?? null
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
      return data as unknown as Application
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
      return data as unknown as Application
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

// Check if a creator has already applied to a campaign
export function useHasApplied(campaignId: string | null, creatorId: string | null) {
  return useQuery<{ id: string; status: string } | null>({
    queryKey: ['has-applied', campaignId, creatorId],
    queryFn: async (): Promise<{ id: string; status: string } | null> => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, status')
        .eq('campaign_id', campaignId!)
        .eq('creator_id', creatorId!)
        .maybeSingle()
      if (error) throw error
      return data as { id: string; status: string } | null
    },
    enabled: !!campaignId && !!creatorId,
  })
}
