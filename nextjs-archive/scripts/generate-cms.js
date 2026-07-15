const fs = require('fs');
const path = require('path');

const prismaModels = {
  'jobs': 'job',
  'results': 'result',
  'admit-cards': 'admitCard',
  'scholarships': 'scholarship',
  'news': 'news',
  'blogs': 'blog',
  'pages': 'page',
  'announcements': 'announcement'
};

const generateApiRoute = (model) => `import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const modelName = '${prismaModels[model]}';

export async function GET() {
  try {
    const items = await (prisma as any)[modelName].findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await (prisma as any)[modelName].create({
      data: {
        ...data,
        slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const item = await (prisma as any)[modelName].update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) throw new Error('ID required');
    
    await (prisma as any)[modelName].delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;

const generateGenericForm = (model) => `'use client';
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
      fetch(\`/api/v1/admin/${model}?id=\${itemId}\`)
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

    const res = await fetch(\`/api/v1/admin/${model}\`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      router.push(\`/admin/${model}\`);
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
`;

const generateListPage = (model) => `'use client';
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
    const res = await fetch('/api/v1/admin/${model}');
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
    if (!selected.length || !confirm(\`Are you sure you want to \${action} \${selected.length} items?\`)) return;
    for (const id of selected) {
      if (action === 'delete') {
        await fetch(\`/api/v1/admin/${model}?id=\${id}\`, { method: 'DELETE' });
      } else {
        await fetch(\`/api/v1/admin/${model}\`, {
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
        <h2 className="text-2xl font-bold capitalize">{ '${model}'.replace('-', ' ') }</h2>
        <Link href="/admin/${model}/create" className="bg-primary text-white px-4 py-2 rounded font-medium">+ Add New</Link>
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
                    <span className={\`text-xs px-2 py-1 rounded \${item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}\`}>{item.status}</span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <Link href={\`/admin/${model}/\${item.id}\`} className="text-blue-600 hover:underline">Edit</Link>
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
`;

const generateCreatePage = (model) => `import GenericForm from '@/components/admin/${model}Form';
export default function CreatePage() { return ( <div className="max-w-5xl"><h2 className="text-2xl font-bold mb-6">Create New</h2><GenericForm /></div> ) }
`;

const generateEditPage = (model) => `import GenericForm from '@/components/admin/${model}Form';
export default function EditPage({ params }: { params: { id: string } }) { return ( <div className="max-w-5xl"><h2 className="text-2xl font-bold mb-6">Edit</h2><GenericForm itemId={params.id} /></div> ) }
`;

Object.keys(prismaModels).forEach(model => {
  // 1. API Route
  const apiDir = path.join(__dirname, '..', 'src', 'app', 'api', 'v1', 'admin', model);
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(path.join(apiDir, 'route.ts'), generateApiRoute(model));

  // 2. Form Component
  const compDir = path.join(__dirname, '..', 'src', 'components', 'admin');
  fs.mkdirSync(compDir, { recursive: true });
  fs.writeFileSync(path.join(compDir, model + 'Form.tsx'), generateGenericForm(model));

  // 3. Admin Pages
  const pageDir = path.join(__dirname, '..', 'src', 'app', 'admin', model);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), generateListPage(model));
  
  fs.mkdirSync(path.join(pageDir, 'create'), { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'create', 'page.tsx'), generateCreatePage(model));
  
  fs.mkdirSync(path.join(pageDir, '[id]'), { recursive: true });
  fs.writeFileSync(path.join(pageDir, '[id]', 'page.tsx'), generateEditPage(model));

  console.log("Generated CMS for " + model);
});
