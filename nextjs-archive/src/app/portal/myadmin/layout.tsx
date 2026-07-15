'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: '🏠 Dashboard', exact: true },
  { href: '/admin/schemes', label: '📋 Yojanaein (Schemes)' },
  { href: '/admin/categories', label: '📂 Categories' },
  { href: '/admin/states', label: '🗺️ States (Rajya)' },
  { href: '/admin/jobs', label: '💼 Jobs' },
  { href: '/admin/results', label: '📊 Results' },
  { href: '/admin/admit-cards', label: '🎫 Admit Cards' },
  { href: '/admin/scholarships', label: '🎓 Scholarships' },
  { href: '/admin/news', label: '📰 News' },
  { href: '/admin/blogs', label: '✍️ Blogs' },
  { href: '/admin/notifications', label: '🔔 Notifications' },
  { href: '/admin/settings', label: '⚙️ Settings' },
];

function SidebarNav() {
  const pathname = usePathname();

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href) && item.href !== '/admin';
  };

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive(item)
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold">
              🇮🇳
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">Sarkari Yojana</div>
              <div className="text-white/60 text-xs">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* Bottom - site link */}
        <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
          <a
            href="https://sarkariyojana.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs transition"
          >
            🌐 sarkariyojana.app
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 hover:text-gray-900 p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-semibold text-gray-800 text-sm md:text-base">
              Admin Control Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://sarkariyojana.app"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              🌐 Live Website Dekho
            </a>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
