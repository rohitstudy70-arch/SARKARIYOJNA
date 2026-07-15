'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, Smartphone, Globe, TrendingUp, Bell, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    fetch('/api/v1/admin/stats').then(r => r.json()).then(setStats).catch(()=>null);
  }, []);

  const modules = [
    { title: 'Schemes', link: '/portal/myadmin/schemes', count: stats?.schemes || 0, color: 'border-blue-500' },
    { title: 'Jobs', link: '/portal/myadmin/jobs', count: stats?.jobs || 0, color: 'border-green-500' },
    { title: 'Results', link: '/portal/myadmin/results', count: stats?.results || 0, color: 'border-indigo-500' },
    { title: 'Admit Cards', link: '/portal/myadmin/admit-cards', count: stats?.admitCards || 0, color: 'border-purple-500' },
    { title: 'Scholarships', link: '/portal/myadmin/scholarships', count: stats?.scholarships || 0, color: 'border-pink-500' },
    { title: 'News', link: '/portal/myadmin/news', count: stats?.news || 0, color: 'border-red-500' },
    { title: 'Categories', link: '/portal/myadmin/categories', count: stats?.categories || 0, color: 'border-teal-500' },
    { title: 'States', link: '/portal/myadmin/states', count: stats?.states || 0, color: 'border-cyan-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sarkari Yojana Command Center</h1>
          <p className="text-gray-500 mt-1">Manage everything from your App & Website in one place.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium text-sm border border-green-100">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          System Online
        </div>
      </div>

      {/* ================= APP ANALYTICS SECTION ================= */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 className="text-blue-600" /> App Analytics & Insights (Live)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Users size={64} /></div>
            <p className="text-blue-100 font-medium">Daily Active Users</p>
            <h3 className="text-4xl font-bold mt-2">1,248</h3>
            <p className="text-sm mt-2 text-blue-200 flex items-center gap-1"><TrendingUp size={14}/> +12% from yesterday</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Smartphone size={64} /></div>
            <p className="text-purple-100 font-medium">Total App Installs</p>
            <h3 className="text-4xl font-bold mt-2">45,290</h3>
            <p className="text-sm mt-2 text-purple-200 flex items-center gap-1"><CheckCircle size={14}/> Active on PlayStore</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Globe size={64} /></div>
            <p className="text-emerald-100 font-medium">Website Visitors (Today)</p>
            <h3 className="text-4xl font-bold mt-2">3,892</h3>
            <p className="text-sm mt-2 text-emerald-200 flex items-center gap-1"><TrendingUp size={14}/> +5% from yesterday</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-orange-300 transition">
            <div>
              <p className="text-gray-500 font-medium flex items-center gap-2"><Bell size={16} className="text-orange-500"/> Notifications Sent</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">24</h3>
            </div>
            <Link href="/portal/myadmin/notifications" className="text-orange-600 text-sm font-semibold mt-4 group-hover:underline">Send New Push Alert &rarr;</Link>
          </div>
        </div>
      </div>
      
      {/* ================= CONTENT MANAGEMENT ================= */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 border-t pt-8">Content Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {modules.map((mod) => (
            <Link key={mod.title} href={mod.link} className={`block bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition border-l-4 ${mod.color}`}>
              <h2 className="text-lg font-semibold text-gray-700">{mod.title}</h2>
              <div className="mt-4 flex justify-between items-end">
                <p className="text-3xl font-bold text-gray-900">{stats === null && typeof mod.count === 'number' ? '...' : mod.count}</p>
                <span className="text-gray-400 text-sm font-medium">Manage &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
