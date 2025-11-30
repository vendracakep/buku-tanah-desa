'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWarga } from '@/lib/hooks';
import { wargaSchema, type WargaFormData } from '@/lib/validations';

export default function CreateWargaPage() {
  const router = useRouter();
  const createWarga = useCreateWarga();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WargaFormData>({
    resolver: zodResolver(wargaSchema),
    defaultValues: {
      kewarganegaraan: 'WNI',
    },
  });

  const onSubmit = async (data: WargaFormData) => {
    try {
      // Convert date string to Date object
      const submitData = {
        ...data,
        nik: data.nik || null,
        tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir as any).toISOString() : null,
      };

      await createWarga.mutateAsync(submitData as any);

      // Show success message (we'll add toast later)
      alert('Warga berhasil ditambahkan!');

      router.push('/dashboard/warga');
    } catch (error: any) {
      alert('Gagal menambahkan warga: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/warga">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-sand-900">Tambah Warga Baru</h1>
          <p className="mt-2 text-sand-600">
            Isi formulir di bawah untuk mendaftarkan warga baru
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Data Identitas */}
            <Card>
              <CardHeader>
                <CardTitle>Data Identitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nik">
                      NIK <span className="text-xs text-sand-500">(Opsional)</span>
                    </Label>
                    <Input
                      id="nik"
                      {...register('nik')}
                      placeholder="3374012505850001"
                      maxLength={16}
                    />
                    {errors.nik && (
                      <p className="text-sm text-red-600">{errors.nik.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">
                      Nama Lengkap <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="nama_lengkap"
                      {...register('nama_lengkap')}
                      placeholder="Budi Santoso"
                    />
                    {errors.nama_lengkap && (
                      <p className="text-sm text-red-600">{errors.nama_lengkap.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                    <select
                      id="jenis_kelamin"
                      {...register('jenis_kelamin')}
                      className="flex h-10 w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Pilih...</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {errors.jenis_kelamin && (
                      <p className="text-sm text-red-600">{errors.jenis_kelamin.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                    <select
                      id="status_perkawinan"
                      {...register('status_perkawinan')}
                      className="flex h-10 w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Pilih...</option>
                      <option value="BELUM KAWIN">Belum Kawin</option>
                      <option value="KAWIN">Kawin</option>
                      <option value="CERAI HIDUP">Cerai Hidup</option>
                      <option value="CERAI MATI">Cerai Mati</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                    <Input
                      id="tempat_lahir"
                      {...register('tempat_lahir')}
                      placeholder="Semarang"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggal_lahir"
                      type="date"
                      {...register('tanggal_lahir', {
                        setValueAs: (v) => v ? new Date(v) : undefined,
                      })}
                    />
                    {errors.tanggal_lahir && (
                      <p className="text-sm text-red-600">{errors.tanggal_lahir.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Lainnya */}
            <Card>
              <CardHeader>
                <CardTitle>Data Lainnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="agama">Agama</Label>
                    <Input
                      id="agama"
                      {...register('agama')}
                      placeholder="Islam"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir</Label>
                    <Input
                      id="pendidikan_terakhir"
                      {...register('pendidikan_terakhir')}
                      placeholder="SMA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                    <Input
                      id="pekerjaan"
                      {...register('pekerjaan')}
                      placeholder="Petani"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                  <textarea
                    id="alamat_lengkap"
                    {...register('alamat_lengkap')}
                    rows={3}
                    placeholder="Jl. Pongangan No. 12, RT 01/RW 02, Pongangan, Gunungpati, Semarang"
                    className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <textarea
                    id="keterangan"
                    {...register('keterangan')}
                    rows={2}
                    placeholder="Catatan tambahan (opsional)"
                    className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-earth-600 hover:bg-earth-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Warga'}
                </Button>
                <Link href="/dashboard/warga" className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Catatan</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-sand-600 space-y-2">
                <p>• Field dengan tanda <span className="text-red-600">*</span> wajib diisi</p>
                <p>• NIK harus 16 digit angka</p>
                <p>• Usia minimal 17 tahun</p>
                <p>• Data akan langsung tersimpan setelah klik Simpan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
