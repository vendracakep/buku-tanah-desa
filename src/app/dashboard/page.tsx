import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MapPin, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-sand-900">Dashboard</h1>
        <p className="mt-2 text-sand-600">
          Selamat datang di SIDATA DESA - Sistem Informasi Data Tanah Desa Pongangan
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Warga"
          value="0"
          description="Warga terdaftar"
          icon={<Users className="h-5 w-5" />}
          trend="+0%"
          trendUp={true}
        />
        <StatCard
          title="Data Tanah"
          value="0"
          description="Tanah terdaftar"
          icon={<FileText className="h-5 w-5" />}
          trend="+0%"
          trendUp={true}
        />
        <StatCard
          title="Bidang Tanah"
          value="0"
          description="Bidang terdaftar"
          icon={<MapPin className="h-5 w-5" />}
          trend="+0%"
          trendUp={true}
        />
        <StatCard
          title="Pending Approval"
          value="0"
          description="Menunggu persetujuan"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="-"
          trendUp={false}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 text-sand-500">
              <p>Belum ada aktivitas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <QuickAction
                title="Tambah Warga Baru"
                description="Daftarkan warga baru"
                href="/dashboard/warga/create"
              />
              <QuickAction
                title="Tambah Data Tanah"
                description="Catat tanah baru"
                href="/dashboard/tanah/create"
              />
              <QuickAction
                title="Lihat Peta"
                description="Buka peta interaktif"
                href="/peta"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-earth-100 text-earth-600">
            {icon}
          </div>
          <span
            className={`text-sm font-medium ${
              trendUp ? 'text-green-600' : 'text-sand-500'
            }`}
          >
            {trend}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold text-sand-900">{value}</div>
          <div className="mt-1 text-sm font-medium text-sand-900">{title}</div>
          <div className="mt-1 text-xs text-sand-500">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-lg border border-sand-200 p-4 transition-all hover:border-earth-300 hover:bg-earth-50"
    >
      <div className="flex-1">
        <div className="font-medium text-sand-900">{title}</div>
        <div className="text-sm text-sand-500">{description}</div>
      </div>
      <div className="text-sand-400">→</div>
    </a>
  );
}
