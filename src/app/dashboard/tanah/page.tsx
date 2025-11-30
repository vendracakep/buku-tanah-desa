'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTanah } from '@/lib/hooks';
import { formatDate, formatArea } from '@/lib/utils';

export default function TanahListPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useTanah({ search, limit: 100 });

  const tanahList = data?.data || [];
  const totalCount = data?.count || 0;

  // Calculate total area
  const totalArea = tanahList.reduce((sum, t) => sum + (Number(t.jumlah_m2) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sand-900">Data Tanah</h1>
          <p className="mt-2 text-sand-600">
            Kelola data tanah (buku tanah) Desa Pongangan
          </p>
        </div>
        <Link href="/dashboard/tanah/create">
          <Button className="bg-earth-600 hover:bg-earth-700">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tanah
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">{totalCount}</div>
            <div className="text-sm text-sand-600">Total Data Tanah</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">
              {formatArea(totalArea)}
            </div>
            <div className="text-sm text-sand-600">Total Luas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">
              {tanahList.filter(t => t.warga_id).length}
            </div>
            <div className="text-sm text-sand-600">Memiliki Pemilik</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Tanah</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
              <Input
                placeholder="Cari nomor urut..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sand-500">Memuat data...</div>
            </div>
          ) : tanahList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-sand-500 mb-4">
                {search ? 'Tidak ada hasil' : 'Belum ada data tanah'}
              </div>
              {!search && (
                <Link href="/dashboard/tanah/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Tanah Pertama
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-200 text-left text-sm font-medium text-sand-600">
                    <th className="pb-3">Nomor Urut</th>
                    <th className="pb-3">Pemilik</th>
                    <th className="pb-3">Luas (m²)</th>
                    <th className="pb-3">Dibuat</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {tanahList.map((tanah: any) => (
                    <tr key={tanah.id} className="text-sm hover:bg-sand-50">
                      <td className="py-4 font-mono text-xs font-medium text-sand-900">
                        {tanah.nomor_urut}
                      </td>
                      <td className="py-4 text-sand-600">
                        {tanah.warga?.nama_lengkap || '-'}
                      </td>
                      <td className="py-4 text-sand-600">
                        {tanah.jumlah_m2 ? formatArea(Number(tanah.jumlah_m2)) : '-'}
                      </td>
                      <td className="py-4 text-sand-600">
                        {formatDate(tanah.created_at)}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/tanah/${tanah.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
