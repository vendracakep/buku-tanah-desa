'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWargaById, useUpdateWarga } from '@/lib/hooks';
import { wargaSchema, type WargaFormData } from '@/lib/validations';

export default function EditWargaPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: warga, isLoading } = useWargaById(id);
  const updateWarga = useUpdateWarga();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WargaFormData>({
    resolver: zodResolver(wargaSchema),
    values: warga ? {
      nik: warga.nik || '',
      nama_lengkap: warga.nama_lengkap,
      jenis_kelamin: warga.jenis_kelamin || undefined,
      status_perkawinan: warga.status_perkawinan || undefined,
      tempat_lahir: warga.tempat_lahir || '',
      tanggal_lahir: warga.tanggal_lahir ? new Date(warga.tanggal_lahir) : undefined,
      agama: warga.agama || '',
      pendidikan_terakhir: warga.pendidikan_terakhir || '',
      pekerjaan: warga.pekerjaan || '',
      kewarganegaraan: warga.kewarganegaraan,
      alamat_lengkap: warga.alamat_lengkap || '',
      keterangan: warga.keterangan || '',
    } : undefined,
  });

  const onSubmit = async (data: WargaFormData) => {
    try {
      const submitData = {
        ...data,
        nik: data.nik || null,
        tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir as any).toISOString() : null,
      };

      await updateWarga.mutateAsync({ id, updates: submitData as any });
      alert('Warga berhasil diupdate!');
      router.push(`/dashboard/warga/${id}`);
    } catch (error: any) {
      alert('Gagal mengupdate: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sand-500">Memuat data...</div>
      </div>
    );
  }

  if (!warga) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-sand-500">Data tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/warga/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-sand-900">Edit Data Warga</h1>
          <p className="mt-2 text-sand-600">{warga.nama_lengkap}</p>
        </div>
      </div>

      {/* Form - Same as create but with pre-filled values */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Identitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK</Label>
                    <Input id="nik" {...register('nik')} maxLength={16} />
                    {errors.nik && (
                      <p className="text-sm text-red-600">{errors.nik.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                    <Input id="nama_lengkap" {...register('nama_lengkap')} />
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
                      className="flex h-10 w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Pilih...</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status_perkawinan">Status Perkawinan</Label>
                    <select
                      id="status_perkawinan"
                      {...register('status_perkawinan')}
                      className="flex h-10 w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm"
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
                    <Input id="tempat_lahir" {...register('tempat_lahir')} />
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

            <Card>
              <CardHeader>
                <CardTitle>Data Lainnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="agama">Agama</Label>
                    <Input id="agama" {...register('agama')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pendidikan_terakhir">Pendidikan</Label>
                    <Input id="pendidikan_terakhir" {...register('pendidikan_terakhir')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                    <Input id="pekerjaan" {...register('pekerjaan')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                  <textarea
                    id="alamat_lengkap"
                    {...register('alamat_lengkap')}
                    rows={3}
                    className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan</Label>
                  <textarea
                    id="keterangan"
                    {...register('keterangan')}
                    rows={2}
                    className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Link href={`/dashboard/warga/${id}`} className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Batal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
