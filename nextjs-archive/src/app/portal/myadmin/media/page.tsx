'use client';
import { useState, useEffect } from 'react';

export default function MediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/admin/media');
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    await fetch('/api/v1/admin/media', { method: 'POST', body: formData });
    setUploading(false);
    fetchFiles();
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    await fetch(`/api/v1/admin/media?name=${name}`, { method: 'DELETE' });
    fetchFiles();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Media Manager</h2>
        <div>
          <input type="file" id="upload" className="hidden" onChange={handleUpload} accept="image/*" />
          <label htmlFor="upload" className="bg-primary text-white px-4 py-2 rounded font-medium cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload File (Auto WebP compression)'}
          </label>
        </div>
      </div>
      {loading ? <div className="p-8 text-center text-gray-500">Loading media...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {files.map((file) => (
            <div key={file.name} className="bg-white p-4 rounded shadow flex flex-col items-center relative group">
              <button onClick={() => handleDelete(file.name)} className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs">x</button>
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-2 overflow-hidden">
                <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
              </div>
              <p className="text-xs font-semibold truncate w-full text-center" title={file.name}>{file.name}</p>
              <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              <p className="text-[10px] text-gray-400 cursor-pointer hover:text-blue-600 mt-1" onClick={() => {navigator.clipboard.writeText(window.location.origin + file.url); alert('URL copied!');}}>Copy URL</p>
            </div>
          ))}
          {files.length === 0 && <div className="col-span-full p-8 text-center text-gray-500">No files uploaded yet.</div>}
        </div>
      )}
    </div>
  )
}
