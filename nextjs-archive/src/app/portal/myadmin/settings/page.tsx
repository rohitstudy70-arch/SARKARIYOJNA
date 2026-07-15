'use client';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/settings')
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = (e: any) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked ? 'true' : 'false' });
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveMsg('✅ Settings updated successfully! Live on App now.');
      } else {
        setSaveMsg('❌ Error saving settings.');
      }
    } catch (e) {
      setSaveMsg('❌ Error saving settings.');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">⚙️ Global Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Yahan se App aur Website ka saara control aapke haath mein hai. (Auto-sync with App)
          </p>
        </div>
        <button 
          onClick={saveSettings} 
          disabled={saving} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
        >
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      {saveMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium ${saveMsg.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {saveMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ============ 1. APP SETTINGS & UPDATES ============ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">📱 App Control & Force Update</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Play Store Link</label>
              <input name="playStoreLink" value={settings.playStoreLink || ''} onChange={handleChange} placeholder="https://play.google.com/store/apps/details?id=..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">App Share Link (WhatsApp ke liye)</label>
              <input name="appShareLink" value={settings.appShareLink || ''} onChange={handleChange} placeholder="Download this amazing app..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Version Code</label>
                <input type="number" name="minVersion" value={settings.minVersion || ''} onChange={handleChange} placeholder="e.g. 10" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Latest Version Code</label>
                <input type="number" name="latestVersion" value={settings.latestVersion || ''} onChange={handleChange} placeholder="e.g. 12" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-900">🚨 Force Update Active</label>
                <p className="text-xs text-gray-500">Agar on hai, purane users ko update karna padega.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="forceUpdate" checked={settings.forceUpdate === 'true'} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* ============ 2. ADMOB MONETIZATION ============ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">💰 AdMob Monetization (Ads)</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">AdMob App ID</label>
              <input name="admobAppId" value={settings.admobAppId || ''} onChange={handleChange} placeholder="ca-app-pub-..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">App Open Ad Unit</label>
              <input name="adAppOpen" value={settings.adAppOpen || ''} onChange={handleChange} placeholder="ca-app-pub-..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Ad Unit</label>
              <input name="adBanner" value={settings.adBanner || ''} onChange={handleChange} placeholder="ca-app-pub-..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Interstitial Ad Unit</label>
              <input name="adInterstitial" value={settings.adInterstitial || ''} onChange={handleChange} placeholder="ca-app-pub-..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Native Ad</label>
                <input name="adNative" value={settings.adNative || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reward Ad</label>
                <input name="adReward" value={settings.adReward || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ============ 3. PUSH NOTIFICATIONS & ANALYTICS ============ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">🔔 OneSignal & Google Analytics</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Analytics Measurement ID</label>
              <input name="gaId" value={settings.gaId || ''} onChange={handleChange} placeholder="G-XXXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 font-mono text-sm" />
              <p className="text-xs text-gray-500 mt-1">App aur website me user track karne ke liye.</p>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">OneSignal App ID</label>
              <input name="oneSignalAppId" value={settings.oneSignalAppId || ''} onChange={handleChange} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">OneSignal REST API Key</label>
              <input type="password" name="oneSignalApiKey" value={settings.oneSignalApiKey || ''} onChange={handleChange} placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 font-mono text-sm" />
              <p className="text-xs text-gray-500 mt-1">API key chhipakar rakhi gayi hai security ke liye.</p>
            </div>
          </div>
        </div>

        {/* ============ 4. WEBSITE INFO ============ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">🌐 Website Identity</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Site Name</label>
              <input name="siteName" value={settings.siteName || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
                <input name="contactEmail" value={settings.contactEmail || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp No.</label>
                <input name="whatsapp" value={settings.whatsapp || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Copyright Text</label>
              <input name="copyright" value={settings.copyright || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500" />
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-900">🚧 Maintenance Mode</label>
                <p className="text-xs text-gray-500">Agar on hai, website band dikhegi visitors ko.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode === 'true'} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
