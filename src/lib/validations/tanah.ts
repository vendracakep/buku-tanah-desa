import { z } from 'zod';

export const tanahSchema = z.object({
  nomor_urut: z
    .string()
    .min(1, 'Nomor urut wajib diisi')
    .max(64, 'Nomor urut maksimal 64 karakter')
    .regex(
      /^[A-Z]\.\d+\/\d{4}$/,
      'Format nomor urut: A.001/2024'
    ),

  warga_id: z
    .number()
    .int()
    .positive('Pilih pemilik tanah')
    .optional()
    .nullable(),

  jumlah_m2: z
    .number()
    .positive('Luas harus lebih dari 0')
    .max(1000000, 'Luas maksimal 1.000.000 m²')
    .optional()
    .nullable(),

  keterangan: z.string().max(2000).optional(),
});

export type TanahFormData = z.infer<typeof tanahSchema>;

export const createTanahSchema = tanahSchema;
export const updateTanahSchema = tanahSchema.partial();
