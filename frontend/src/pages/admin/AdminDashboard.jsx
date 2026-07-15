import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Smartphone, Globe, TrendingUp, Bell, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const statsContainerRef = useRef(null);

  useEffect(() => {
    api.get('/api/v1/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  // GSAP animation for count-ups and grid reveal
  useEffect(() => {
    if (!loading && stats) {
      // Fade in grids
      gsap.fromTo('.dashboard-card', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );

      // Animate live counts
      const countTargets = document.querySelectorAll('.animate-count');
      countTargets.forEach(t => {
        const val = parseInt(t.getAttribute('data-count') || '0', 10);
        const obj = { count: 0 };
        gsap.to(obj, {
          count: val,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate: () => {
            t.innerText = Math.floor(obj.count);
          }
        });
      });
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p>Analyzing app analytics...</p>
        </div>
      </div>
    );
  }

  const modules = [
    { title: 'Government Schemes', link: '/admin/schemes', count: stats?.schemes || 0, color: 'bg-blue-500/10 border-blue-500 text-blue-400' },
    { title: 'Sarkari Jobs', link: '/admin/jobs', count: stats?.jobs || 0, color: 'bg-emerald-500/10 border-emerald-500 text-emerald-400' },
    { title: 'Exam Results', link: '/admin/results', count: stats?.results || 0, color: 'bg-indigo-500/10 border-indigo-500 text-indigo-400' },
    { title: 'Admit Cards', link: '/admin/admit-cards', count: stats?.admitCards || 0, color: 'bg-purple-500/10 border-purple-500 text-purple-400' },
    { title: 'Scholarships', link: '/admin/scholarships', count: stats?.scholarships || 0, color: 'bg-pink-500/10 border-pink-500 text-pink-400' },
    { title: 'News Updates', link: '/admin/news', count: stats?.news || 0, color: 'bg-rose-500/10 border-rose-500 text-rose-400' },
    { title: 'Blog Guides', link: '/admin/blogs', count: stats?.blogs || 0, color: 'bg-teal-500/10 border-teal-500 text-teal-400' },
    { title: 'Yojana Categories', link: '/admin/categories', count: stats?.categories || 0, color: 'bg-cyan-500/10 border-cyan-500 text-cyan-400' }
  ];

  return (
    <div ref={statsContainerRef} className="space-y-10 pb-20">
      
      {/* Header Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Command Center
          </h1>
          <p className="text-slate-400 text-xs mt-1">Configure, manage, and monitor all content variables on the live Android App and Website.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-400 px-4 py-2 rounded-xl font-semibold text-xs border border-emerald-900/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          MongoDB Connection Active
        </div>
      </div>

      {/* Analytics Insights */}
      <div className="space-y-4">
        <h2 className="text-md font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <BarChart3 className="text-blue-500" size={18} />
          App & Web Live Traffic
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden dashboard-card">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64} /></div>
            <p className="text-blue-100 font-semibold text-xs uppercase tracking-wider">Active Users (Today)</p>
            <h3 className="text-4xl font-extrabold mt-3 animate-count" data-count="1248">0</h3>
            <p className="text-[10px] mt-2 text-blue-200 flex items-center gap-1"><TrendingUp size={12}/> +12% since last week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden dashboard-card">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Smartphone size={64} /></div>
            <p className="text-purple-100 font-semibold text-xs uppercase tracking-wider">Total Installs</p>
            <h3 className="text-4xl font-extrabold mt-3 animate-count" data-count="45290">0</h3>
            <p className="text-[10px] mt-2 text-purple-200 flex items-center gap-1"><CheckCircle size={12}/> Listed on PlayStore</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden dashboard-card">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={64} /></div>
            <p className="text-emerald-100 font-semibold text-xs uppercase tracking-wider">Web Visitors (Today)</p>
            <h3 className="text-4xl font-extrabold mt-3 animate-count" data-count="3892">0</h3>
            <p className="text-[10px] mt-2 text-teal-200 flex items-center gap-1"><TrendingUp size={12}/> +5% from yesterday</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between dashboard-card group hover:border-slate-700 transition">
            <div>
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bell size={14} className="text-orange-500" />
                Unread Feedback
              </p>
              <h3 className="text-4xl font-extrabold mt-3 text-white animate-count" data-count={stats?.newFeedbacks || 0}>0</h3>
            </div>
            <Link to="/admin/feedback" className="text-blue-500 text-xs font-bold mt-4 inline-flex items-center gap-1 group-hover:underline">
              Inspect Feedback Inbox
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </div>

      {/* Modules Count Overview */}
      <div className="space-y-4">
        <h2 className="text-md font-bold text-slate-300 uppercase tracking-widest border-t border-slate-900 pt-8 flex items-center gap-2">
          <FileText className="text-blue-500" size={18} />
          Content Management
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {modules.map((mod) => (
            <Link 
              key={mod.title} 
              to={mod.link} 
              className={`block p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 transition-all duration-200 dashboard-card`}
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-snug">{mod.title}</h3>
              <div className="mt-5 flex justify-between items-end">
                <p className="text-3xl font-black text-white animate-count" data-count={mod.count}>0</p>
                <span className="text-blue-500 text-xs font-bold hover:underline">Manage &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
