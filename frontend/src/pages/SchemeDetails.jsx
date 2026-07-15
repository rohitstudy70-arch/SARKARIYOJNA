import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, FileText, CheckCircle, HelpCircle, ExternalLink, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../utils/api';

export default function SchemeDetails() {
  const { slug } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  
  const contentRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/v1/public/schemes/${slug}`)
      .then(res => {
        setScheme(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load scheme details:', err);
        setLoading(false);
      });
  }, [slug]);

  // Animate tab content change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activeTab, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-semibold">Scheme details loading...</p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow border border-gray-100 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scheme Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The scheme you are looking for might have been archived or deleted.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Parse images if stored as JSON string
  let imagesArr = [];
  try {
    if (scheme.images) {
      if (scheme.images.startsWith('[')) {
        imagesArr = JSON.parse(scheme.images);
      } else {
        imagesArr = scheme.images.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  } catch (e) {
    if (scheme.images.startsWith('http')) {
      imagesArr = [scheme.images];
    }
  }

  const tabStyle = (tab) => 
    `flex items-center gap-2 pb-4 font-bold text-sm border-b-2 transition ${
      activeTab === tab 
        ? 'border-blue-600 text-blue-600' 
        : 'border-transparent text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="pb-24 bg-[#fafafa]">
      
      {/* Header Info Panel */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-12 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100 hover:text-white bg-white/10 px-3.5 py-2 rounded-xl mb-6 transition">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {scheme.category && (
                  <Link to={`/category/${scheme.category.slug}`} className="bg-white/15 hover:bg-white/20 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider transition">
                    📁 {scheme.category.name}
                  </Link>
                )}
                {scheme.state && (
                  <Link to={`/state/${scheme.state.slug}`} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider transition border border-amber-400/20">
                    📍 {scheme.state.name}
                  </Link>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                {scheme.title}
              </h1>
              {scheme.hindiName && (
                <p className="text-lg text-blue-100 font-semibold tracking-wide font-hindi leading-relaxed">
                  {scheme.hindiName}
                </p>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <div className="text-center">
                <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">Views</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1.5 mt-1">
                  <Eye size={16} />
                  {scheme.views || 100}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">Status</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1.5 mt-1">
                  <CheckCircle size={16} className="text-emerald-400" />
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contents Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Tab Contents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            
            {/* Tabs Selector */}
            <div className="flex items-center gap-6 border-b border-gray-100 mb-6 overflow-x-auto">
              <button onClick={() => setActiveTab('about')} className={tabStyle('about')}>
                About Scheme
              </button>
              <button onClick={() => setActiveTab('eligibility')} className={tabStyle('eligibility')}>
                Eligibility & Benefits
              </button>
              <button onClick={() => setActiveTab('documents')} className={tabStyle('documents')}>
                Required Documents
              </button>
              <button onClick={() => setActiveTab('apply')} className={tabStyle('apply')}>
                How to Apply
              </button>
            </div>

            {/* Tab Body */}
            <div ref={contentRef} className="prose max-w-none text-gray-700 text-sm leading-relaxed space-y-4">
              {activeTab === 'about' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Layers size={18} className="text-blue-600" /> Description
                  </h3>
                  <div 
                    className="space-y-4 font-normal"
                    dangerouslySetInnerHTML={{ __html: scheme.content || scheme.shortDesc }}
                  />
                  {imagesArr.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {imagesArr.map((url, i) => (
                        <img 
                          key={i} 
                          src={url} 
                          alt={`Scheme visual ${i+1}`} 
                          className="w-full h-48 object-cover rounded-xl border border-gray-100 shadow-sm" 
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'eligibility' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <h3 className="text-md font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <ShieldCheck size={18} /> Patrata (Eligibility Criteria)
                    </h3>
                    <p className="whitespace-pre-line text-xs text-blue-950 font-medium leading-relaxed">
                      {scheme.eligibility || 'All citizens with required age/income limits.'}
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                    <h3 className="text-md font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <CheckCircle size={18} /> Scheme Benefits (Labh)
                    </h3>
                    <p className="whitespace-pre-line text-xs text-emerald-950 font-medium leading-relaxed">
                      {scheme.benefits || 'Direct bank transfers, free training support, or subvention subsidies.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-600" /> Required Documents (Zaruri Kagzat)
                  </h3>
                  <p className="whitespace-pre-line text-xs font-semibold text-gray-600 bg-gray-50 p-5 rounded-2xl border border-gray-200/50 leading-loose">
                    {scheme.documents || '1. Aadhar Card\n2. Passport Size Photograph\n3. Bank Account Passbook\n4. Mobile Number linked with Aadhar'}
                  </p>
                </div>
              )}

              {activeTab === 'apply' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <HelpCircle size={18} className="text-purple-600" /> Step-by-Step Application Process
                  </h3>
                  <p className="whitespace-pre-line text-xs font-medium text-gray-600 leading-loose">
                    {scheme.applicationProcess || '1. Visit the official portal.\n2. Click on the Apply Now / Registration link.\n3. Fill in the personal details.\n4. Upload the scanned copy of documents.\n5. Click on submit and download the receipt.'}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right: Sidebar Action Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-6">
            <h3 className="font-bold text-gray-800 text-lg">Apply Online Portal</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ensure you possess all required documents and satisfy the eligibility criterias before initiating registration.
            </p>
            {scheme.officialLinks ? (
              <a 
                href={scheme.officialLinks} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                Go to Official Website
                <ExternalLink size={16} />
              </a>
            ) : (
              <button 
                disabled 
                className="w-full bg-gray-100 text-gray-400 font-bold text-sm py-3.5 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
              >
                No Official Link Provided
              </button>
            )}
            <div className="text-[10px] text-gray-400">
              ⚠️ Alert: Apply only on the official government website (`.gov.in` or `.nic.in` domains). Never make payments on third-party sites.
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
