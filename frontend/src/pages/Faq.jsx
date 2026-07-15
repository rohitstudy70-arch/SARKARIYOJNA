import React, { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    api.get('/api/v1/public/faqs')
      .then(res => {
        setFaqs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load FAQs:', err);
        setLoading(false);
      });
  }, []);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="text-blue-600" />
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Get answers to the most common queries regarding government applications, eligibility documentation, and portal queries.</p>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
          No FAQs are currently available. Check back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={faq._id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex justify-between items-center font-bold text-gray-800 hover:text-blue-600 transition"
                >
                  <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                  {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-gray-600 whitespace-pre-line border-t border-gray-50 pt-4 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
