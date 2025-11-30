import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Bidang, BidangInsert, BidangUpdate, BidangComplete } from '@/types/database.types';
import type { GeoJSONFeature } from '@/types/database.types';

// ============================================================================
// Query Keys
// ============================================================================
export const bidangKeys = {
  all: ['bidang'] as const,
  lists: () => [...bidangKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...bidangKeys.lists(), filters] as const,
  details: () => [...bidangKeys.all, 'detail'] as const,
  detail: (id: number) => [...bidangKeys.details(), id] as const,
  byTanah: (tanahId: number) => [...bidangKeys.all, 'by-tanah', tanahId] as const,
  inBounds: (bounds: any) => [...bidangKeys.all, 'in-bounds', bounds] as const,
  complete: () => [...bidangKeys.all, 'complete'] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all bidang with complete data (using view)
 */
export function useBidangComplete(options?: {
  limit?: number;
  offset?: number;
  search?: string;
  statusHak?: string;
  penggunaan?: string;
}) {
  const supabase = createClient();

  return useQuery({
    queryKey: bidangKeys.list(options || {}),
    queryFn: async () => {
      let query = supabase
        .from('v_bidang_complete')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Search by owner name or nomor urut
      if (options?.search) {
        query = query.or(
          `nama_lengkap.ilike.%${options.search}%,nomor_urut.ilike.%${options.search}%`
        );
      }

      // Filter by status hak
      if (options?.statusHak) {
        query = query.eq('status_hak', options.statusHak);
      }

      // Filter by penggunaan
      if (options?.penggunaan) {
        query = query.eq('penggunaan', options.penggunaan);
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

      return { data: data as BidangComplete[], count: count || 0 };
    },
  });
}

/**
 * Fetch bidang by ID
 */
export function useBidangById(id: number | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: bidangKeys.detail(id!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_bidang_complete')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;

      return data as BidangComplete;
    },
    enabled: !!id,
  });
}

/**
 * Fetch bidang by tanah ID
 */
export function useBidangByTanah(tanahId: number | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: bidangKeys.byTanah(tanahId!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_bidang_complete')
        .select('*')
        .eq('tanah_id', tanahId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as BidangComplete[];
    },
    enabled: !!tanahId,
  });
}

/**
 * Fetch bidang within map bounds (for map rendering)
 */
export function useBidangInBounds(bounds: {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
} | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: bidangKeys.inBounds(bounds),
    queryFn: async () => {
      if (!bounds) return [];

      const { data, error } = await supabase.rpc('get_bidang_in_bounds', {
        min_lng: bounds.minLng,
        min_lat: bounds.minLat,
        max_lng: bounds.maxLng,
        max_lat: bounds.maxLat,
      });

      if (error) throw error;

      return data as any[];
    },
    enabled: !!bounds,
  });
}

/**
 * Create new bidang with geometry
 */
export function useCreateBidang() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (newBidang: {
      tanah_id: number;
      geometry: GeoJSONFeature;
      status_hak?: string;
      penggunaan?: string;
      keterangan?: string;
    }) => {
      // Convert GeoJSON to PostGIS format
      const geometryWKT = `SRID=4326;${geoJSONToWKT(newBidang.geometry.geometry)}`;

      const { data, error } = await supabase
        .from('bidang')
        .insert({
          tanah_id: newBidang.tanah_id,
          geometry: geometryWKT,
          luas_m2: 0, // Will be auto-calculated by trigger
          status_hak: newBidang.status_hak,
          penggunaan: newBidang.penggunaan,
          keterangan: newBidang.keterangan,
        })
        .select()
        .single();

      if (error) throw error;

      return data as Bidang;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bidangKeys.all });
      queryClient.invalidateQueries({ queryKey: bidangKeys.byTanah(data.tanah_id) });
    },
  });
}

/**
 * Update bidang
 */
export function useUpdateBidang() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, updates }: {
      id: number;
      updates: {
        geometry?: GeoJSONFeature;
        status_hak?: string;
        penggunaan?: string;
        keterangan?: string;
      };
    }) => {
      const updateData: any = { ...updates };

      // Convert GeoJSON to PostGIS if geometry updated
      if (updates.geometry) {
        updateData.geometry = `SRID=4326;${geoJSONToWKT(updates.geometry.geometry)}`;
      }

      const { data, error } = await supabase
        .from('bidang')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data as Bidang;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bidangKeys.lists() });
      queryClient.setQueryData(bidangKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: bidangKeys.byTanah(data.tanah_id) });
    },
  });
}

/**
 * Soft delete bidang
 */
export function useDeleteBidang() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('bidang')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidangKeys.all });
    },
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert GeoJSON Polygon to WKT format for PostGIS
 */
function geoJSONToWKT(geometry: { type: string; coordinates: number[][][] }): string {
  if (geometry.type !== 'Polygon') {
    throw new Error('Only Polygon geometries are supported');
  }

  const rings = geometry.coordinates.map((ring) => {
    const points = ring.map((coord) => `${coord[0]} ${coord[1]}`).join(', ');
    return `(${points})`;
  }).join(', ');

  return `POLYGON(${rings})`;
}

/**
 * Parse WKT to GeoJSON (for display)
 */
export function wktToGeoJSON(wkt: string): GeoJSONFeature {
  // Simple WKT parser for POLYGON
  // In production, use a library like wellknown or terraformer
  const match = wkt.match(/POLYGON\(\((.*?)\)\)/);
  if (!match) {
    throw new Error('Invalid WKT format');
  }

  const coordsStr = match[1];
  const coordinates = coordsStr.split(',').map((point) => {
    const [lng, lat] = point.trim().split(' ').map(Number);
    return [lng, lat];
  });

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[...coordinates, coordinates[0]]], // Close the ring
    },
  };
}
