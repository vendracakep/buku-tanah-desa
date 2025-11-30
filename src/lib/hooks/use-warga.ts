import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Warga, WargaInsert, WargaUpdate } from '@/types/database.types';

// ============================================================================
// Query Keys
// ============================================================================
export const wargaKeys = {
  all: ['warga'] as const,
  lists: () => [...wargaKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...wargaKeys.lists(), filters] as const,
  details: () => [...wargaKeys.all, 'detail'] as const,
  detail: (id: number) => [...wargaKeys.details(), id] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all warga with optional filtering and pagination
 */
export function useWarga(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: wargaKeys.list(options || {}),
    queryFn: async () => {
      let query = supabase
        .from('warga')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Search by name or NIK
      if (options?.search) {
        query = query.or(
          `nama_lengkap.ilike.%${options.search}%,nik.ilike.%${options.search}%`
        );
      }

      // Pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { data: data as Warga[], count: count || 0 };
    },
  });
}

/**
 * Fetch single warga by ID
 */
export function useWargaById(id: number | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: wargaKeys.detail(id!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warga')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;

      return data as Warga;
    },
    enabled: !!id,
  });
}

/**
 * Create new warga
 */
export function useCreateWarga() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (newWarga: WargaInsert) => {
      const { data, error } = await supabase
        .from('warga')
        .insert(newWarga)
        .select()
        .single();

      if (error) throw error;

      return data as Warga;
    },
    onSuccess: () => {
      // Invalidate all warga queries to refetch
      queryClient.invalidateQueries({ queryKey: wargaKeys.all });
    },
  });
}

/**
 * Update existing warga
 */
export function useUpdateWarga() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: WargaUpdate }) => {
      const { data, error } = await supabase
        .from('warga')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Warga;
    },
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: wargaKeys.lists() });
      // Update detail query cache
      queryClient.setQueryData(wargaKeys.detail(data.id), data);
    },
  });
}

/**
 * Delete warga (soft delete by setting to NULL references)
 */
export function useDeleteWarga() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('warga')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wargaKeys.all });
    },
  });
}

/**
 * Upload warga photo to Supabase Storage
 */
export function useUploadWargaPhoto() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ wargaId, file }: { wargaId: number; file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${wargaId}-${Date.now()}.${fileExt}`;
      const filePath = `ktp/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('warga-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('warga-photos')
        .getPublicUrl(filePath);

      return {
        path: uploadData.path,
        url: urlData.publicUrl,
      };
    },
  });
}
