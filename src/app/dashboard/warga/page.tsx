'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWarga } from '@/lib/hooks';
import { formatDate, formatNIK } from '@/lib/utils';
import type { Warga } from '@/types/database.types';

export default function WargaListPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useWarga({ search, limit: 100 });

  const wargaList = data?.data || [];
  const totalCount = data?.count || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sand-900">Data Warga</h1>
          <p className="mt-2 text-sand-600">
            Kelola data warga Desa Pongangan
          </p>
        </div>
        <Link href="/dashboard/warga/create">
          <Button className="bg-earth-600 hover:bg-earth-700">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Warga
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">{totalCount}</div>
            <div className="text-sm text-sand-600">Total Warga</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">
              {wargaList.filter(w => w.jenis_kelamin === 'Laki-laki').length}
            </div>
            <div className="text-sm text-sand-600">Laki-laki</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-sand-900">
              {wargaList.filter(w => w.jenis_kelamin === 'Perempuan').length}
            </div>
            <div className="text-sm text-sand-600">Perempuan</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Warga</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-400" />
                <Input
                  placeholder="Cari nama atau NIK..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sand-500">Memuat data...</div>
            </div>
          ) : wargaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-sand-500 mb-4">
                {search ? 'Tidak ada hasil' : 'Belum ada data warga'}
              </div>
              {!search && (
                <Link href="/dashboard/warga/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Warga Pertama
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-200 text-left text-sm font-medium text-sand-600">
                    <th className="pb-3">NIK</th>
                    <th className="pb-3">Nama Lengkap</th>
                    <th className="pb-3">Jenis Kelamin</th>
                    <th className="pb-3">Tanggal Lahir</th>
                    <th className="pb-3">Alamat</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {wargaList.map((warga) => (
                    <tr key={warga.id} className="text-sm hover:bg-sand-50">
                      <td className="py-4 font-mono text-xs">
                        {warga.nik ? formatNIK(warga.nik) : '-'}
                      </td>
                      <td className="py-4 font-medium text-sand-900">
                        {warga.nama_lengkap}
                      </td>
                      <td className="py-4 text-sand-600">
                        {warga.jenis_kelamin || '-'}
                      </td>
                      <td className="py-4 text-sand-600">
                        {warga.tanggal_lahir ? formatDate(warga.tanggal_lahir) : '-'}
                      </td>
                      <td className="py-4 text-sand-600">
                        <div className="max-w-xs truncate">
                          {warga.alamat_lengkap || '-'}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/warga/${warga.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/warga/${warga.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
