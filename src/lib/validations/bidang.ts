import { z } from 'zod';

export const bidangSchema = z.object({
  tanah_id: z
    .number()
    .int()
    .positive('Pilih tanah yang akan dibagi'),

  geometry: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.array(z.number()))),
  }, {
    errorMap: () => ({ message: 'Geometri polygon tidak valid' }),
  }),

  luas_m2: z
    .number()
    .positive('Luas harus lebih dari 0')
    .max(1000000, 'Luas maksimal 1.000.000 m²'),

  status_hak: z.enum(['HM', 'HGB', 'HP', 'HGU', 'HPL', 'MA', 'VI', 'TN'], {
    errorMap: () => ({ message: 'Pilih status hak' }),
  }).optional(),

  penggunaan: z.enum([
    'PERUMAHAN',
    'PERDAGANGAN_JASA',
    'PERKANTORAN',
    'INDUSTRI',
    'FASILITAS_UMUM',
    'SAWAH',
    'TEGALAN',
    'PERKEBUNAN',
    'PETERNAKAN_PERIKANAN',
    'HUTAN_BELUKAR',
    'HUTAN_LINDUNG',
    'MUTASI_TANAH',
    'TANAH_KOSONG',
    'LAIN_LAIN',
  ], {
    errorMap: () => ({ message: 'Pilih jenis penggunaan' }),
  }).optional(),

  keterangan: z.string().max(2000).optional(),
});

export type BidangFormData = z.infer<typeof bidangSchema>;

export const createBidangSchema = bidangSchema;
export const updateBidangSchema = bidangSchema.partial().extend({
  tanah_id: z.number().int().positive().optional(),
});

// Helper constants for dropdowns
export const STATUS_HAK_OPTIONS = [
  { value: 'HM', label: 'Hak Milik (HM)' },
  { value: 'HGB', label: 'Hak Guna Bangunan (HGB)' },
  { value: 'HP', label: 'Hak Pakai (HP)' },
  { value: 'HGU', label: 'Hak Guna Usaha (HGU)' },
  { value: 'HPL', label: 'Hak Pengelolaan (HPL)' },
  { value: 'MA', label: 'Milik Adat (MA)' },
  { value: 'VI', label: 'Verponding Indonesia (VI)' },
  { value: 'TN', label: 'Tanah Negara (TN)' },
] as const;

export const PENGGUNAAN_OPTIONS = [
  { value: 'PERUMAHAN', label: 'Perumahan' },
  { value: 'PERDAGANGAN_JASA', label: 'Perdagangan & Jasa' },
  { value: 'PERKANTORAN', label: 'Perkantoran' },
  { value: 'INDUSTRI', label: 'Industri' },
  { value: 'FASILITAS_UMUM', label: 'Fasilitas Umum' },
  { value: 'SAWAH', label: 'Sawah' },
  { value: 'TEGALAN', label: 'Tegalan' },
  { value: 'PERKEBUNAN', label: 'Perkebunan' },
  { value: 'PETERNAKAN_PERIKANAN', label: 'Peternakan & Perikanan' },
  { value: 'HUTAN_BELUKAR', label: 'Hutan Belukar' },
  { value: 'HUTAN_LINDUNG', label: 'Hutan Lindung' },
  { value: 'MUTASI_TANAH', label: 'Mutasi Tanah' },
  { value: 'TANAH_KOSONG', label: 'Tanah Kosong' },
  { value: 'LAIN_LAIN', label: 'Lain-lain' },
] as const;
