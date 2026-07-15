import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function States() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/public/states')
      .then(res => {
        setStates(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load states:', err);
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
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Schemes State-Wise</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Click on a state below to view region-specific state government schemes and programs.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {states.map((st) => (
          <Link 
            key={st._id} 
            to={`/state/${st.slug}`}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-4 flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              {st.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition text-sm">{st.name}</h3>
            {st.hindiName && <span className="text-[10px] text-gray-400 mt-1 font-medium">{st.hindiName}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
