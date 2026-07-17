import React, { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, FileText, FolderPlus, MapPin, 
  Briefcase, CheckSquare, CreditCard, Newspaper, 
  BookOpen, Image, Share2, HelpCircle, MessageSquare, 
  Settings, LogOut, ShieldAlert, ArrowLeft,
  Key, GraduationCap, FileCheck, FileSpreadsheet
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, token, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p>Verifying secure session...</p>
        </div>
      </div>
    );
  }

  // Route guarding
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
        <div className="bg-slate-800 p-8 rounded-3xl max-w-sm border border-slate-700/50 text-white space-y-4">
          <ShieldAlert size={48} className="mx-auto text-red-500" />
          <h2 className="text-xl font-bold">Unauthorized Access</h2>
          <p className="text-slate-400 text-xs">Please log in with secure admin credentials to access this dashboard.</p>
          <Link to="/admin/login" className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const navItem = (to, icon, label) => (
    <NavLink 
      to={to} 
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg">
                SY
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight">Console Center</span>
                <p className="text-[10px] text-slate-500 font-medium">Logged: Admin</p>
              </div>
            </div>
            
            {/* Toggle button shown only on mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider"
            >
              {sidebarOpen ? 'Close Menu ▲' : 'Open Menu ▼'}
            </button>
          </div>

          <nav className={`space-y-1 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            {navItem('/admin/dashboard', <LayoutDashboard size={16} />, 'Dashboard')}
            {navItem('/admin/schemes', <FileText size={16} />, 'Manage Schemes')}
            {navItem('/admin/categories', <FolderPlus size={16} />, 'Categories')}
            {navItem('/admin/states', <MapPin size={16} />, 'States')}
            
            <div className="h-px bg-slate-800 my-4"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Exams & News</p>
            
            {navItem('/admin/jobs', <Briefcase size={16} />, 'Jobs Manager')}
            {navItem('/admin/results', <CheckSquare size={16} />, 'Results Manager')}
            {navItem('/admin/admit-cards', <CreditCard size={16} />, 'Admit Cards')}
            {navItem('/admin/answer-keys', <Key size={16} />, 'Answer Keys')}
            {navItem('/admin/syllabus', <FileSpreadsheet size={16} />, 'Syllabus')}
            {navItem('/admin/admissions', <GraduationCap size={16} />, 'Admissions')}
            {navItem('/admin/documents', <FileCheck size={16} />, 'Documents/Verify')}
            {navItem('/admin/news', <Newspaper size={16} />, 'News Posts')}
            {navItem('/admin/blogs', <BookOpen size={16} />, 'Blogs / Guides')}
            {navItem('/admin/faqs', <HelpCircle size={16} />, 'FAQs')}

            <div className="h-px bg-slate-800 my-4"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">App Config</p>
            
            {navItem('/admin/banners', <Image size={16} />, 'Home Banners')}
            {navItem('/admin/advertisements', <Share2 size={16} />, 'Ad Slots')}
            {navItem('/admin/feedback', <MessageSquare size={16} />, 'Feedback Inbox')}
            {navItem('/admin/settings', <Settings size={16} />, 'System Settings')}
          </nav>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className={`p-4 border-t border-slate-800 space-y-2 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
          <Link to="/" className="flex items-center justify-center gap-1.5 w-full bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl text-xs hover:bg-slate-700 transition">
            <ArrowLeft size={12} />
            View Public Site
          </Link>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-1.5 w-full bg-red-950/40 text-red-400 font-semibold py-2.5 rounded-xl text-xs hover:bg-red-900 hover:text-white transition"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
