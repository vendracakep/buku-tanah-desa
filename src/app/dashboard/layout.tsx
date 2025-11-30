import { Sidebar } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Navbar space */}
      <div className="h-16" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 min-h-[calc(100vh-4rem)] p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
