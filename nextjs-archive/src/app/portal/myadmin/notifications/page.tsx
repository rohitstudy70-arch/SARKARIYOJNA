'use client';
import { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', message: '', target: 'All', topic: '', url: ''
  });

  const sendNotification = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // This would hit a real endpoint that integrates with OneSignal/Firebase
    await new Promise(r => setTimeout(r, 1000)); 
    alert('Notification sent successfully! (Mocked)');
    setLoading(false);
    setForm({ title: '', message: '', target: 'All', topic: '', url: '' });
  };

  return (
    <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Send Push Notification</h2>
        <form onSubmit={sendNotification} className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm mb-1 font-semibold">Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" placeholder="New Yojana Alert!" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Message</label>
            <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border p-2 rounded h-24" placeholder="PM Kisan 18th Installment Released..."></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Action URL (Optional)</label>
            <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full border p-2 rounded" placeholder="https://sarkariyojana.app/yojana/pm-kisan" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">Target Audience</label>
            <select value={form.target} onChange={e => setForm({...form, target: e.target.value})} className="w-full border p-2 rounded">
              <option value="All">All Users</option>
              <option value="Topic">Specific Topic / Tag</option>
              <option value="State">Specific State</option>
            </select>
          </div>
          {form.target !== 'All' && (
            <div>
              <label className="block text-sm mb-1 font-semibold">Target Value</label>
              <input required value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. up-state or student-scholarship" />
            </div>
          )}
          <div className="pt-4">
            <button disabled={loading} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-800 transition">
              {loading ? 'Sending...' : 'Send Notification Now'}
            </button>
          </div>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Notification History</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">Details</th>
                <th className="p-4 font-semibold text-gray-600">Target</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">No notifications sent yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
