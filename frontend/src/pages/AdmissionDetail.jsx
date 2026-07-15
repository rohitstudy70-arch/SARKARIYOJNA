import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import api from '../utils/api';

export default function AdmissionDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/public/admissions/${slug}`)
      .then(res => {
        setItem(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load admission details:', err);
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admission Details Not Found</h2>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 mb-6 bg-white border px-3 py-2 rounded-xl transition">
        <ArrowLeft size={12} />
        Back to Home
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

        {/* Important Links Section - Sarkari Result Style but Premium */}
        {(item.applyLink || item.officialLink) && (
          <div className="mt-12 border border-rose-100 bg-rose-50/20 rounded-2xl p-6">
            <h3 className="text-md font-extrabold text-rose-950 mb-4 flex items-center gap-2">
              <ExternalLink size={18} className="text-rose-600" /> Useful Important Links Area
            </h3>
            <div className="overflow-hidden border border-gray-200/60 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs sm:text-sm font-semibold">
                <tbody>
                  {item.applyLink && (
                    <tr className="border-b border-gray-100">
                      <td className="p-4 text-gray-700 bg-gray-50/50 w-1/2">Apply Online Registration</td>
                      <td className="p-4">
                        <a 
                          href={item.applyLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-rose-700 transition inline-block uppercase tracking-wider"
                        >
                          Click Here
                        </a>
                      </td>
                    </tr>
                  )}
                  {item.officialLink && (
                    <tr>
                      <td className="p-4 text-gray-700 bg-gray-50/50">Official University Portal</td>
                      <td className="p-4">
                        <a 
                          href={item.officialLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-block uppercase tracking-wider"
                        >
                          Click Here
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
