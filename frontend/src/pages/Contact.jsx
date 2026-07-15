import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await api.post('/api/v1/public/contact', formData);
      if (res.data.success) {
        setMsg('✅ Your message has been sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setMsg('❌ Failed to send message. Please try again.');
      }
    } catch (err) {
      setMsg('❌ An error occurred. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Contact Us</h1>
        <p className="text-gray-500 text-sm mt-2">Have a question or suggestions? Send us a message and we'll reply shortly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Info Grid */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-8 rounded-3xl space-y-8 shadow-xl">
          <h3 className="text-xl font-bold">Contact Info</h3>
          
          <div className="flex items-start gap-4">
            <Mail className="mt-1" />
            <div>
              <p className="font-bold text-sm text-blue-200">Email Address</p>
              <p className="text-sm font-semibold mt-1">contact@sarkariyojana.app</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="mt-1" />
            <div>
              <p className="font-bold text-sm text-blue-200">Phone Hotline</p>
              <p className="text-sm font-semibold mt-1">+91 98765 43210 (Mon-Fri)</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="mt-1" />
            <div>
              <p className="font-bold text-sm text-blue-200">Office Location</p>
              <p className="text-sm mt-1">Sector 62, Noida, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {msg && (
            <div className={`p-4 rounded-xl text-xs font-semibold mb-6 border ${
              msg.startsWith('✅') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99999-99999"
                  className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry about Scheme / Advertisement"
                  className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message *</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message detailed here..."
                className="w-full border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
