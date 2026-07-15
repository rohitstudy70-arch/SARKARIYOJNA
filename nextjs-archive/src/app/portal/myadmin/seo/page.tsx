'use client';
import { useState, useEffect } from 'react';

export default function SeoPage() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ source: '', destination: '', type: 301 });

  useEffect(() => { fetchRedirects(); }, []);

  const fetchRedirects = async () => {
    setLoading(true);
    // Note: To make this real, we need /api/v1/admin/redirects endpoint
    // For now we will mock it or if the endpoint exists, it will load
    try {
      const res = await fetch('/api/v1/admin/redirects');
      if(res.ok) setRedirects(await res.json());
    } catch (e) {}
    setLoading(false);
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch('/api/v1/admin/redirects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ source: '', destination: '', type: 301 });
    fetchRedirects();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/v1/admin/redirects?id=${id}`, { method: 'DELETE' });
    fetchRedirects();
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">SEO & Redirect Manager</h2>
        <button className="bg-primary text-white px-4 py-2 rounded font-medium">Generate Sitemap</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add Redirect</h3>
          <form onSubmit={handleAdd} className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <label className="block text-sm mb-1">Old URL Path (Source)</label>
              <input required value={form.source} onChange={e=>setForm({...form, source: e.target.value})} className="w-full border p-2 rounded" placeholder="/old-yojana.html" />
            </div>
            <div>
              <label className="block text-sm mb-1">New URL Path (Destination)</label>
              <input required value={form.destination} onChange={e=>setForm({...form, destination: e.target.value})} className="w-full border p-2 rounded" placeholder="/yojana/new-yojana.html" />
            </div>
            <div>
              <label className="block text-sm mb-1">Redirect Type</label>
              <select value={form.type} onChange={e=>setForm({...form, type: Number(e.target.value)})} className="w-full border p-2 rounded">
                <option value={301}>301 Moved Permanently</option>
                <option value={302}>302 Found (Temporary)</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Redirect</button>
          </form>

          <div className="mt-8 bg-white p-6 rounded shadow space-y-4">
             <h3 className="text-xl font-semibold mb-4">Robots.txt Editor</h3>
             <textarea className="w-full border rounded p-2 h-32 font-mono text-sm" defaultValue={"User-agent: *\nAllow: /\nSitemap: https://sarkariyojana.app/sitemap.xml"}></textarea>
             <button className="bg-primary text-white px-4 py-2 rounded">Save Robots.txt</button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Active Redirects</h3>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-4 font-semibold text-gray-600">Source</th>
                  <th className="p-4 font-semibold text-gray-600">Destination</th>
                  <th className="p-4 font-semibold text-gray-600">Type</th>
                  <th className="p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {redirects.map(r => (
                  <tr key={r.id} className="border-b">
                    <td className="p-4">{r.source}</td>
                    <td className="p-4">{r.destination}</td>
                    <td className="p-4">{r.type}</td>
                    <td className="p-4"><button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">Delete</button></td>
                  </tr>
                ))}
                {redirects.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No redirects configured</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
