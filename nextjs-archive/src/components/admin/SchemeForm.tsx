'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SchemeForm({ schemeId }: { schemeId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    title: '', hindiName: '', slug: '', shortDesc: '', content: '',
    eligibility: '', benefits: '', documents: '', applicationProcess: '',
    officialLinks: '', images: '', seoTitle: '', seoDesc: '', keywords: '',
    status: 'PUBLISHED', categoryId: '', stateId: '',
    featured: false, trending: false, popular: false, priorityOrder: 0
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/categories').then(r => r.json()).then(setCategories).catch(() => null);
    fetch('/api/v1/admin/states').then(r => r.json()).then(setStates).catch(() => null);

    if (schemeId) {
      setFetchingData(true);
      fetch(`/api/v1/admin/schemes?id=${schemeId}`)
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) {
            setFormData({
              title: data.title || '',
              hindiName: data.hindiName || '',
              slug: data.slug || '',
              shortDesc: data.shortDesc || '',
              content: data.content || '',
              eligibility: data.eligibility || '',
              benefits: data.benefits || '',
              documents: data.documents || '',
              applicationProcess: data.applicationProcess || '',
              officialLinks: data.officialLinks || '',
              images: data.images || '',
              seoTitle: data.seoTitle || '',
              seoDesc: data.seoDesc || '',
              keywords: data.keywords || '',
              status: data.status || 'PUBLISHED',
              categoryId: data.categoryId || '',
              stateId: data.stateId || '',
              featured: data.featured || false,
              trending: data.trending || false,
              popular: data.popular || false,
              priorityOrder: data.priorityOrder || 0
            });
            // Set image preview from first image URL
            if (data.images) {
              try {
                const imgs = JSON.parse(data.images);
                if (Array.isArray(imgs) && imgs[0]) setImagePreview(imgs[0]);
              } catch {
                if (data.images.startsWith('http')) setImagePreview(data.images);
              }
            }
          }
          setFetchingData(false);
        })
        .catch(() => setFetchingData(false));
    }
  }, [schemeId]);

  // Auto-generate slug from title
  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData((prev: any) => ({ ...prev, title, ...(!schemeId && { slug }) }));
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Image preview update
    if (name === 'images' && value.startsWith('http')) {
      setImagePreview(value.split(',')[0].trim());
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSaveMsg('');

    const method = schemeId ? 'PUT' : 'POST';
    const payload = schemeId ? { id: schemeId, ...formData } : formData;

    // Convert images: if comma separated URLs, store as JSON array
    if (payload.images && !payload.images.startsWith('[')) {
      const imgArr = payload.images.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (imgArr.length > 0) {
        payload.images = JSON.stringify(imgArr);
      }
    }

    const res = await fetch('/api/v1/admin/schemes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    const result = await res.json();

    if (res.ok && result.success) {
      setSaveMsg('✅ Yojana save ho gayi!');
      setTimeout(() => router.push('/portal/myadmin/schemes'), 1000);
    } else {
      setSaveMsg(`❌ Error: ${result.error || 'Save nahi ho payi'}`);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yojana load ho rahi hai...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Save Message */}
      {saveMsg && (
        <div className={`p-4 rounded-lg text-sm font-medium ${saveMsg.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {saveMsg}
        </div>
      )}

      {/* ============ BASIC INFO ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            📝 Yojana Ki Basic Jankari
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Yojana Ka Naam (English) <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. PM Kisan Samman Nidhi"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Yojana Ka Naam (Hindi)
            </label>
            <input
              name="hindiName"
              value={formData.hindiName}
              onChange={handleChange}
              placeholder="e.g. पीएम किसान सम्मान निधि"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="bg-gray-100 px-3 py-2.5 text-gray-500 text-sm border-r border-gray-300">/yojana/</span>
              <input
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="pm-kisan-samman-nidhi"
                className="flex-1 px-3 py-2.5 focus:outline-none text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Title se auto-generate hota hai, change kar sakte ho</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PUBLISHED">✅ Published (App me dikhe)</option>
              <option value="DRAFT">📝 Draft (Chhupa rahega)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Category Select Karo --</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} {c.hindiName ? `(${c.hindiName})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State (Rajya)</label>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Koi State Nahi (Central) --</option>
              {states.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} {s.hindiName ? `(${s.hindiName})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============ PHOTO / IMAGE ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            🖼️ Yojana Ki Photo
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo URL (Image Link)
              </label>
              <input
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Image ka URL paste karo. Multiple photos: comma se alag karo<br />
                e.g. <code className="bg-gray-100 px-1 rounded">https://img1.jpg, https://img2.jpg</code>
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">📌 Free Image Hosting:</p>
                <p className="text-xs text-blue-600 mt-1">
                  ImgBB (imgbb.com), Imgur (imgur.com), ya Google Drive se direct link use karo
                </p>
              </div>
            </div>
            <div>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                    onError={() => setImagePreview('')}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Preview</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">🖼️</span>
                  <span className="text-sm">Image URL daalo preview dekhne ke liye</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ DESCRIPTION & CONTENT ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            📄 Yojana Ki Jankari
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Short Description (Chhota Vivaran) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              rows={3}
              placeholder="Yojana ke baare mein 2-3 line mein batao..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(formData.shortDesc || '').length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Description / About (Poori Jankari)
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              placeholder="Yojana ke baare mein poori jankari likhiye... HTML v use kar sakte ho"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Eligibility (Patrata / Kaun Apply Kar Sakta Hai)
            </label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows={5}
              placeholder="Patrata ki shart likhiye... jaise: 18+ age, BPL family, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Benefits (Labh / Kya Milega)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={5}
              placeholder="Yojana se kya faida milega... jaise: ₹6000/year, free health insurance, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Required Documents (Zaruri Kagzat)
            </label>
            <textarea
              name="documents"
              value={formData.documents}
              onChange={handleChange}
              rows={5}
              placeholder="Kaunse documents chahiye... jaise: Aadhar Card, Ration Card, Bank Passbook, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Application Process (Apply Kaise Kare)
            </label>
            <textarea
              name="applicationProcess"
              value={formData.applicationProcess}
              onChange={handleChange}
              rows={5}
              placeholder="Apply karne ka tarika step by step likhiye..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Official Website Link (Sarkari Website)
            </label>
            <input
              name="officialLinks"
              value={formData.officialLinks}
              onChange={handleChange}
              placeholder="https://pmkisan.gov.in"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* ============ TAGS / FLAGS ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            🏷️ Tags & Priority
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Special Tags:</label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-orange-50 p-3 rounded-lg transition">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <div>
                  <span className="font-medium text-gray-800">⭐ Featured</span>
                  <p className="text-xs text-gray-500">Homepage pe dikhega</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-red-50 p-3 rounded-lg transition">
                <input
                  type="checkbox"
                  name="trending"
                  checked={formData.trending}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-red-500"
                />
                <div>
                  <span className="font-medium text-gray-800">🔥 Trending</span>
                  <p className="text-xs text-gray-500">Trending section mein dikhega</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-800">👑 Popular</span>
                  <p className="text-xs text-gray-500">Popular yojana section mein dikhega</p>
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Order</label>
              <input
                type="number"
                name="priorityOrder"
                value={formData.priorityOrder}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Zyada number = pehle dikhega (0-100)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SEO ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            🔍 SEO Settings (Google Search ke liye)
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Title</label>
              <input
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Google mein kaise dikhega title..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.seoTitle || '').length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
              <input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="pm kisan, kisan yojana, farmer scheme..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
            <textarea
              name="seoDesc"
              value={formData.seoDesc}
              onChange={handleChange}
              rows={3}
              placeholder="Google search mein neeche jo description dikhe..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{(formData.seoDesc || '').length}/160 characters (160 se zyada mat rakho)</p>
          </div>
        </div>
      </div>

      {/* ============ SUBMIT ============ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/portal/myadmin/schemes')}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          ← Wapas Jao
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Save ho raha hai...
            </>
          ) : (
            <>💾 {schemeId ? 'Update Karo' : 'Publish Karo'}</>
          )}
        </button>
      </div>
    </form>
  );
}
