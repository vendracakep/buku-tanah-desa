import { z } from 'zod';

export const wargaSchema = z.object({
  nik: z
    .string()
    .length(16, 'NIK harus 16 digit')
    .regex(/^\d+$/, 'NIK harus berisi angka saja')
    .optional()
    .or(z.literal('')),

  nama_lengkap: z
    .string()
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(255, 'Nama lengkap maksimal 255 karakter'),

  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], {
    errorMap: () => ({ message: 'Pilih jenis kelamin' }),
  }).optional(),

  status_perkawinan: z
    .enum(['BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI'])
    .optional(),

  tempat_lahir: z.string().max(255).optional(),

  tanggal_lahir: z
    .date({
      errorMap: () => ({ message: 'Tanggal lahir tidak valid' }),
    })
    .refine(
      (date) => {
        const age = Math.floor(
          (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        return age >= 17;
      },
      { message: 'Usia minimal 17 tahun' }
    )
    .optional(),

  agama: z.string().max(100).optional(),

  pendidikan_terakhir: z.string().max(100).optional(),

  pekerjaan: z.string().max(100).optional(),

  foto_ktp_url: z.string().url('URL foto tidak valid').optional(),

  kewarganegaraan: z.enum(['WNI', 'WNA']).default('WNI'),

  alamat_lengkap: z.string().max(1000).optional(),

  keterangan: z.string().max(2000).optional(),
});

export type WargaFormData = z.infer<typeof wargaSchema>;

// Schema for create (excludes auto-generated fields)
export const createWargaSchema = wargaSchema;

// Schema for update (all fields optional)
export const updateWargaSchema = wargaSchema.partial();
