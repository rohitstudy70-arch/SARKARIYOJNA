import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../../utils/api';

export default function SchemeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);

  const [formData, setFormData] = useState({
    title: '', hindiName: '', slug: '', shortDesc: '', content: '',
    eligibility: '', benefits: '', documents: '', applicationProcess: '',
    officialLinks: '', images: '', seoTitle: '', seoDesc: '', keywords: '',
    status: 'PUBLISHED', category: '', state: '',
    featured: false, trending: false, popular: false, priorityOrder: 0
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          api.get('/api/v1/admin/categories'),
          api.get('/api/v1/admin/states')
        ]);
        setCategories(catRes.data);
        setStates(stateRes.data);
      } catch (err) {
        console.error('Failed to load form dependencies:', err);
      }
    };

    loadDependencies();

    if (id) {
      setFetchingData(true);
      api.get(`/api/v1/admin/schemes?id=${id}`)
        .then(res => {
          const s = res.data;
          setFormData({
            title: s.title || '',
            hindiName: s.hindiName || '',
            slug: s.slug || '',
            shortDesc: s.shortDesc || '',
            content: s.content || '',
            eligibility: s.eligibility || '',
            benefits: s.benefits || '',
            documents: s.documents || '',
            applicationProcess: s.applicationProcess || '',
            officialLinks: s.officialLinks || '',
            images: s.images || '',
            status: s.status || 'PUBLISHED',
            category: s.category?._id || s.category || '',
            state: s.state?._id || s.state || '',
            featured: !!s.featured,
            trending: !!s.trending,
            popular: !!s.popular,
            priorityOrder: s.priorityOrder || 0
          });
          
          if (s.images) {
            try {
              const imgs = JSON.parse(s.images);
              if (Array.isArray(imgs) && imgs[0]) setImagePreview(imgs[0]);
            } catch {
              if (s.images.startsWith('http')) setImagePreview(s.images);
            }
          }
          setFetchingData(false);
        })
        .catch(() => setFetchingData(false));
    }
  }, [id]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const updates = { title };
    if (!id) {
      updates.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: finalVal }));
    
    if (name === 'images' && value.startsWith('http')) {
      setImagePreview(value.split(',')[0].trim());
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setSaveMsg('Uploading image, please wait...');
      const res = await api.post('/api/v1/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.url) {
        setFormData(prev => ({ ...prev, images: res.data.url }));
        setImagePreview(res.data.url);
        setSaveMsg('Image uploaded successfully!');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      setSaveMsg('Image upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMsg('');

    const payload = { ...formData };
    if (id) payload.id = id;

    // Convert images list into JSON array if comma separated
    if (payload.images && !payload.images.startsWith('[')) {
      const arr = payload.images.split(',').map(s => s.trim()).filter(Boolean);
      payload.images = JSON.stringify(arr);
    }

    // Set null references if values are empty
    if (!payload.category) payload.category = null;
    if (!payload.state) payload.state = null;

    try {
      let res;
      if (id) {
        res = await api.put('/api/v1/admin/schemes', payload);
      } else {
        res = await api.post('/api/v1/admin/schemes', payload);
      }
      
      if (res.data.success) {
        setSaveMsg('✅ Scheme saved successfully!');
        setTimeout(() => navigate('/admin/schemes'), 1000);
      } else {
        setSaveMsg('❌ Failed to save scheme.');
      }
    } catch (err) {
      setSaveMsg(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center p-20 min-h-[60vh] text-slate-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mr-3"></div>
        <span>Loading Yojana Details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-20">
      
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/admin/schemes" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2.5 rounded-xl text-slate-300 transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {id ? 'Edit Scheme Details' : 'Publish New Scheme'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">Fill out the information below to update the mobile app catalog.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/10 transition disabled:opacity-50"
        >
          <Save size={14} />
          {loading ? 'Saving...' : 'Save Yojana'}
        </button>
      </div>

      {saveMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold border ${
          saveMsg.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {saveMsg}
        </div>
      )}

      {/* ============ SECTION 1: BASIC ============ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles size={16} className="text-blue-500" />
          Yojana Basic Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Scheme Name (English) *</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. PM Kisan Samman Nidhi"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Scheme Name (Hindi)</label>
            <input
              name="hindiName"
              value={formData.hindiName}
              onChange={handleChange}
              placeholder="e.g. पीएम किसान सम्मान निधि"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">URL Slug *</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
              <span className="bg-slate-900 border-r border-slate-800 px-3.5 py-3 text-slate-500 text-xs font-mono">/yojana/</span>
              <input
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="pm-kisan-samman-nidhi"
                className="flex-1 bg-transparent px-3.5 py-3 text-sm text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Publishing Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold"
            >
              <option value="PUBLISHED">Published (App me dikhe)</option>
              <option value="DRAFT">Draft (Chhupa rahega)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Yojana Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold"
            >
              <option value="">-- Choose Category --</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">State Jurisdiction</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold"
            >
              <option value="">-- Central Government (No State) --</option>
              {states.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============ SECTION 2: IMAGES ============ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <ImageIcon size={16} className="text-purple-500" />
          Yojana Banner Image
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Image Link URL</label>
            <input
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://example.com/yojana-image.jpg"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold transition mb-3"
            />
            
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md uppercase tracking-wider">
                <Upload size={12} />
                Upload Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Or choose a file from your device</span>
            </div>

            <p className="text-[10px] text-slate-500 font-medium mt-3 leading-relaxed">
              💡 Provide direct photo URL, or upload from your computer to save locally on the server.
            </p>
          </div>
          <div>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Form Preview"
                className="w-full h-36 object-cover rounded-2xl border border-slate-800"
                onError={() => setImagePreview('')}
              />
            ) : (
              <div className="w-full h-36 bg-slate-950 rounded-2xl border border-dashed border-slate-850 flex flex-col items-center justify-center text-slate-600">
                <ImageIcon size={32} />
                <span className="text-[10px] font-semibold mt-2">Preview Image URL here</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ SECTION 3: JANKARI ============ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <ImageIcon size={16} className="text-emerald-500" />
          Yojana Descriptions & Details
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Short description *</label>
            <textarea
              required
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              rows={3}
              placeholder="Write a 2-line simple summary..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Full Description / About (HTML Allowed)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              placeholder="Write complete scheme information..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-mono resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Eligibility (Patrata / Rules)</label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows={4}
              placeholder="Who is eligible to apply?"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Scheme Benefits (Labh)</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              placeholder="What are the financial or social benefits?"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Required Documents (Zaruri Kagzat)</label>
            <textarea
              name="documents"
              value={formData.documents}
              onChange={handleChange}
              rows={4}
              placeholder="List required documents (e.g. Aadhar card, Ration card)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">How to Apply (Process)</label>
            <textarea
              name="applicationProcess"
              value={formData.applicationProcess}
              onChange={handleChange}
              rows={4}
              placeholder="Step-by-step instructions to register..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Official Portal Website Link</label>
            <input
              name="officialLinks"
              value={formData.officialLinks}
              onChange={handleChange}
              placeholder="https://pmkisan.gov.in"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold transition"
            />
          </div>
        </div>
      </div>

      {/* ============ SECTION 4: TAGS ============ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <ImageIcon size={16} className="text-orange-500" />
          Tags & Priority
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Flags</label>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">⭐ Featured</span>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Dikhaye on Home Page featured section</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">🔥 Trending</span>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Dikhaye on Home Page trending section</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-200">👑 Popular</span>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Dikhaye on Home Page popular section</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Priority Order Number</label>
            <input
              type="number"
              name="priorityOrder"
              value={formData.priorityOrder}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white font-semibold transition"
            />
            <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed">
              Higher value translates to sorting the item first (value between 0 to 100).
            </p>
          </div>
        </div>
      </div>

    </form>
  );
}
