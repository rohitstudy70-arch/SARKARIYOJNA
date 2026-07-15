import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mt-2">Last Updated: July 15, 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-gray-700 leading-relaxed text-sm space-y-6">
        <p>
          At <strong>All Sarkari Yojana</strong>, accessible from our portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by our platform and how we use it.
        </p>

        <h2 className="text-xl font-bold text-gray-800">Information We Collect</h2>
        <p>
          If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
        </p>

        <h2 className="text-xl font-bold text-gray-800">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, operate, and maintain our website.</li>
          <li>Improve, personalize, and expand our website.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website.</li>
          <li>Send you push notifications and emails.</li>
          <li>Find and prevent fraud.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800">Cookies and Web Beacons</h2>
        <p>
          Like any other website, our portal uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-xl font-bold text-gray-800">Google DoubleClick DART Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
        </p>

        <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
        <p>
          All Sarkari Yojana is not associated with the Government of India or any state government in any manner. We do not represent any official government body. We compile information from various government channels for the benefit of users.
        </p>
      </div>
    </div>
  );
}
