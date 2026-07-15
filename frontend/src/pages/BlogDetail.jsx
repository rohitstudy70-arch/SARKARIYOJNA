import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import api from '../utils/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/public/blogs/${slug}`)
      .then(res => {
        setItem(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog details:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow max-w-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
          <Link to="/blogs" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <Link to="/blogs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 mb-6 bg-white border px-3 py-2 rounded-xl transition">
        <ArrowLeft size={12} />
        Back to Blogs List
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100/60 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">{item.title}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 font-semibold">
            <Calendar size={14} />
            <span>Published: {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div 
          className="prose max-w-none text-gray-700 text-sm leading-loose whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    </div>
  );
}
