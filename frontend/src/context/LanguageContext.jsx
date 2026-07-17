import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

const translations = {
  en: {
    home: "Home",
    latestJobs: "Latest Jobs",
    admitCards: "Admit Cards",
    results: "Results",
    answerKeys: "Answer Keys",
    syllabus: "Syllabus",
    admissions: "Admissions",
    documents: "Certificates",
    alerts: "Important Notices",
    searchPlaceholder: "Search for government schemes, services, jobs...",
    searchButton: "Search",
    browseStateWise: "Browse Schemes State-Wise",
    stateJurisdiction: "State Jurisdiction",
    centralGovt: "Central Government",
    newTag: "New",
    outTag: "Out",
    liveTag: "Live",
    keysTag: "Keys",
    examTag: "Exam",
    applyTag: "Apply",
    docsTag: "Docs",
    alertTag: "Alert",
    trendingSchemes: "Trending Schemes",
    popularInitiatives: "Popular Initiatives",
    naukriPortalTitle: "Latest Updates & Naukri Portal",
    naukriPortalDesc: "Check latest exam results, admit cards, answer keys, syllabus and jobs in one place",
    stateWiseDesc: "Check local region benefits. Almost all Indian states run dedicated financial assistance, farmer support, and educational programs.",
    loginTitle: "Admin Console Login",
    loginDesc: "Authorized access only. Log in to manage content.",
    emailLabel: "Email Address",
    passwordLabel: "Security Password",
    loginButton: "Secure Log In",
    authenticating: "Authenticating..."
  },
  hi: {
    home: "मुख्य पृष्ठ",
    latestJobs: "नवीनतम नौकरियां",
    admitCards: "प्रवेश पत्र",
    results: "परीक्षा परिणाम",
    answerKeys: "उत्तर कुंजी",
    syllabus: "पाठ्यक्रम",
    admissions: "प्रवेश / एडमिशन",
    documents: "दस्तावेज़ / सर्टिफिकेट",
    alerts: "महत्वपूर्ण सूचनाएं",
    searchPlaceholder: "सरकारी योजनाओं, सेवाओं, नौकरियों की खोज करें...",
    searchButton: "खोजें",
    browseStateWise: "राज्य-वार योजनाएं देखें",
    stateJurisdiction: "राज्य अधिकार क्षेत्र",
    centralGovt: "केंद्र सरकार",
    newTag: "नया",
    outTag: "जारी",
    liveTag: "सक्रिय",
    keysTag: "कुंजी",
    examTag: "परीक्षा",
    applyTag: "आवेदन",
    docsTag: "सर्टिफिकेट",
    alertTag: "अलर्ट",
    trendingSchemes: "ट्रेंडिंग योजनाएं",
    popularInitiatives: "लोकप्रिय पहल",
    naukriPortalTitle: "नवीनतम अपडेट और नौकरी पोर्टल",
    naukriPortalDesc: "नवीनतम परीक्षा परिणाम, प्रवेश पत्र, उत्तर कुंजी, पाठ्यक्रम और नौकरियां एक ही स्थान पर देखें",
    stateWiseDesc: "अपने क्षेत्र के स्थानीय लाभों की जांच करें। लगभग सभी भारतीय राज्य समर्पित वित्तीय सहायता, किसान सहायता और शैक्षणिक कार्यक्रम चलाते हैं।",
    loginTitle: "एडमिन कंसोल लॉगिन",
    loginDesc: "केवल अधिकृत पहुंच। सामग्री प्रबंधित करने के लिए लॉगिन करें।",
    emailLabel: "ईमेल पता",
    passwordLabel: "सुरक्षा पासवर्ड",
    loginButton: "सुरक्षित लॉगिन",
    authenticating: "प्रमाणित किया जा रहा है..."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'hi'); // Default to Hindi as per user's preference

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
