import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">
                SY
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Sarkari Yojana</span>
            </div>
            <p className="text-sm text-slate-500">
              India's premier scheme information aggregator. Read about latest government benefits, jobs, admit cards, and news in simple words.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Important Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/schemes" className="hover:text-white transition">All Government Schemes</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Government Jobs</Link></li>
              <li><Link to="/results" className="hover:text-white transition">Exam Results</Link></li>
              <li><Link to="/admit-cards" className="hover:text-white transition">Download Admit Cards</Link></li>
            </ul>
          </div>

          {/* Info categories */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Information Portal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/news" className="hover:text-white transition">Latest News Updates</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition">Knowledge Blogs</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition">FAQs & Help</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition">Give Website Feedback</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-4">Contact Info</h4>
            <p className="text-sm text-slate-500 mb-2">
              Email us for inquiries or advertisement slots.
            </p>
            <p className="text-sm text-blue-500 font-semibold mb-4">
              contact@sarkariyojana.app
            </p>
            <p className="text-xs text-slate-600">
              Disclaimer: We are NOT affiliated with any government organization. This is a purely informational portal.
            </p>
          </div>

        </div>

        <hr className="my-10 border-slate-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>&copy; {new Date().getFullYear()} All Sarkari Yojana. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-400 transition">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
