import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare } from 'lucide-react';
import api from '../utils/api';

export default function ResultsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/v1/public/results')
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch results:', err);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
          <CheckSquare size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sarkari Results (Exam Results)</h1>
          <p className="text-gray-500 text-sm mt-1">Check latest recruitment exam results, marks sheets, and direct links to scorecards.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-500">
          No result announcements available.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((resItem) => (
            <Link 
              key={resItem._id} 
              to={`/results/${resItem.slug}`}
              className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100/65 hover:border-emerald-400 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-md font-bold text-gray-800 hover:text-emerald-600 transition">
                {resItem.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 font-medium">
                <Calendar size={14} />
                <span>Published on: {new Date(resItem.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
