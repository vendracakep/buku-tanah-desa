'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWargaById, useDeleteWarga } from '@/lib/hooks';
import { formatDate, formatNIK } from '@/lib/utils';

export default function WargaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: warga, isLoading } = useWargaById(id);
  const deleteWarga = useDeleteWarga();

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus data warga ini?')) return;

    try {
      await deleteWarga.mutateAsync(id);
      alert('Warga berhasil dihapus!');
      router.push('/dashboard/warga');
    } catch (error: any) {
      alert('Gagal menghapus: ' + error.message);
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warga">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-sand-500">Data warga tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warga">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-sand-900">{warga.nama_lengkap}</h1>
            <p className="mt-2 text-sand-600">
              {warga.nik ? `NIK: ${formatNIK(warga.nik)}` : 'Belum ada NIK'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/warga/${id}/edit`}>
            <Button className="bg-earth-600 hover:bg-earth-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Identitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="NIK" value={warga.nik ? formatNIK(warga.nik) : '-'} />
              <DetailRow label="Nama Lengkap" value={warga.nama_lengkap} />
              <DetailRow label="Jenis Kelamin" value={warga.jenis_kelamin || '-'} />
              <DetailRow label="Status Perkawinan" value={warga.status_perkawinan || '-'} />
              <DetailRow label="Tempat Lahir" value={warga.tempat_lahir || '-'} />
              <DetailRow
                label="Tanggal Lahir"
                value={warga.tanggal_lahir ? formatDate(warga.tanggal_lahir) : '-'}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Lainnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="Agama" value={warga.agama || '-'} />
              <DetailRow label="Pendidikan Terakhir" value={warga.pendidikan_terakhir || '-'} />
              <DetailRow label="Pekerjaan" value={warga.pekerjaan || '-'} />
              <DetailRow label="Kewarganegaraan" value={warga.kewarganegaraan} />
              <DetailRow label="Alamat Lengkap" value={warga.alamat_lengkap || '-'} />
              {warga.keterangan && (
                <DetailRow label="Keterangan" value={warga.keterangan} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="text-sand-500">Dibuat pada</div>
                <div className="font-medium">
                  {formatDate(warga.created_at, 'dd MMM yyyy, HH:mm')}
                </div>
              </div>
              <div>
                <div className="text-sand-500">Terakhir diubah</div>
                <div className="font-medium">
                  {formatDate(warga.updated_at, 'dd MMM yyyy, HH:mm')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Data Terkait</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-sand-200 p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sand-500" />
                    <span>Tanah yang dimiliki</span>
                  </div>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-sm font-medium text-sand-500">{label}</div>
      <div className="col-span-2 text-sm text-sand-900">{value}</div>
    </div>
  );
}
