import React, { useEffect, useRef, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, Globe, User, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';
import { LanguageContext } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navRef = useRef(null);
  const { language, toggleLanguage, t } = useContext(LanguageContext);
  const [navSettings, setNavSettings] = React.useState({
    showNavSchemes: true,
    showNavJobs: true,
    showNavResults: true,
    showNavAdmitCards: true,
    showNavNews: true,
    showNavBlogs: true,
    showNavHome: true,
    showNavContact: true,
    showNavAdmin: true
  });

  // Fetch visibility settings from backend
  useEffect(() => {
    api.get('/api/v1/public/settings')
      .then(res => {
        const data = res.data || {};
        setNavSettings({
          showNavSchemes: data.showNavSchemes !== 'false',
          showNavJobs: data.showNavJobs !== 'false',
          showNavResults: data.showNavResults !== 'false',
          showNavAdmitCards: data.showNavAdmitCards !== 'false',
          showNavNews: data.showNavNews !== 'false',
          showNavBlogs: data.showNavBlogs !== 'false',
          showNavHome: data.showNavHome !== 'false',
          showNavContact: data.showNavContact !== 'false',
          showNavAdmin: data.showNavAdmin !== 'false'
        });
      })
      .catch(err => {
        console.error('Failed to load nav visibility settings:', err);
      });
  }, []);

  // GSAP animation on component mount
  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const activeStyle = ({ isActive }) => 
    `text-sm font-semibold transition px-3 py-2 rounded-lg ${
      isActive 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full glass-panel shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              SY
            </div>
            <div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                {language === 'en' ? 'Sarkari Yojana' : 'सरकारी योजना'}
              </span>
              <p className="text-[10px] text-gray-500 font-medium -mt-1 tracking-wider uppercase">
                {language === 'en' ? 'Info Portal' : 'सूचना पोर्टल'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navSettings.showNavHome && <NavLink to="/" className={activeStyle}>{t('home')}</NavLink>}
            {navSettings.showNavSchemes && <NavLink to="/schemes" className={activeStyle}>{language === 'en' ? 'Schemes' : 'योजनाएं'}</NavLink>}
            {navSettings.showNavJobs && <NavLink to="/jobs" className={activeStyle}>{t('latestJobs')}</NavLink>}
            {navSettings.showNavResults && <NavLink to="/results" className={activeStyle}>{t('results')}</NavLink>}
            {navSettings.showNavAdmitCards && <NavLink to="/admit-cards" className={activeStyle}>{t('admitCards')}</NavLink>}
            {navSettings.showNavNews && <NavLink to="/news" className={activeStyle}>{language === 'en' ? 'News' : 'समाचार'}</NavLink>}
            {navSettings.showNavBlogs && <NavLink to="/blogs" className={activeStyle}>{language === 'en' ? 'Blogs' : 'ब्लॉग'}</NavLink>}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl transition duration-200"
            >
              <Globe size={14} className="text-blue-600" />
              {language === 'en' ? 'हिन्दी (Hindi)' : 'English'}
            </button>

            {navSettings.showNavContact && (
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2">
                {language === 'en' ? 'Contact' : 'संपर्क'}
              </Link>
            )}
            {navSettings.showNavAdmin && (
              <Link 
                to="/admin/login" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm hover:shadow flex items-center gap-1.5"
              >
                <User size={14} />
                {language === 'en' ? 'Admin Portal' : 'एडमिन पोर्टल'}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl transition"
            >
              <Globe size={14} className="text-blue-600" />
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-800 p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-gray-100 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-lg">
          {navSettings.showNavHome && <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{t('home')}</Link>}
          {navSettings.showNavSchemes && <Link to="/schemes" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{language === 'en' ? 'Browse Schemes' : 'योजनाएं खोजें'}</Link>}
          {navSettings.showNavJobs && <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{t('latestJobs')}</Link>}
          {navSettings.showNavResults && <Link to="/results" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{t('results')}</Link>}
          {navSettings.showNavAdmitCards && <Link to="/admit-cards" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{t('admitCards')}</Link>}
          {navSettings.showNavNews && <Link to="/news" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{language === 'en' ? 'Latest News' : 'समाचार'}</Link>}
          {navSettings.showNavBlogs && <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{language === 'en' ? 'Blogs' : 'ब्लॉग'}</Link>}
          <hr className="my-2 border-gray-100" />
          {navSettings.showNavContact && <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">{language === 'en' ? 'Contact Us' : 'संपर्क करें'}</Link>}
          {navSettings.showNavAdmin && (
            <Link 
              to="/admin/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 rounded-xl bg-blue-600 text-white font-semibold text-center mt-4"
            >
              {language === 'en' ? 'Admin Portal' : 'एडमिन पोर्टल'}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
