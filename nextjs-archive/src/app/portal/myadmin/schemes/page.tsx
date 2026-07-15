'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/admin/schemes');
    const data = await res.json();
    setSchemes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelected(filteredSchemes.map(s => s.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kya aap sure ho? Ye yojana delete ho jayegi!')) return;
    setDeleting(id);
    await fetch(`/api/v1/admin/schemes?id=${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetchSchemes();
  };

  const handleBulkAction = async (action: string) => {
    if (!selected.length) return;
    if (!confirm(`Kya aap sure ho? ${selected.length} yojanaon par "${action}" action hoga?`)) return;

    for (const id of selected) {
      if (action === 'delete') {
        await fetch(`/api/v1/admin/schemes?id=${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/v1/admin/schemes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: action === 'publish' ? 'PUBLISHED' : 'DRAFT' })
        });
      }
    }
    setSelected([]);
    fetchSchemes();
  };

  const getImageFromScheme = (scheme: any): string => {
    if (!scheme.images) return '';
    try {
      const parsed = JSON.parse(scheme.images);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0];
    } catch {
      if (scheme.images.startsWith('http')) return scheme.images.split(',')[0].trim();
    }
    return '';
  };

  const filteredSchemes = schemes.filter(s => {
    const matchSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.hindiName?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const paginatedSchemes = filteredSchemes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const publishedCount = schemes.filter(s => s.status === 'PUBLISHED').length;
  const draftCount = schemes.filter(s => s.status === 'DRAFT').length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sabhi Yojanaein</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total: <strong>{schemes.length}</strong> &nbsp;|&nbsp;
            <span className="text-green-600">Published: {publishedCount}</span> &nbsp;|&nbsp;
            <span className="text-yellow-600">Draft: {draftCount}</span>
          </p>
        </div>
        <Link
          href="/portal/myadmin/schemes/create"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 transition"
        >
          <span className="text-xl">+</span> Nayi Yojana Add Karo
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-600">{schemes.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Yojanaein</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-green-600">{publishedCount}</div>
          <div className="text-sm text-gray-600 mt-1">Published</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-yellow-600">{draftCount}</div>
          <div className="text-sm text-gray-600 mt-1">Draft</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
        <div className="p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <input
              type="text"
              placeholder="🔍 Yojana dhundo..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sabhi Status</option>
              <option value="PUBLISHED">✅ Published</option>
              <option value="DRAFT">📝 Draft</option>
            </select>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                {selected.length} selected
              </span>
              <button onClick={() => handleBulkAction('publish')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition">
                ✅ Publish Karo
              </button>
              <button onClick={() => handleBulkAction('draft')} className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-700 transition">
                📝 Draft Karo
              </button>
              <button onClick={() => handleBulkAction('delete')} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition">
                🗑️ Delete Karo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Yojanaein load ho rahi hain...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selected.length === filteredSchemes.length && filteredSchemes.length > 0}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Photo</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Yojana Ka Naam</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">State</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tags</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Updated</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedSchemes.map((scheme: any) => {
                  const imgUrl = getImageFromScheme(scheme);
                  return (
                    <tr key={scheme.id} className={`hover:bg-blue-50 transition ${selected.includes(scheme.id) ? 'bg-blue-50' : ''}`}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(scheme.id)}
                          onChange={() => handleSelect(scheme.id)}
                          className="w-4 h-4 rounded accent-blue-600"
                        />
                      </td>
                      <td className="p-4">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={scheme.title}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e: any) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-gray-200 flex items-center justify-center text-xl">
                            📋
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 text-sm">{scheme.title}</div>
                        {scheme.hindiName && (
                          <div className="text-xs text-gray-500 mt-0.5">{scheme.hindiName}</div>
                        )}
                        {scheme.shortDesc && (
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{scheme.shortDesc}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {scheme.category ? (
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {scheme.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {scheme.state ? (
                          <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {scheme.state.name}
                          </span>
                        ) : (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">Central</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                          scheme.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {scheme.status === 'PUBLISHED' ? '✅' : '📝'} {scheme.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {scheme.featured && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                          {scheme.trending && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🔥 Trending</span>}
                          {scheme.popular && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">👑 Popular</span>}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(scheme.updatedAt).toLocaleDateString('hi-IN')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/schemes/${scheme.id}`}
                            className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            ✏️ Edit
                          </Link>
                          <a
                            href={`/yojana/${scheme.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition font-medium"
                          >
                            👁️ View
                          </a>
                          <button
                            onClick={() => handleDelete(scheme.id)}
                            disabled={deleting === scheme.id}
                            className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50"
                          >
                            {deleting === scheme.id ? '...' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedSchemes.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-16 text-center text-gray-500">
                      <div className="text-5xl mb-3">🔍</div>
                      <p className="font-medium">Koi yojana nahi mili</p>
                      <p className="text-sm mt-1">Search ya filter change karo</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({filteredSchemes.length} yojanaein)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 transition"
              >
                ← Pehla
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(c => c + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 transition"
              >
                Agla →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
