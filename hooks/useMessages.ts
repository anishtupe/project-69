import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Conversation, Message } from '../lib/types'

export function useConversations(brandId?: string | null, creatorId?: string | null) {
  return useQuery<Conversation[]>({
    queryKey: ['conversations', brandId, creatorId],
    queryFn: async (): Promise<Conversation[]> => {
      let query = supabase
        .from('conversations')
        .select(`*, brands(*), creators(*)`)
        .order('last_message_at', { ascending: false })

      if (brandId) query = query.eq('brand_id', brandId)
      if (creatorId) query = query.eq('creator_id', creatorId)

      const { data, error } = await query
      if (error) throw error
      return (data as unknown as Conversation[]) || []
    },
    enabled: !!(brandId || creatorId),
  })
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId, queryClient])

  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId!)
        .order('sent_at', { ascending: true })
      if (error) throw error
      return (data as unknown as Message[]) || []
    },
    enabled: !!conversationId,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (message: {
      conversation_id: string
      sender_id: string
      sender_role: 'brand' | 'creator'
      content: string
    }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()
      if (error) throw error
      return data as unknown as Message
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.conversation_id],
      })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      brandId,
      creatorId,
      campaignId,
    }: {
      brandId: string
      creatorId: string
      campaignId?: string
    }) => {
      // Try to get existing conversation first
      let query = supabase
        .from('conversations')
        .select('*')
        .eq('brand_id', brandId)
        .eq('creator_id', creatorId)

      if (campaignId) {
        query = query.eq('campaign_id', campaignId)
      }

      const { data: existing } = await query.maybeSingle()
      if (existing) return existing as unknown as Conversation

      // Create new
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          brand_id: brandId,
          creator_id: creatorId,
          campaign_id: campaignId ?? null,
        })
        .select()
        .single()

      if (error) throw error
      return data as unknown as Conversation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useMarkMessagesRead(conversationId: string | null, userId: string | null) {
  return useMutation({
    mutationFn: async () => {
      if (!conversationId || !userId) return
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('read', false)
      if (error) throw error
    },
  })
}
