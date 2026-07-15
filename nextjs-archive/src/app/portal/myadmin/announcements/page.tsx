'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/admin/announcements');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) setSelected(filteredItems.map(s => s.id));
    else setSelected([]);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkAction = async (action: string) => {
    if (!selected.length || !confirm(`Are you sure you want to ${action} ${selected.length} items?`)) return;
    for (const id of selected) {
      if (action === 'delete') {
        await fetch(`/api/v1/admin/announcements?id=${id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/v1/admin/announcements`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: action === 'publish' ? 'PUBLISHED' : 'DRAFT' })
        });
      }
    }
    setSelected([]);
    fetchItems();
  };

  const filteredItems = items.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">{ 'announcements'.replace('-', ' ') }</h2>
        <Link href="/portal/myadmin/announcements/create" className="bg-primary text-white px-4 py-2 rounded font-medium">+ Add New</Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <input type="text" placeholder="Search..." className="border rounded p-2 w-64" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('publish')} disabled={!selected.length} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50">Bulk Publish</button>
            <button onClick={() => handleBulkAction('draft')} disabled={!selected.length} className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50">Bulk Draft</button>
            <button onClick={() => handleBulkAction('delete')} disabled={!selected.length} className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50">Bulk Delete</button>
          </div>
        </div>
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selected.length === filteredItems.length && filteredItems.length > 0} /></th>
                <th className="p-4 font-semibold text-gray-600">Title</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item: any) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => handleSelect(item.id)} /></td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/admin/announcements/${item.id}`} className="text-blue-600 hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
