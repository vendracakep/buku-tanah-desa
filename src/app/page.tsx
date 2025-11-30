import Link from 'next/link';
import { MapPin, Users, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-earth-500 via-earth-600 to-earth-700 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:32px_32px]" />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            SIDATA DESA
            <span className="block mt-2 bg-gradient-to-r from-earth-100 to-white bg-clip-text text-transparent">
              v2.0
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl text-earth-50 sm:text-2xl">
            Sistem Informasi Data Tanah Desa Pongangan
          </p>

          <p className="mx-auto mb-12 max-w-3xl text-lg text-earth-100 sm:text-xl">
            Platform modern untuk mengelola data tanah, warga, dan bidang tanah dengan
            teknologi pemetaan geospasial terkini
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/peta">
              <Button
                size="lg"
                className="bg-white text-earth-700 hover:bg-earth-50 text-lg px-8 py-6 h-auto font-semibold shadow-xl"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Lihat Peta Interaktif
              </Button>
            </Link>

            <Link href="/data">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 text-lg px-8 py-6 h-auto font-semibold"
              >
                <FileText className="mr-2 h-5 w-5" />
                Jelajahi Data
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="mx-auto h-12 w-6 rounded-full border-2 border-white/30 p-1">
              <div className="h-2 w-2 mx-auto rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={<Users className="h-8 w-8" />}
              value="500+"
              label="Warga Terdaftar"
              color="text-earth-600"
            />
            <StatsCard
              icon={<FileText className="h-8 w-8" />}
              value="300+"
              label="Data Tanah"
              color="text-sky-600"
            />
            <StatsCard
              icon={<MapPin className="h-8 w-8" />}
              value="450+"
              label="Bidang Tanah"
              color="text-earth-600"
            />
            <StatsCard
              icon={<TrendingUp className="h-8 w-8" />}
              value="95%"
              label="Akurasi Data"
              color="text-sky-600"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-sand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-sand-900 sm:text-5xl">
              Fitur Unggulan
            </h2>
            <p className="mt-4 text-lg text-sand-600">
              Platform lengkap untuk pengelolaan data tanah desa modern
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<MapPin className="h-10 w-10" />}
              title="Peta Interaktif"
              description="Visualisasi bidang tanah dengan teknologi Mapbox GL dan PostGIS untuk akurasi tinggi"
              gradient="from-earth-500 to-earth-600"
            />

            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Manajemen Warga"
              description="Kelola data warga dengan sistem pencarian cepat dan validasi NIK otomatis"
              gradient="from-sky-500 to-sky-600"
            />

            <FeatureCard
              icon={<FileText className="h-10 w-10" />}
              title="Buku Tanah Digital"
              description="Pencatatan tanah modern dengan nomor urut unik dan status hak yang jelas"
              gradient="from-earth-600 to-earth-700"
            />

            <FeatureCard
              icon={<TrendingUp className="h-10 w-10" />}
              title="Workflow Approval"
              description="Sistem persetujuan bertingkat untuk setiap perubahan data dengan audit trail lengkap"
              gradient="from-sky-600 to-sky-700"
            />

            <FeatureCard
              icon={<MapPin className="h-10 w-10" />}
              title="Analisis Geospasial"
              description="Perhitungan luas otomatis, deteksi tumpang tindih, dan analisis penggunaan lahan"
              gradient="from-earth-500 to-earth-700"
            />

            <FeatureCard
              icon={<FileText className="h-10 w-10" />}
              title="Export & Laporan"
              description="Export data ke PDF dan CSV untuk kebutuhan administrasi dan laporan"
              gradient="from-sky-500 to-earth-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-earth-600 to-earth-800 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Siap Mengelola Data Tanah?
          </h2>
          <p className="mt-6 text-xl text-earth-100">
            Login untuk mengakses dashboard dan mulai mengelola data desa Anda
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-earth-700 hover:bg-earth-50 text-lg px-8 py-6 h-auto font-semibold shadow-xl"
              >
                Login ke Dashboard
              </Button>
            </Link>
            <Link href="/peta">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 text-lg px-8 py-6 h-auto font-semibold"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Lihat Peta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sand-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">SIDATA DESA</h3>
            <p className="mt-2 text-sand-400">
              Desa Pongangan, Kecamatan Gunungpati, Kota Semarang
            </p>
            <p className="mt-4 text-sm text-sand-500">
              © 2024 SIDATA DESA. Powered by modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// Components
// ============================================================================

function StatsCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <Card className="border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-8 text-center">
        <div className={`mx-auto mb-4 inline-flex ${color}`}>{icon}</div>
        <div className="text-4xl font-bold text-sand-900">{value}</div>
        <div className="mt-2 text-sm font-medium text-sand-600">{label}</div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Card className="border-none shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-8">
        <div
          className={`mb-6 inline-flex rounded-lg bg-gradient-to-br ${gradient} p-3 text-white`}
        >
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-sand-900">{title}</h3>
        <p className="text-sand-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
