'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GenericForm({ itemId }: { itemId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    title: '', slug: '', content: '', status: 'PUBLISHED', seoTitle: '', seoDesc: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (itemId) {
      fetch(`/api/v1/admin/pages?id=${itemId}`)
        .then(r => r.json())
        .then(data => {
          const item = Array.isArray(data) ? data.find((s:any) => s.id === itemId) : data;
          if (item) setFormData(item);
        });
    }
  }, [itemId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const method = itemId ? 'PUT' : 'POST';
    const payload = itemId ? { id: itemId, ...formData } : formData;

    const res = await fetch(`/api/v1/admin/pages`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      router.push(`/admin/pages`);
      router.refresh();
    } else {
      alert('Error saving item');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6 max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input required name="title" value={formData.title || ''} onChange={handleChange} type="text" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Slug</label>
          <input name="slug" value={formData.slug || ''} onChange={handleChange} type="text" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select name="status" value={formData.status || 'PUBLISHED'} onChange={handleChange} className="w-full border rounded p-2">
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-1">Content (HTML)</label>
        <textarea name="content" value={formData.content || ''} onChange={handleChange} className="w-full border rounded p-2 h-64 font-mono text-sm"></textarea>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold mb-4">SEO</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">SEO Title</label>
            <input name="seoTitle" value={formData.seoTitle || ''} onChange={handleChange} type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">SEO Description</label>
            <textarea name="seoDesc" value={formData.seoDesc || ''} onChange={handleChange} className="w-full border rounded p-2 h-16"></textarea>
          </div>
        </div>
      </div>

      <div>
        <button disabled={loading} type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition">
          {loading ? 'Saving...' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}
