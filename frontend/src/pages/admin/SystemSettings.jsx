import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../../utils/api';

export default function SystemSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/api/v1/admin/settings')
      .then(res => {
        const obj = {};
        res.data.forEach(s => {
          obj[s.key] = s.value;
        });
        setSettings(obj);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await api.put('/api/v1/admin/settings', settings);
      if (res.data.success) {
        setMsg('✅ Settings saved successfully!');
      } else {
        setMsg('❌ Failed to save settings.');
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mr-3"></div>
        <span>Syncing settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-slate-400 text-xs mt-1">Configure global application variables, advertising slot keys, and APIs.</p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold border ${
          msg.startsWith('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Admob settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider pb-2 border-b border-slate-850">
            Admob Advertising Keys
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Admob App ID</label>
              <input
                name="admobAppId"
                value={settings.admobAppId || ''}
                onChange={handleChange}
                placeholder="ca-app-pub-..."
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Banner Unit ID</label>
              <input
                name="adBanner"
                value={settings.adBanner || ''}
                onChange={handleChange}
                placeholder="ca-app-pub-.../..."
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Interstitial Unit ID</label>
              <input
                name="adInterstitial"
                value={settings.adInterstitial || ''}
                onChange={handleChange}
                placeholder="ca-app-pub-.../..."
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Native Ad Unit ID</label>
              <input
                name="adNative"
                value={settings.adNative || ''}
                onChange={handleChange}
                placeholder="ca-app-pub-.../..."
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Integration keys */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider pb-2 border-b border-slate-850">
            OneSignal Notifications
          </h3>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">OneSignal App ID</label>
            <input
              name="oneSignalAppId"
              value={settings.oneSignalAppId || ''}
              onChange={handleChange}
              placeholder="e.g. f9f6ff5b-aa0c-..."
              className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
            />
          </div>
        </div>

        {/* General variables */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-slate-850">
            General Portal Configurations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Portal Site Name</label>
              <input
                name="siteName"
                value={settings.siteName || ''}
                onChange={handleChange}
                placeholder="All Sarkari Yojana"
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Contact Email Address</label>
              <input
                name="contactEmail"
                value={settings.contactEmail || ''}
                onChange={handleChange}
                placeholder="contact@sarkariyojana.app"
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Maintenance Mode</label>
              <select
                name="maintenanceMode"
                value={settings.maintenanceMode || 'false'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-semibold"
              >
                <option value="false">❌ Inactive (Live)</option>
                <option value="true">⚠️ Active (Under Maintenance)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Force App Update</label>
              <select
                name="forceUpdate"
                value={settings.forceUpdate || 'false'}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none text-white font-semibold"
              >
                <option value="false">No Force Update</option>
                <option value="true">Force Android Update</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-850">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>

    </div>
  );
}
