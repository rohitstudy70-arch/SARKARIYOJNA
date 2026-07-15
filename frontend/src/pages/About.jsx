import React from 'react';
import { Heart, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About All Sarkari Yojana</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Learn more about our mission to make government information accessible and simple for everyone in India.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">
        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
        <p>
          Governments launch hundreds of schemes every year for farmers, students, women, and small business owners. However, a large percentage of the eligible population misses out on these benefits due to a lack of clean, centralized, and clear information. 
        </p>
        <p>
          <strong>All Sarkari Yojana</strong> is an independent information aggregator platform launched in 2026. Our objective is to simplify complex government scheme documents, policies, and notifications into straightforward step-by-step guides explaining:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 font-semibold text-gray-600">
          <li>What the scheme is and who gets the benefits.</li>
          <li>Specific income, age, and regional eligibility details.</li>
          <li>Exact lists of certificates and documentation required.</li>
          <li>Direct portal links to apply without broker interference.</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto"><Heart /></div>
            <h4 className="font-bold text-gray-800">100% Free</h4>
            <p className="text-xs text-gray-500">We do not charge any money for information or application assistance.</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><Globe /></div>
            <h4 className="font-bold text-gray-800">State & Central</h4>
            <p className="text-xs text-gray-500">Find programs running in almost every Indian state under one roof.</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto"><Award /></div>
            <h4 className="font-bold text-gray-800">Trusted Info</h4>
            <p className="text-xs text-gray-500">We gather facts only from official government websites (gov.in portals).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
