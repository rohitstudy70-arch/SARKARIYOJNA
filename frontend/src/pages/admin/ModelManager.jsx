import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, FileText, Upload } from 'lucide-react';
import api from '../../utils/api';

export default function ModelManager({ modelName, title, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const endpoint = `/api/v1/admin/${modelName}`;

  // Fetch Items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(`Failed to fetch ${modelName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    closeForm();
  }, [modelName]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    const initialData = {};
    fields.forEach(f => {
      initialData[f.name] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormData(initialData);
    setMsg('');
  };

  const handleCreateNew = () => {
    closeForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item._id || item.id);
    const editData = { id: item._id || item.id };
    fields.forEach(f => {
      editData[f.name] = item[f.name] !== undefined ? item[f.name] : '';
    });
    setFormData(editData);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`${endpoint}?id=${id}`);
      setItems(items.filter(item => (item._id || item.id) !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? checked : value;
    
    // Auto slug generation if modifying title
    const updates = { [name]: finalVal };
    if (name === 'title' && formData.slug !== undefined && !editingId) {
      updates.slug = finalVal
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      let res;
      if (editingId) {
        res = await api.put(endpoint, formData);
      } else {
        res = await api.post(endpoint, formData);
      }
      
      if (res.data.success) {
        setMsg('✅ Saved successfully!');
        setTimeout(() => {
          closeForm();
          fetchItems();
        }, 800);
      } else {
        setMsg('❌ Save failed.');
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title section */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{title} Manager</h1>
          <p className="text-slate-400 text-xs mt-1">Add, update, or remove entries from database collections.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/10 transition"
          >
            <Plus size={16} />
            Add New Item
          </button>
        )}
      </div>

      {/* Editor Form Panel */}
      {isFormOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="font-bold text-md text-white">
              {editingId ? 'Edit Entry Details' : 'Create New Entry'}
            </h3>
            <button onClick={closeForm} className="text-slate-400 hover:text-white transition p-1">
              <X size={20} />
            </button>
          </div>

          {msg && (
            <div className={`p-4 rounded-xl text-xs font-semibold border ${
              msg.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(f => {
                if (f.type === 'textarea') return null; // Handle separately below
                if (f.type === 'checkbox') return null; // Handle separately below

                return (
                  <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    {f.type === 'image' ? (
                      <div className="space-y-2">
                        <input
                          required={f.required}
                          type="text"
                          name={f.name}
                          value={formData[f.name] || ''}
                          onChange={handleChange}
                          placeholder={f.placeholder || 'https://example.com/image.jpg'}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium placeholder-slate-700 transition"
                        />
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3.5 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                            <Upload size={12} />
                            Upload Image File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const uploadData = new FormData();
                                uploadData.append('image', file);
                                try {
                                  setMsg('Uploading image, please wait...');
                                  const res = await api.post('/api/v1/admin/upload', uploadData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                  });
                                  if (res.data.success && res.data.url) {
                                    setFormData(prev => ({ ...prev, [f.name]: res.data.url }));
                                    setMsg('Image uploaded successfully!');
                                    setTimeout(() => setMsg(''), 3000);
                                  }
                                } catch (err) {
                                  console.error('Failed to upload file:', err);
                                  setMsg('Upload failed: ' + (err.response?.data?.error || err.message));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-slate-500 font-medium">Or choose a file from your device</span>
                        </div>
                      </div>
                    ) : f.type === 'select' ? (
                      <select
                        name={f.name}
                        value={formData[f.name] || ''}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold"
                      >
                        {f.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        required={f.required}
                        type={f.type || 'text'}
                        name={f.name}
                        value={formData[f.name] || ''}
                        onChange={handleChange}
                        placeholder={f.placeholder || ''}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium placeholder-slate-700 transition"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Checkboxes layout */}
            <div className="flex flex-wrap gap-6">
              {fields.filter(f => f.type === 'checkbox').map(f => (
                <label key={f.name} className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="checkbox"
                    name={f.name}
                    checked={!!formData[f.name]}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200">{f.label}</span>
                    {f.description && <p className="text-[10px] text-slate-500 font-medium mt-0.5">{f.description}</p>}
                  </div>
                </label>
              ))}
            </div>

            {/* Textareas layout */}
            {fields.filter(f => f.type === 'textarea').map(f => (
              <div key={f.name}>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  required={f.required}
                  name={f.name}
                  value={formData[f.name] || ''}
                  onChange={handleChange}
                  rows={f.rows || 6}
                  placeholder={f.placeholder || ''}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium placeholder-slate-700 font-mono resize-none"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={closeForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
              >
                <Check size={14} />
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Table Panel */}
      {!isFormOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span>Syncing database...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No entries found. Click "Add New Item" to populate.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <th className="p-5">Identifier / Name</th>
                    {fields.some(f => f.name === 'slug') && <th className="p-5">Slug</th>}
                    {fields.some(f => f.name === 'status') && <th className="p-5">Status</th>}
                    <th className="p-5">Created Date</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-semibold text-slate-300">
                  {items.map((item) => {
                    const itemId = item._id || item.id;
                    const primaryField = fields[0]?.name;
                    return (
                      <tr key={itemId} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-5 font-bold text-white">
                          {item[primaryField] || 'Unnamed'}
                        </td>
                        {fields.some(f => f.name === 'slug') && (
                          <td className="p-5 text-slate-400 font-mono">{item.slug || '/'}</td>
                        )}
                        {fields.some(f => f.name === 'status') && (
                          <td className="p-5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'PUBLISHED' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        )}
                        <td className="p-5 text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-right space-x-1.5">
                          <button 
                            onClick={() => handleEditClick(item)}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-2 rounded-lg transition inline-flex items-center"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(itemId)}
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
      )}

    </div>
  );
}
