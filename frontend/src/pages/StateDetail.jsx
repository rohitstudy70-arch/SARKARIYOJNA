import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

export default function StateDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/public/states/${slug}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load state details:', err);
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

  if (!data || !data.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow max-w-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">State Not Found</h2>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Back Home</Link>
        </div>
      </div>
    );
  }

  const { state, schemes } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-12">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">State</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
          {state.name} Schemes {state.hindiName ? `(${state.hindiName})` : ''}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Explore all regional welfare, agricultural, and educational schemes running in {state.name}.</p>
      </div>

      {schemes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500">No schemes are currently active for this State.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {schemes.map((scheme) => (
            <div 
              key={scheme._id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  {scheme.category && (
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {scheme.category.name}
                    </span>
                  )}
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {state.name}
                  </span>
                </div>
                <h3 className="text-md font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {scheme.title}
                </h3>
                {scheme.hindiName && (
                  <p className="text-xs text-gray-500 mb-2 font-hindi">{scheme.hindiName}</p>
                )}
                <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                  {scheme.shortDesc}
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                <Link to={`/yojana/${scheme.slug}`} className="w-full flex justify-between items-center">
                  <span>View Details</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
