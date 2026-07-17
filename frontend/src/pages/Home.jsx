import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Flame, Award, Eye, ArrowRight, ArrowUpRight, AwardIcon } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../utils/api';
import { LanguageContext } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { language, t } = useContext(LanguageContext);
  const [data, setData] = useState({
    banners: [], featured: [], trending: [], popular: [], categories: [], states: [], announcements: []
  });
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const navigate = useNavigate();

  const getSchemeTitle = (scheme) => {
    return (language === 'hi' && scheme.hindiName) ? scheme.hindiName : scheme.title;
  };

  const getSchemeSubtitle = (scheme) => {
    return (language === 'hi' && scheme.hindiName) ? scheme.title : scheme.hindiName;
  };

  const heroRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Fetch Homepage Data
    api.get('/api/v1/public/home')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load homepage data:', err);
        setLoading(false);
      });
  }, []);

  // GSAP animation when data loading completes
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();
      tl.fromTo(heroRef.current.querySelector('.hero-title'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      )
      .fromTo(heroRef.current.querySelector('.hero-desc'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(heroRef.current.querySelector('.search-bar'),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.75)' },
        '-=0.2'
      )
      .fromTo('.category-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.1'
      )
      .fromTo('.scheme-card',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
        '-=0.2'
      );

      // ScrollTrigger scroll animations
      gsap.fromTo('.trending-section-col',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.trending-section-col',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      
      gsap.fromTo('.popular-section-col',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.popular-section-col',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.naukri-grid-col',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.naukri-grid-col',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.state-badge-item',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.state-badge-item',
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [loading]);

  // Slide cycle interval
  useEffect(() => {
    if (data.banners && data.banners.length > 1) {
      const interval = setInterval(() => {
        // Trigger fade out before updating index
        gsap.to('.hero-banner-content', {
          opacity: 0,
          y: -15,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentBannerIdx((prev) => (prev + 1) % data.banners.length);
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data.banners]);

  // Slide transition animation
  useEffect(() => {
    if (data.banners && data.banners.length > 0) {
      gsap.fromTo('.hero-banner-content',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.hero-banner-image',
        { scale: 1.05, opacity: 0.3 },
        { scale: 1, opacity: 0.6, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, [currentBannerIdx]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/schemes?search=${encodeURIComponent(searchVal)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="font-bold text-gray-700">All Sarkari Yojana data loading...</h2>
        </div>
      </div>
    );
  }

  const activeBanner = data.banners && data.banners[currentBannerIdx];

  return (
    <div className="pb-24 bg-[#fafafa]">
      
      {/* Announcements Marquee */}
      {data.announcements && data.announcements.length > 0 && (
        <div className="bg-amber-500 text-slate-900 py-2.5 overflow-hidden border-b border-amber-600">
          <div className="whitespace-nowrap flex items-center justify-center gap-10 animate-marquee text-sm font-bold">
            {data.announcements.map((ann, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>{ann.title}</span>
                {ann.link && (
                  <Link to={ann.link} className="underline text-red-800 text-xs ml-1 hover:text-black">
                    Check Now &rarr;
                  </Link>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeBanner ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[340px] md:h-[450px] bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900">
            <img 
              src={activeBanner.imageUrl} 
              alt={activeBanner.title} 
              className="hero-banner-image absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 hover:scale-105 transition-transform duration-[8s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
              <div className="hero-banner-content max-w-3xl">
                <span className="bg-blue-600 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">
                  {language === 'en' ? 'Trending Updates' : 'ट्रेंडिंग अपडेट्स'}
                </span>
                <h1 className="hero-title text-3xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                  {activeBanner.title}
                </h1>
                <p className="hero-desc text-slate-200 text-sm sm:text-lg mb-6 leading-relaxed opacity-90 max-w-2xl font-light">
                  {language === 'en' 
                    ? 'Search & find all Indian state and central government scheme benefits, documents required, and check eligibility inside.'
                    : 'सभी भारतीय राज्य और केंद्र सरकार की योजना के लाभों, आवश्यक दस्तावेजों की खोज करें और पात्रता की जांच करें।'}
                </p>
                
                {/* Search Bar inside Hero */}
                <form onSubmit={handleSearchSubmit} className="search-bar flex items-center bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 max-w-xl">
                  <div className="pl-3 text-gray-400">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                  />
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm">
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* Carousel Slide Indicators */}
            {data.banners.length > 1 && (
              <div className="absolute top-6 right-6 flex gap-1.5 z-20 bg-slate-950/40 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                {data.banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      gsap.to('.hero-banner-content', {
                        opacity: 0,
                        y: -10,
                        duration: 0.25,
                        onComplete: () => {
                          setCurrentBannerIdx(idx);
                        }
                      });
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentBannerIdx === idx ? 'bg-blue-500 w-6' : 'bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
            <h1 className="hero-title text-4xl font-extrabold mb-4">
              {language === 'en' ? 'Find All Government Schemes' : 'सभी सरकारी योजनाएं खोजें'}
            </h1>
            <p className="hero-desc text-blue-100 mb-6 max-w-2xl">
              {language === 'en' 
                ? 'Read detailed descriptions, documents required, eligibility criterion and step-by-step application instructions.'
                : 'विस्तृत विवरण, आवश्यक दस्तावेज, पात्रता मानदंड और आवेदन के चरणों की जानकारी प्राप्त करें।'}
            </p>
            <form onSubmit={handleSearchSubmit} className="search-bar flex items-center bg-white p-1 rounded-2xl shadow-lg max-w-lg">
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 focus:outline-none" 
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">
                {t('searchButton')}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-7 rounded-full bg-blue-600 inline-block"></span>
              {language === 'en' ? 'Browse Categories' : 'श्रेणियां देखें'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {language === 'en' ? 'Explore yojanas categorized by their functional sectors' : 'विभिन्न क्षेत्रों के अनुसार वर्गीकृत योजनाओं का पता लगाएं'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {data.categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/category/${cat.slug}`} 
              className="category-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100/80 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-4 flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {(language === 'hi' && cat.hindiName ? cat.hindiName : cat.name).charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition text-sm">
                {language === 'hi' && cat.hindiName ? cat.hindiName : cat.name}
              </h3>
              {cat.hindiName && language === 'en' && <span className="text-[10px] text-gray-400 mt-1 font-medium">{cat.hindiName}</span>}
              {cat.hindiName && language === 'hi' && <span className="text-[10px] text-gray-400 mt-1 font-medium">{cat.name}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-7 rounded-full bg-emerald-500 inline-block"></span>
              {language === 'en' ? 'Featured Schemes' : 'विशेष योजनाएं'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {language === 'en' ? 'Recommended central and state programs' : 'केंद्र और राज्य सरकार की अनुशंसित योजनाएं'}
            </p>
          </div>
          <Link to="/schemes" className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center gap-1">
            {language === 'en' ? 'View All' : 'सभी देखें'} <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.featured.map((scheme) => (
            <div 
              key={scheme._id} 
              className="scheme-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {language === 'hi' && scheme.category?.hindiName ? scheme.category.hindiName : (scheme.category?.name || 'General')}
                  </span>
                  {scheme.state && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {language === 'hi' && scheme.state.hindiName ? scheme.state.hindiName : scheme.state.name}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
                  {getSchemeTitle(scheme)}
                </h3>
                {getSchemeSubtitle(scheme) && (
                  <p className="text-xs text-gray-500 mb-3 font-medium font-hindi">{getSchemeSubtitle(scheme)}</p>
                )}
                <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                  {scheme.shortDesc}
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100/60 flex justify-between items-center text-xs font-semibold text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-200">
                <Link to={`/yojana/${scheme.slug}`} className="w-full flex justify-between items-center">
                  <span>{language === 'en' ? 'View Details' : 'विवरण देखें'}</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending & Popular Combined */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Trending Column */}
        <div className="trending-section-col">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-6">
            <Flame className="text-orange-500" fill="orange" size={20} />
            {t('trendingSchemes')}
          </h2>
          <div className="space-y-4">
            {data.trending.slice(0, 5).map((scheme, idx) => (
              <Link 
                key={scheme._id} 
                to={`/yojana/${scheme.slug}`}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow transition duration-200 group"
              >
                <span className="text-2xl font-black text-slate-300 w-8 text-center group-hover:text-orange-500 transition-colors">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition leading-snug">
                    {getSchemeTitle(scheme)}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1">{scheme.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Column */}
        <div className="popular-section-col">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-6">
            <Award className="text-blue-500" size={20} />
            {t('popularInitiatives')}
          </h2>
          <div className="space-y-4">
            {data.popular.slice(0, 5).map((scheme, idx) => (
              <Link 
                key={scheme._id} 
                to={`/yojana/${scheme.slug}`}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow transition duration-200 group"
              >
                <span className="text-2xl font-black text-slate-300 w-8 text-center group-hover:text-blue-500 transition-colors">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition leading-snug">
                    {getSchemeTitle(scheme)}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1">{scheme.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* Sarkari Result Columns Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('naukriPortalTitle')}
          </h2>
          <p className="text-slate-500 text-sm mt-2">{t('naukriPortalDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Latest Jobs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('latestJobs')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('newTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.jobs && data.jobs.length > 0 ? (
                data.jobs.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/jobs/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 2: Admit Cards */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('admitCards')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('outTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.admitCards && data.admitCards.length > 0 ? (
                data.admitCards.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/admit-cards/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-purple-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 3: Results */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('results')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('liveTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.results && data.results.length > 0 ? (
                data.results.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/results/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-emerald-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 4: Answer Keys */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('answerKeys')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('keysTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.answerKeys && data.answerKeys.length > 0 ? (
                data.answerKeys.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/answer-keys/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-amber-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 5: Syllabus */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('syllabus')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('examTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.syllabus && data.syllabus.length > 0 ? (
                data.syllabus.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/syllabus/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-teal-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 6: Admissions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('admissions')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('applyTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.admissions && data.admissions.length > 0 ? (
                data.admissions.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/admissions/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-rose-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 7: Document Verification */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('documents')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('docsTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.documents && data.documents.length > 0 ? (
                data.documents.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    <Link 
                      to={`/documents/${item.slug}`} 
                      className="text-xs font-semibold text-slate-800 hover:text-indigo-600 transition leading-snug block"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No updates available</p>
              )}
            </div>
          </div>

          {/* Column 8: Important Alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[480px] naukri-grid-col">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-4 text-white font-bold flex justify-between items-center text-xs sm:text-sm">
              <span>{t('alerts')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-extrabold tracking-wider">{t('alertTag')}</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-50">
              {data.announcements && data.announcements.length > 0 ? (
                data.announcements.map((item) => (
                  <div key={item._id} className="pt-2.5 first:pt-0">
                    {item.link ? (
                      <Link 
                        to={item.link} 
                        className="text-xs font-semibold text-slate-800 hover:text-red-600 transition leading-snug block animate-pulse"
                      >
                        {item.title} &rarr;
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-slate-800 leading-snug block">{item.title}</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No announcements available</p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Central/State Toggle section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 sm:p-12 rounded-3xl shadow-xl text-white relative overflow-hidden text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">{t('browseStateWise')}</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 font-light">{t('stateWiseDesc')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.states.map((st) => (
              <Link 
                key={st._id} 
                to={`/state/${st.slug}`} 
                className="bg-white/10 hover:bg-white text-white hover:text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs transition duration-200 border border-white/10 hover:border-transparent state-badge-item"
              >
                {language === 'hi' && st.hindiName ? st.hindiName : st.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
