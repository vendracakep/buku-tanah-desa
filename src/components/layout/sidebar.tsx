'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Warga', href: '/dashboard/warga', icon: Users },
  { name: 'Data Tanah', href: '/dashboard/tanah', icon: FileText },
  { name: 'Data Bidang', href: '/dashboard/bidang', icon: MapPin },
  { name: 'Approval', href: '/dashboard/approval', icon: CheckSquare },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-sand-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-sand-200 bg-white shadow-sm hover:bg-sand-50"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-earth-50 text-earth-700'
                    : 'text-sand-600 hover:bg-sand-50 hover:text-sand-900'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info (bottom) */}
        {!collapsed && (
          <div className="border-t border-sand-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-earth-100 text-earth-700">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-sand-900">Staff Desa</div>
                <div className="text-xs text-sand-500">staff@pongangan.id</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
