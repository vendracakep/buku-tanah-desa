// Generated TypeScript types for Supabase database
// Based on the migration schema in supabase/migration.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      warga: {
        Row: {
          id: number
          nik: string | null
          nama_lengkap: string
          jenis_kelamin: 'Laki-laki' | 'Perempuan' | null
          status_perkawinan: 'BELUM KAWIN' | 'KAWIN' | 'CERAI HIDUP' | 'CERAI MATI' | null
          tempat_lahir: string | null
          tanggal_lahir: string | null // Date as ISO string
          agama: string | null
          pendidikan_terakhir: string | null
          pekerjaan: string | null
          foto_ktp_url: string | null
          kewarganegaraan: 'WNI' | 'WNA'
          alamat_lengkap: string | null
          keterangan: string | null
          created_at: string // Timestamp as ISO string
          updated_at: string
        }
        Insert: {
          id?: number
          nik?: string | null
          nama_lengkap: string
          jenis_kelamin?: 'Laki-laki' | 'Perempuan' | null
          status_perkawinan?: 'BELUM KAWIN' | 'KAWIN' | 'CERAI HIDUP' | 'CERAI MATI' | null
          tempat_lahir?: string | null
          tanggal_lahir?: string | null
          agama?: string | null
          pendidikan_terakhir?: string | null
          pekerjaan?: string | null
          foto_ktp_url?: string | null
          kewarganegaraan?: 'WNI' | 'WNA'
          alamat_lengkap?: string | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nik?: string | null
          nama_lengkap?: string
          jenis_kelamin?: 'Laki-laki' | 'Perempuan' | null
          status_perkawinan?: 'BELUM KAWIN' | 'KAWIN' | 'CERAI HIDUP' | 'CERAI MATI' | null
          tempat_lahir?: string | null
          tanggal_lahir?: string | null
          agama?: string | null
          pendidikan_terakhir?: string | null
          pekerjaan?: string | null
          foto_ktp_url?: string | null
          kewarganegaraan?: 'WNI' | 'WNA'
          alamat_lengkap?: string | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tanah: {
        Row: {
          id: number
          nomor_urut: string
          warga_id: number | null
          jumlah_m2: number | null
          keterangan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nomor_urut: string
          warga_id?: number | null
          jumlah_m2?: number | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nomor_urut?: string
          warga_id?: number | null
          jumlah_m2?: number | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bidang: {
        Row: {
          id: number
          tanah_id: number
          geometry: unknown // PostGIS geometry type
          luas_m2: number
          status_hak: 'HM' | 'HGB' | 'HP' | 'HGU' | 'HPL' | 'MA' | 'VI' | 'TN' | null
          penggunaan: PenggunaanType | null
          keterangan: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: number
          tanah_id: number
          geometry: unknown
          luas_m2: number
          status_hak?: 'HM' | 'HGB' | 'HP' | 'HGU' | 'HPL' | 'MA' | 'VI' | 'TN' | null
          penggunaan?: PenggunaanType | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: number
          tanah_id?: number
          geometry?: unknown
          luas_m2?: number
          status_hak?: 'HM' | 'HGB' | 'HP' | 'HGU' | 'HPL' | 'MA' | 'VI' | 'TN' | null
          penggunaan?: PenggunaanType | null
          keterangan?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      approval_requests: {
        Row: {
          id: number
          module: 'tanah' | 'warga' | 'bidang'
          action: 'create' | 'update' | 'delete'
          target_id: number | null
          payload: Json
          submitted_by: string // UUID
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null // UUID
          reviewed_at: string | null
          review_note: string | null
          applied_at: string | null
          apply_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          module: 'tanah' | 'warga' | 'bidang'
          action: 'create' | 'update' | 'delete'
          target_id?: number | null
          payload: Json
          submitted_by: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_note?: string | null
          applied_at?: string | null
          apply_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          module?: 'tanah' | 'warga' | 'bidang'
          action?: 'create' | 'update' | 'delete'
          target_id?: number | null
          payload?: Json
          submitted_by?: string
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_note?: string | null
          applied_at?: string | null
          apply_error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      v_bidang_complete: {
        Row: {
          id: number
          tanah_id: number
          luas_m2: number
          status_hak: string | null
          penggunaan: string | null
          geometry_geojson: string
          centroid_lng: number
          centroid_lat: number
          bidang_keterangan: string | null
          created_at: string
          updated_at: string
          nomor_urut: string
          tanah_total_m2: number | null
          tanah_keterangan: string | null
          warga_id: number | null
          nik: string | null
          nama_lengkap: string | null
          alamat_lengkap: string | null
        }
      }
    }
    Functions: {
      get_bidang_in_bounds: {
        Args: {
          min_lng: number
          min_lat: number
          max_lng: number
          max_lat: number
        }
        Returns: Array<{
          id: number
          tanah_id: number
          geometry_geojson: string
          luas_m2: number
          status_hak: string | null
          penggunaan: string | null
        }>
      }
      find_overlapping_bidang: {
        Args: {
          target_geometry: unknown
          exclude_id?: number | null
        }
        Returns: Array<{
          id: number
          tanah_id: number
          overlap_area_m2: number
        }>
      }
    }
    Enums: {}
  }
}

// Type Aliases for convenience
export type Warga = Database['public']['Tables']['warga']['Row']
export type WargaInsert = Database['public']['Tables']['warga']['Insert']
export type WargaUpdate = Database['public']['Tables']['warga']['Update']

export type Tanah = Database['public']['Tables']['tanah']['Row']
export type TanahInsert = Database['public']['Tables']['tanah']['Insert']
export type TanahUpdate = Database['public']['Tables']['tanah']['Update']

export type Bidang = Database['public']['Tables']['bidang']['Row']
export type BidangInsert = Database['public']['Tables']['bidang']['Insert']
export type BidangUpdate = Database['public']['Tables']['bidang']['Update']

export type ApprovalRequest = Database['public']['Tables']['approval_requests']['Row']
export type ApprovalRequestInsert = Database['public']['Tables']['approval_requests']['Insert']
export type ApprovalRequestUpdate = Database['public']['Tables']['approval_requests']['Update']

export type BidangComplete = Database['public']['Views']['v_bidang_complete']['Row']

// Enum types
export type JenisKelamin = 'Laki-laki' | 'Perempuan'
export type StatusPerkawinan = 'BELUM KAWIN' | 'KAWIN' | 'CERAI HIDUP' | 'CERAI MATI'
export type Kewarganegaraan = 'WNI' | 'WNA'
export type StatusHak = 'HM' | 'HGB' | 'HP' | 'HGU' | 'HPL' | 'MA' | 'VI' | 'TN'
export type PenggunaanType =
  | 'PERUMAHAN'
  | 'PERDAGANGAN_JASA'
  | 'PERKANTORAN'
  | 'INDUSTRI'
  | 'FASILITAS_UMUM'
  | 'SAWAH'
  | 'TEGALAN'
  | 'PERKEBUNAN'
  | 'PETERNAKAN_PERIKANAN'
  | 'HUTAN_BELUKAR'
  | 'HUTAN_LINDUNG'
  | 'MUTASI_TANAH'
  | 'TANAH_KOSONG'
  | 'LAIN_LAIN'

export type ApprovalModule = 'tanah' | 'warga' | 'bidang'
export type ApprovalAction = 'create' | 'update' | 'delete'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

// User roles (from auth.users metadata)
export type UserRole = 'staff' | 'kepala'

// GeoJSON types for geometry
export interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface GeoJSONFeature {
  type: 'Feature'
  geometry: GeoJSONPolygon
  properties?: Record<string, any>
}
