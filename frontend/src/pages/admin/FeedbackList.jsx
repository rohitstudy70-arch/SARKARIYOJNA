import React, { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Trash2, CheckSquare } from 'lucide-react';
import api from '../../utils/api';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('feedback');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feedRes, msgRes] = await Promise.all([
        api.get('/api/v1/admin/feedbacks'),
        api.get('/api/v1/admin/contact-messages')
      ]);
      setFeedbacks(feedRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (type, id, updates) => {
    const endpoint = type === 'feedback' ? '/api/v1/admin/feedbacks' : '/api/v1/admin/contact-messages';
    try {
      const res = await api.put(endpoint, { id, ...updates });
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const endpoint = type === 'feedback' ? '/api/v1/admin/feedbacks' : '/api/v1/admin/contact-messages';
    try {
      const res = await api.delete(`${endpoint}?id=${id}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const tabStyle = (tab) => 
    `pb-4 font-bold text-xs uppercase tracking-wider border-b-2 transition ${
      activeTab === tab 
        ? 'border-blue-500 text-blue-500' 
        : 'border-transparent text-slate-500 hover:text-slate-350'
    }`;

  return (
    <div className="space-y-8">
      
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Inbox Notifications</h1>
          <p className="text-slate-400 text-xs mt-1">Review feedback, bug reports, and business proposals submitted by portal visitors.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Tabs Selector */}
        <div className="flex items-center gap-6 border-b border-slate-850">
          <button onClick={() => setActiveTab('feedback')} className={tabStyle('feedback')}>
            User Feedback ({feedbacks.length})
          </button>
          <button onClick={() => setActiveTab('contact')} className={tabStyle('contact')}>
            Contact Submissions ({messages.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span>Syncing inbox...</span>
          </div>
        ) : activeTab === 'feedback' ? (
          /* FEEDBACK LIST VIEW */
          feedbacks.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No feedback submissions.</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map(item => (
                <div key={item._id} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-slate-750 transition">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.email || 'No Email'}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                        item.type === 'bug' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                        item.status === 'NEW' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-350 bg-slate-900/40 p-4 rounded-xl leading-relaxed whitespace-pre-line font-medium border border-slate-850/50">
                    {item.message}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="space-x-2">
                      {item.status === 'NEW' && (
                        <button 
                          onClick={() => handleUpdateStatus('feedback', item._id, { status: 'RESOLVED' })}
                          className="bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-900/30 transition inline-flex items-center gap-1 font-bold"
                        >
                          <CheckSquare size={12} /> Mark Solved
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete('feedback', item._id)}
                        className="bg-red-950/40 hover:bg-red-950 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/30 transition inline-flex items-center gap-1 font-bold"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* CONTACT MESSAGES VIEW */
          messages.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No contact messages.</p>
          ) : (
            <div className="space-y-4">
              {messages.map(item => (
                <div key={item._id} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-slate-750 transition">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1"><Mail size={12} /> {item.email}</span>
                        {item.phone && <span className="flex items-center gap-1"><Phone size={12} /> {item.phone}</span>}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold ${
                      item.status === 'NEW' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Subject: {item.subject || '(No Subject)'}</p>
                    <p className="text-xs text-slate-350 bg-slate-900/40 p-4 rounded-xl leading-relaxed whitespace-pre-line mt-2 font-medium border border-slate-850/50">
                      {item.message}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                    <div className="space-x-2">
                      {item.status === 'NEW' && (
                        <button 
                          onClick={() => handleUpdateStatus('contact', item._id, { status: 'REPLIED' })}
                          className="bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-900/30 transition inline-flex items-center gap-1 font-bold"
                        >
                          <CheckSquare size={12} /> Mark Replied
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete('contact', item._id)}
                        className="bg-red-950/40 hover:bg-red-950 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/30 transition inline-flex items-center gap-1 font-bold"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  );
}
