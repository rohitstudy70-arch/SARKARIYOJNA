import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckCircle, FileText, Globe, Tag } from 'lucide-react';
import api from '../../utils/api';

export default function SchemeManager() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/admin/schemes');
      setSchemes(res.data);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    try {
      const res = await api.delete(`/api/v1/admin/schemes?id=${id}`);
      if (res.data.success) {
        setSchemes(schemes.filter(s => (s._id || s.id) !== id));
      }
    } catch (err) {
      alert('Failed to delete scheme.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title section */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Scheme Manager (Yojana Control)</h1>
          <p className="text-slate-400 text-xs mt-1">Publish, update and modify government schemes linked to categories and states.</p>
        </div>
        <Link 
          to="/admin/schemes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/10 transition"
        >
          <Plus size={16} />
          Create New Yojana
        </Link>
      </div>

      {/* Schemes List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span>Syncing yojanas...</span>
          </div>
        ) : schemes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No schemes published yet. Click "Create New Yojana" to add.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="p-5">Scheme Title</th>
                  <th className="p-5">Hindi Translation</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">State</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Tags</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-300">
                {schemes.map((scheme) => {
                  const schemeId = scheme._id || scheme.id;
                  return (
                    <tr key={schemeId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-white max-w-xs truncate">{scheme.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{scheme.slug}</div>
                      </td>
                      <td className="p-5 text-slate-400 max-w-xs truncate font-medium">
                        {scheme.hindiName || '-'}
                      </td>
                      <td className="p-5">
                        <span className="bg-slate-950 text-blue-400 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">
                          {scheme.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="bg-slate-950 text-amber-400 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">
                          {scheme.state?.name || 'Central'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          scheme.status === 'PUBLISHED' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                        }`}>
                          {scheme.status}
                        </span>
                      </td>
                      <td className="p-5 space-y-1">
                        {scheme.featured && <span className="inline-block text-[9px] bg-blue-950/40 border border-blue-900/30 text-blue-400 font-bold px-1.5 py-0.5 rounded mr-1">Featured</span>}
                        {scheme.trending && <span className="inline-block text-[9px] bg-orange-950/40 border border-orange-900/30 text-orange-400 font-bold px-1.5 py-0.5 rounded mr-1">Trending</span>}
                        {scheme.popular && <span className="inline-block text-[9px] bg-purple-950/40 border border-purple-900/30 text-purple-400 font-bold px-1.5 py-0.5 rounded">Popular</span>}
                      </td>
                      <td className="p-5 text-right space-x-1.5">
                        <Link 
                          to={`/admin/schemes/edit/${schemeId}`}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-2 rounded-lg transition inline-flex items-center"
                        >
                          <Edit2 size={12} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(schemeId)}
                          className="bg-red-950/40 hover:bg-red-900 border border-red-900/30 text-red-400 p-2 rounded-lg transition inline-flex items-center"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
