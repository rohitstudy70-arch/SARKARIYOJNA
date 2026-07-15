import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/public/categories')
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Schemes By Category</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Explore central and state programs structured under functional departments.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat._id} 
            to={`/category/${cat.slug}`}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-4 flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              {cat.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition text-sm">{cat.name}</h3>
            {cat.hindiName && <span className="text-[10px] text-gray-400 mt-1 font-medium">{cat.hindiName}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
