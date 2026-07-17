import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth & Language Wrapper
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Client Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Client Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home'));
const Schemes = lazy(() => import('./pages/Schemes'));
const SchemeDetails = lazy(() => import('./pages/SchemeDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const States = lazy(() => import('./pages/States'));
const StateDetail = lazy(() => import('./pages/StateDetail'));
const JobsList = lazy(() => import('./pages/JobsList'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const ResultsList = lazy(() => import('./pages/ResultsList'));
const ResultDetail = lazy(() => import('./pages/ResultDetail'));
const AdmitCardsList = lazy(() => import('./pages/AdmitCardsList'));
const AdmitCardDetail = lazy(() => import('./pages/AdmitCardDetail'));
const AnswerKeyDetail = lazy(() => import('./pages/AnswerKeyDetail'));
const SyllabusDetail = lazy(() => import('./pages/SyllabusDetail'));
const AdmissionDetail = lazy(() => import('./pages/AdmissionDetail'));
const DocumentDetail = lazy(() => import('./pages/DocumentDetail'));
const NewsList = lazy(() => import('./pages/NewsList'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const BlogsList = lazy(() => import('./pages/BlogsList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Faq = lazy(() => import('./pages/Faq'));

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const SchemeManager = lazy(() => import('./pages/admin/SchemeManager'));
const SchemeForm = lazy(() => import('./pages/admin/SchemeForm'));
const ModelManager = lazy(() => import('./pages/admin/ModelManager'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));
const FeedbackList = lazy(() => import('./pages/admin/FeedbackList'));

// Layout wrappers
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// Field configurations for ModelManager
const categoryFields = [
  { name: 'name', label: 'Category Name', required: true },
  { name: 'hindiName', label: 'Hindi Translation' },
  { name: 'slug', label: 'URL Slug', required: true }
];

const stateFields = [
  { name: 'name', label: 'State Name', required: true },
  { name: 'hindiName', label: 'Hindi Translation' },
  { name: 'slug', label: 'URL Slug', required: true }
];

const standardPostFields = [
  { name: 'title', label: 'Title Name', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'HTML Content details', type: 'textarea', required: true }
];

const jobFields = [
  { name: 'title', label: 'Vacancy / Job Title', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'applyLink', label: 'Apply Online URL Link', fullWidth: true },
  { name: 'notificationLink', label: 'Official Notification PDF Link', fullWidth: true },
  { name: 'officialLink', label: 'Official Website Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Vacancy Description & Dates (HTML Allowed)', type: 'textarea', required: true }
];

const resultFields = [
  { name: 'title', label: 'Exam Result Title', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'resultLink', label: 'Download Scorecard / Result Link', fullWidth: true },
  { name: 'officialLink', label: 'Official Website Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Exam Result Description & Stats (HTML Allowed)', type: 'textarea', required: true }
];

const admitCardFields = [
  { name: 'title', label: 'Admit Card Name', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'admitCardLink', label: 'Download Hall Ticket / Admit Card URL', fullWidth: true },
  { name: 'officialLink', label: 'Official Website Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Exam Information & Guidelines (HTML Allowed)', type: 'textarea', required: true }
];

const answerKeyFields = [
  { name: 'title', label: 'Answer Key Name', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'downloadLink', label: 'Download Answer Key PDF Link', fullWidth: true },
  { name: 'officialLink', label: 'Official Website Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Description & Keys (HTML Allowed)', type: 'textarea', required: true }
];

const syllabusFields = [
  { name: 'title', label: 'Syllabus Name', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'downloadLink', label: 'Download Syllabus PDF Link', fullWidth: true },
  { name: 'officialLink', label: 'Official Website Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Syllabus Topics & Pattern (HTML Allowed)', type: 'textarea', required: true }
];

const admissionFields = [
  { name: 'title', label: 'Admission Course Title', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'applyLink', label: 'Apply Online Course Link', fullWidth: true },
  { name: 'officialLink', label: 'Official College / University Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Admission Guidelines & Fees (HTML Allowed)', type: 'textarea', required: true }
];

const documentFields = [
  { name: 'title', label: 'Verification / Document Name', required: true, fullWidth: true },
  { name: 'slug', label: 'URL Slug Link', required: true },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'downloadLink', label: 'Download Form / Apply Verification Link', fullWidth: true },
  { name: 'officialLink', label: 'Official Portal Link', fullWidth: true },
  { name: 'seoTitle', label: 'SEO Header Title' },
  { name: 'seoDesc', label: 'SEO Description', type: 'textarea', rows: 2 },
  { name: 'content', label: 'Document Application Guidelines (HTML Allowed)', type: 'textarea', required: true }
];

const bannerFields = [
  { name: 'title', label: 'Banner Header', required: true },
  { name: 'imageUrl', label: 'Image URL Asset', type: 'image', required: true, fullWidth: true },
  { name: 'link', label: 'Destination Click Path', fullWidth: true },
  { name: 'position', label: 'Display Spot', type: 'select', defaultValue: 'homepage', options: [{ value: 'homepage', label: 'Homepage Slider' }, { value: 'popup', label: 'Popup modal' }] },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'priority', label: 'Priority Order (High = First)', type: 'number', defaultValue: 0 }
];

const adFields = [
  { name: 'title', label: 'Advertisement Description Title', required: true },
  { name: 'type', label: 'Banner / Ads Type', type: 'select', defaultValue: 'banner', options: [{ value: 'banner', label: 'Banner Image' }, { value: 'native', label: 'Native script code' }] },
  { name: 'imageUrl', label: 'Asset Image URL Link', type: 'image', fullWidth: true },
  { name: 'link', label: 'Ad Redirection link', fullWidth: true },
  { name: 'position', label: 'Position Slot', type: 'select', defaultValue: 'sidebar', options: [{ value: 'sidebar', label: 'Sidebar Widget' }, { value: 'in_content', label: 'In-Content block' }] },
  { name: 'status', label: 'Status', type: 'select', defaultValue: 'PUBLISHED', options: [{ value: 'PUBLISHED', label: 'PUBLISHED' }, { value: 'DRAFT', label: 'DRAFT' }] },
  { name: 'scriptCode', label: 'Raw HTML/Script code (Google Ads)', type: 'textarea', rows: 4 }
];

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-[#fafafa]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              
              {/* Public Views */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/schemes" element={<PublicLayout><Schemes /></PublicLayout>} />
              <Route path="/yojana/:slug" element={<PublicLayout><SchemeDetails /></PublicLayout>} />
              
              <Route path="/categories" element={<PublicLayout><Categories /></PublicLayout>} />
              <Route path="/category/:slug" element={<PublicLayout><CategoryDetail /></PublicLayout>} />
              
              <Route path="/states" element={<PublicLayout><States /></PublicLayout>} />
              <Route path="/state/:slug" element={<PublicLayout><StateDetail /></PublicLayout>} />
              
              <Route path="/jobs" element={<PublicLayout><JobsList /></PublicLayout>} />
              <Route path="/jobs/:slug" element={<PublicLayout><JobDetail /></PublicLayout>} />
              
              <Route path="/results" element={<PublicLayout><ResultsList /></PublicLayout>} />
              <Route path="/results/:slug" element={<PublicLayout><ResultDetail /></PublicLayout>} />
              
              <Route path="/admit-cards" element={<PublicLayout><AdmitCardsList /></PublicLayout>} />
              <Route path="/admit-cards/:slug" element={<PublicLayout><AdmitCardDetail /></PublicLayout>} />
              
              <Route path="/news" element={<PublicLayout><NewsList /></PublicLayout>} />
              <Route path="/news/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
              
              <Route path="/blogs" element={<PublicLayout><BlogsList /></PublicLayout>} />
              <Route path="/blogs/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
              
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
              <Route path="/faqs" element={<PublicLayout><Faq /></PublicLayout>} />
              <Route path="/feedback" element={<PublicLayout><Contact /></PublicLayout>} />

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Panel Layout & Operations */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                
                <Route path="schemes" element={<SchemeManager />} />
                <Route path="schemes/new" element={<SchemeForm />} />
                <Route path="schemes/edit/:id" element={<SchemeForm />} />
                
                <Route path="categories" element={<ModelManager modelName="categories" title="Category" fields={categoryFields} />} />
                <Route path="states" element={<ModelManager modelName="states" title="State" fields={stateFields} />} />
                <Route path="jobs" element={<ModelManager modelName="jobs" title="Job Vacancy" fields={jobFields} />} />
                <Route path="results" element={<ModelManager modelName="results" title="Exam Result" fields={resultFields} />} />
                <Route path="admit-cards" element={<ModelManager modelName="admit-cards" title="Admit Card" fields={admitCardFields} />} />
                <Route path="answer-keys" element={<ModelManager modelName="answer-keys" title="Answer Key" fields={answerKeyFields} />} />
                <Route path="syllabus" element={<ModelManager modelName="syllabus" title="Syllabus" fields={syllabusFields} />} />
                <Route path="admissions" element={<ModelManager modelName="admissions" title="Admission" fields={admissionFields} />} />
                <Route path="documents" element={<ModelManager modelName="documents" title="Document / Verification" fields={documentFields} />} />
                <Route path="news" element={<ModelManager modelName="news" title="News Alert" fields={standardPostFields} />} />
                <Route path="blogs" element={<ModelManager modelName="blogs" title="Blog Column" fields={standardPostFields} />} />
                <Route path="faqs" element={<ModelManager modelName="faqs" title="FAQ Q&A" fields={standardPostFields} />} />
                
                <Route path="banners" element={<ModelManager modelName="banners" title="Homepage Banner" fields={bannerFields} />} />
                <Route path="advertisements" element={<ModelManager modelName="advertisements" title="Ad Placement" fields={adFields} />} />
                <Route path="feedback" element={<FeedbackList />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>

            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
