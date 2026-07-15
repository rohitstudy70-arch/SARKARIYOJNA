# PowerShell script to generate remaining scheme detail pages
# Run from the website root directory

$schemePages = @(
  @{
    file = "pm-awas-yojana.html"
    title = "PM Awas Yojana – प्रधानमंत्री आवास योजना पूरी जानकारी | पात्रता, सब्सिडी, आवेदन"
    metaDesc = "PM Awas Yojana (PMAY) शहरी और ग्रामीण की पूरी जानकारी। ₹1.20 लाख से ₹2.50 लाख सब्सिडी — पात्रता, दस्तावेज़, आवेदन प्रक्रिया।"
    keywords = "pm awas yojana, pradhan mantri awas yojana, pmay eligibility, housing scheme india, pmay apply"
    canonical = "pm-awas-yojana.html"
    ogTitle = "PM Awas Yojana – पक्का घर पाने की पूरी जानकारी"
    ogDesc = "PMAY शहरी और ग्रामीण — पात्रता, सब्सिडी, और आवेदन प्रक्रिया।"
    catBadge = "🏠 आवास योजना"
    h1 = "PM Awas Yojana (Pradhan Mantri Awas Yojana)"
    hindiName = "प्रधानमंत्री आवास योजना"
    shortDesc = "शहरी व ग्रामीण गरीब परिवारों को पक्का घर बनाने के लिए ₹1.20 लाख से ₹2.50 लाख तक की आर्थिक सहायता।"
    catLink = "../category/awas-yojana.html"
    catName = "आवास योजनाएं"
    objective = "PM Awas Yojana (PMAY) का उद्देश्य 2022 तक 'सभी के लिए आवास' सुनिश्चित करना था। यह दो भागों में काम करती है — PMAY-Urban (शहरी) और PMAY-Gramin (ग्रामीण)। इस योजना के तहत EWS/LIG/MIG श्रेणी के पात्र परिवारों को घर बनाने या खरीदने के लिए ब्याज सब्सिडी दी जाती है।"
    benefits = "<li>शहरी (PMAY-U): ₹1.20 लाख से ₹2.50 लाख तक CLSS ब्याज सब्सिडी</li><li>ग्रामीण (PMAY-G): ₹1.20 लाख (मैदानी) / ₹1.30 लाख (पहाड़ी) सहायता</li><li>MGNREGA से 90/95 दिन अतिरिक्त मजदूरी (ग्रामीण)</li><li>स्वच्छ भारत मिशन से शौचालय निर्माण सहायता (₹12,000)</li><li>पैसा सीधे लाभार्थी के बैंक खाते में DBT के माध्यम से</li>"
    eligibility = "<li>EWS: वार्षिक आय ₹3 लाख तक</li><li>LIG: वार्षिक आय ₹3 लाख से ₹6 लाख</li><li>MIG-I: ₹6 से ₹12 लाख / MIG-II: ₹12 से ₹18 लाख</li><li>ग्रामीण: SECC 2011 के तहत चिन्हित परिवार या आवासहीन</li><li>परिवार के किसी सदस्य के नाम पक्का घर नहीं होना चाहिए</li><li>इस योजना का पहले लाभ नहीं लिया हो</li>"
    documents = "<li>आधार कार्ड (सभी परिवार सदस्यों का)</li><li>आय प्रमाण पत्र</li><li>बैंक खाता पासबुक</li><li>भूमि / निवास दस्तावेज़</li><li>जाति प्रमाण पत्र (यदि लागू)</li><li>राशन कार्ड</li>"
    howToApply = "<div class='step-item'><div class='step-num'>1</div><div class='step-content'><h3>पोर्टल पर जाएं</h3><p>शहरी के लिए <a href='https://pmay-urban.gov.in/' target='_blank' rel='noopener'>pmay-urban.gov.in</a> और ग्रामीण के लिए <a href='https://pmayg.dord.gov.in/' target='_blank' rel='noopener'>pmayg.dord.gov.in</a> खोलें।</p></div></div><div class='step-item'><div class='step-num'>2</div><div class='step-content'><h3>पात्रता जांचें</h3><p>Beneficiary Search में अपना नाम जांचें।</p></div></div><div class='step-item'><div class='step-num'>3</div><div class='step-content'><h3>स्थानीय कार्यालय</h3><p>नगर पालिका (शहरी) या ग्राम पंचायत / प्रखंड कार्यालय (ग्रामीण) से संपर्क करें।</p></div></div>"
    faqItems = "<div class='faq-item'><div class='faq-question' role='button' tabindex='0'>PMAY में कितनी सब्सिडी मिलती है? <span class='faq-toggle'>+</span></div><div class='faq-answer'>EWS/LIG को 6.5% ब्याज सब्सिडी ₹6 लाख तक ऋण पर। MIG-I को 4%, MIG-II को 3% सब्सिडी मिलती है।</div></div><div class='faq-item'><div class='faq-question' role='button' tabindex='0'>PMAY लाभार्थी सूची में नाम कैसे देखें? <span class='faq-toggle'>+</span></div><div class='faq-answer'>pmayg.dord.gov.in पर Awaassoft → Report → Beneficiary Details देखें।</div></div><div class='faq-item'><div class='faq-question' role='button' tabindex='0'>PMAY ग्रामीण और शहरी में क्या अंतर है? <span class='faq-toggle'>+</span></div><div class='faq-answer'>PMAY-G ग्रामीण क्षेत्रों के लिए है जहां सीधी राशि दी जाती है। PMAY-U शहरी क्षेत्रों के लिए है जहां ब्याज सब्सिडी (CLSS) मिलती है।</div></div>"
    officialLinks = "<a href='https://pmay-urban.gov.in/' target='_blank' rel='noopener noreferrer' class='official-link-btn'>PMAY Urban Portal <span class='ext-icon'>↗</span></a><a href='https://pmayg.dord.gov.in/' target='_blank' rel='noopener noreferrer' class='official-link-btn'>PMAY Gramin Portal <span class='ext-icon'>↗</span></a>"
    helpline = "PMAY Urban Helpline: <strong>1800-11-3377 / 1800-11-3388</strong>"
    relatedSchemes = "<div class='related-scheme-item'><span class='rs-icon'>🌾</span><a href='pm-kisan-samman-nidhi.html'>PM Kisan Yojana</a></div><div class='related-scheme-item'><span class='rs-icon'>💼</span><a href='mudra-loan-yojana.html'>PM Mudra Yojana</a></div><div class='related-scheme-item'><span class='rs-icon'>💰</span><a href='pm-jan-dhan-yojana.html'>Jan Dhan Yojana</a></div>"
    breadcrumbCat = "आवास योजनाएं"
    breadcrumbCatLink = "../category/awas-yojana.html"
  }
)

Write-Host "Script loaded. Scheme data ready."
