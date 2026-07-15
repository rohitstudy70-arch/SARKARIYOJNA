import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

export default function Schemes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const searchVal = searchParams.get('search') || '';
  const [inputVal, setInputVal] = useState(searchVal);

  useEffect(() => {
    setLoading(true);
    const queryStr = searchVal ? `?search=${encodeURIComponent(searchVal)}` : '';
    api.get(`/api/v1/public/schemes${queryStr}`)
      .then(res => {
        setSchemes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load schemes:', err);
        setLoading(false);
      });
  }, [searchVal]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: inputVal });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Government Schemes Search</h1>
          <p className="text-gray-500 text-sm mt-1">Search through {schemes.length} active central and state yojanas.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
          <input
            type="text"
            placeholder="Search schemes by keywords..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-semibold"
          />
          <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white p-16 rounded-2xl border border-gray-100 text-center shadow-sm max-w-md mx-auto">
          <p className="text-gray-500 mb-4 font-semibold">No schemes found matching "{searchVal}"</p>
          <button onClick={() => { setInputVal(''); setSearchParams({}); }} className="text-blue-600 text-sm font-bold hover:underline">
            Clear Search Filter
          </button>
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
                  {scheme.state && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {scheme.state.name}
                    </span>
                  )}
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
