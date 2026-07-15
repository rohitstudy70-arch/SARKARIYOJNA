import React, { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, Globe, User, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navRef = useRef(null);

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
                Sarkari Yojana
              </span>
              <p className="text-[10px] text-gray-500 font-medium -mt-1 tracking-wider uppercase">Info Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/schemes" className={activeStyle}>Schemes</NavLink>
            <NavLink to="/jobs" className={activeStyle}>Jobs</NavLink>
            <NavLink to="/results" className={activeStyle}>Results</NavLink>
            <NavLink to="/admit-cards" className={activeStyle}>Admit Cards</NavLink>
            <NavLink to="/news" className={activeStyle}>News</NavLink>
            <NavLink to="/blogs" className={activeStyle}>Blogs</NavLink>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2">
              Contact
            </Link>
            <Link 
              to="/admin/login" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <User size={14} />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
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
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Home</Link>
          <Link to="/schemes" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Browse Schemes</Link>
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Govt Jobs</Link>
          <Link to="/results" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Exam Results</Link>
          <Link to="/admit-cards" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Admit Cards</Link>
          <Link to="/news" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Latest News</Link>
          <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Blogs</Link>
          <hr className="my-2 border-gray-100" />
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-700 font-semibold">Contact Us</Link>
          <Link 
            to="/admin/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-3 rounded-xl bg-blue-600 text-white font-semibold text-center mt-4"
          >
            Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
