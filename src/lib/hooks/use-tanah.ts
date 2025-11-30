import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Tanah, TanahInsert, TanahUpdate } from '@/types/database.types';

// ============================================================================
// Query Keys
// ============================================================================
export const tanahKeys = {
  all: ['tanah'] as const,
  lists: () => [...tanahKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tanahKeys.lists(), filters] as const,
  details: () => [...tanahKeys.all, 'detail'] as const,
  detail: (id: number) => [...tanahKeys.details(), id] as const,
  byWarga: (wargaId: number) => [...tanahKeys.all, 'by-warga', wargaId] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all tanah with optional filtering
 */
export function useTanah(options?: {
  search?: string;
  wargaId?: number;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: tanahKeys.list(options || {}),
    queryFn: async () => {
      let query = supabase
        .from('tanah')
        .select('*, warga:warga_id(*)', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Filter by owner
      if (options?.wargaId) {
        query = query.eq('warga_id', options.wargaId);
      }

      // Search by nomor_urut
      if (options?.search) {
        query = query.ilike('nomor_urut', `%${options.search}%`);
      }

      // Pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as any[], count: count || 0 };
    },
  });
}

/**
 * Fetch single tanah by ID with full details
 */
export function useTanahById(id: number | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: tanahKeys.detail(id!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tanah')
        .select(`
          *,
          warga:warga_id(*),
          bidang(*)
        `)
        .eq('id', id!)
        .single();

      if (error) throw error;

      return data;
    },
    enabled: !!id,
  });
}

/**
 * Fetch tanah by warga ID
 */
export function useTanahByWarga(wargaId: number | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: tanahKeys.byWarga(wargaId!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tanah')
        .select('*, bidang(count)')
        .eq('warga_id', wargaId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as any[];
    },
    enabled: !!wargaId,
  });
}

/**
 * Create new tanah
 */
export function useCreateTanah() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (newTanah: TanahInsert) => {
      const { data, error } = await supabase
        .from('tanah')
        .insert(newTanah)
        .select()
        .single();

      if (error) throw error;

      return data as Tanah;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tanahKeys.all });

      // Invalidate warga's tanah list if has owner
      if (data.warga_id) {
        queryClient.invalidateQueries({
          queryKey: tanahKeys.byWarga(data.warga_id)
        });
      }
    },
  });
}

/**
 * Update existing tanah
 */
export function useUpdateTanah() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: TanahUpdate }) => {
      const { data, error } = await supabase
        .from('tanah')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Tanah;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tanahKeys.lists() });
      queryClient.setQueryData(tanahKeys.detail(data.id), data);

      if (data.warga_id) {
        queryClient.invalidateQueries({
          queryKey: tanahKeys.byWarga(data.warga_id)
        });
      }
    },
  });
}

/**
 * Delete tanah (cascades to bidang)
 */
export function useDeleteTanah() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('tanah')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tanahKeys.all });
    },
  });
}
