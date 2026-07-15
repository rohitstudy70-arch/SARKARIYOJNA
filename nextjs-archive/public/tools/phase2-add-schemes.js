const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data", "schemes.js");
const yojanaDir = path.join(root, "yojana");
const stateDir = path.join(root, "state");
const sitemapPath = path.join(root, "sitemap.xml");

const statesToAdd = [
  { slug: "bihar", name: "बिहार", description: "बिहार सरकार की छात्र, किसान, महिला, रोजगार और सामाजिक सुरक्षा योजनाएं" },
  { slug: "rajasthan", name: "राजस्थान", description: "राजस्थान सरकार की नागरिक सेवा, किसान, महिला और सामाजिक सुरक्षा योजनाएं" },
  { slug: "maharashtra", name: "महाराष्ट्र", description: "महाराष्ट्र सरकार की महिला, किसान, श्रमिक और DBT योजनाएं" },
  { slug: "gujarat", name: "गुजरात", description: "गुजरात सरकार की महिला, किसान, छात्रवृत्ति और सामाजिक कल्याण योजनाएं" }
];

const schemes = [
  { id: "pm-vishwakarma-yojana", name: "PM Vishwakarma Yojana", hindiName: "प्रधानमंत्री विश्वकर्मा योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "पारंपरिक कारीगरों और शिल्पकारों को प्रशिक्षण, टूलकिट सहायता और ऋण सुविधा।", officialUrl: "https://pmvishwakarma.gov.in/", keywords: "vishwakarma artisan shilpkar tool kit loan training" },
  { id: "pm-svanidhi-yojana", name: "PM SVANidhi Yojana", hindiName: "पीएम स्वनिधि योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "शहरी रेहड़ी-पटरी विक्रेताओं के लिए working capital loan और digital transaction incentive।", officialUrl: "https://pmsvanidhi.mohua.gov.in/", keywords: "svanidhi street vendor loan rehri patri" },
  { id: "atal-pension-yojana", name: "Atal Pension Yojana", hindiName: "अटल पेंशन योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "पेंशन", categorySlug: "pension-yojana", summary: "असंगठित क्षेत्र के नागरिकों के लिए योगदान आधारित pension scheme।", officialUrl: "https://www.npscra.nsdl.co.in/scheme-details.php", keywords: "atal pension apy nps retirement" },
  { id: "sukanya-samriddhi-yojana", name: "Sukanya Samriddhi Yojana", hindiName: "सुकन्या समृद्धि योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "महिला", categorySlug: "mahila-yojana", summary: "बालिका के भविष्य की शिक्षा और विवाह के लिए छोटी बचत योजना।", officialUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Saving-Schemes.aspx", keywords: "sukanya samriddhi girl child saving post office" },
  { id: "pm-matru-vandana-yojana", name: "PM Matru Vandana Yojana", hindiName: "प्रधानमंत्री मातृ वंदना योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "महिला", categorySlug: "mahila-yojana", summary: "गर्भवती और स्तनपान कराने वाली माताओं के लिए maternity benefit सहायता।", officialUrl: "https://pmmvy.wcd.gov.in/", keywords: "pmmvy maternity pregnant mother mahila" },
  { id: "national-social-assistance-programme", name: "National Social Assistance Programme", hindiName: "राष्ट्रीय सामाजिक सहायता कार्यक्रम", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "पेंशन", categorySlug: "pension-yojana", summary: "वृद्ध, विधवा और दिव्यांग नागरिकों के लिए सामाजिक सहायता pension schemes।", officialUrl: "https://nsap.nic.in/", keywords: "nsap pension widow old age disability" },
  { id: "pm-poshan-yojana", name: "PM POSHAN Yojana", hindiName: "प्रधानमंत्री पोषण शक्ति निर्माण योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "शिक्षा", categorySlug: "shiksha-yojana", summary: "स्कूल बच्चों के पोषण और mid-day meal व्यवस्था से जुड़ी योजना।", officialUrl: "https://pmposhan.education.gov.in/", keywords: "pm poshan mid day meal school children" },
  { id: "jal-jeevan-mission", name: "Jal Jeevan Mission", hindiName: "जल जीवन मिशन", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "ग्रामीण घरों तक tap water connection पहुंचाने का राष्ट्रीय mission।", officialUrl: "https://jaljeevanmission.gov.in/", keywords: "jal jeevan mission water tap har ghar jal" },
  { id: "swachh-bharat-mission-gramin", name: "Swachh Bharat Mission Gramin", hindiName: "स्वच्छ भारत मिशन ग्रामीण", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "ग्रामीण स्वच्छता, शौचालय और ODF Plus गतिविधियों से जुड़ा mission।", officialUrl: "https://swachhbharatmission.ddws.gov.in/", keywords: "swachh bharat gramin toilet sanitation odf" },
  { id: "stand-up-india-yojana", name: "Stand-Up India Yojana", hindiName: "स्टैंड-अप इंडिया योजना", state: "केंद्र सरकार", stateSlug: "central-schemes", category: "वित्तीय", categorySlug: "vittiya-yojana", summary: "SC/ST और महिला उद्यमियों को enterprise loan support की योजना।", officialUrl: "https://www.standupmitra.in/", keywords: "stand up india women entrepreneur sc st loan" },

  { id: "bihar-student-credit-card", name: "Bihar Student Credit Card Yojana", hindiName: "बिहार स्टूडेंट क्रेडिट कार्ड योजना", state: "बिहार", stateSlug: "bihar", category: "शिक्षा", categorySlug: "shiksha-yojana", summary: "उच्च शिक्षा के लिए विद्यार्थियों को education loan support की जानकारी।", officialUrl: "https://www.7nishchay-yuvaupmission.bihar.gov.in/", keywords: "bihar student credit card education loan" },
  { id: "bihar-kushal-yuva-program", name: "Kushal Yuva Program", hindiName: "बिहार कुशल युवा कार्यक्रम", state: "बिहार", stateSlug: "bihar", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "युवाओं को basic computer, communication और soft skills training।", officialUrl: "https://www.7nishchay-yuvaupmission.bihar.gov.in/", keywords: "bihar kushal yuva skill training kyp" },
  { id: "bihar-swayam-sahayata-bhatta", name: "Mukhyamantri Nishchay Swayam Sahayata Bhatta", hindiName: "मुख्यमंत्री निश्चय स्वयं सहायता भत्ता योजना", state: "बिहार", stateSlug: "bihar", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "रोजगार खोज रहे पात्र युवाओं के लिए सहायता भत्ता योजना।", officialUrl: "https://www.7nishchay-yuvaupmission.bihar.gov.in/", keywords: "bihar swayam sahayata bhatta berojgari" },
  { id: "bihar-mukhyamantri-udyami-yojana", name: "Bihar Mukhyamantri Udyami Yojana", hindiName: "बिहार मुख्यमंत्री उद्यमी योजना", state: "बिहार", stateSlug: "bihar", category: "वित्तीय", categorySlug: "vittiya-yojana", summary: "नए उद्यम शुरू करने के लिए पात्र वर्गों को financial support।", officialUrl: "https://udyami.bihar.gov.in/", keywords: "bihar udyami yojana entrepreneur loan" },
  { id: "bihar-fasal-sahayata-yojana", name: "Bihar Rajya Fasal Sahayata Yojana", hindiName: "बिहार राज्य फसल सहायता योजना", state: "बिहार", stateSlug: "bihar", category: "किसान", categorySlug: "kisan-yojana", summary: "फसल क्षति की स्थिति में किसानों को सहायता देने की state scheme।", officialUrl: "https://pacsonline.bih.nic.in/fsy/", keywords: "bihar fasal sahayata kisan crop" },
  { id: "bihar-diesel-anudan-yojana", name: "Bihar Diesel Anudan Yojana", hindiName: "बिहार डीजल अनुदान योजना", state: "बिहार", stateSlug: "bihar", category: "किसान", categorySlug: "kisan-yojana", summary: "सिंचाई के लिए diesel subsidy/anudan से जुड़ी किसान योजना।", officialUrl: "https://dbtagriculture.bihar.gov.in/", keywords: "bihar diesel anudan irrigation farmer dbt" },
  { id: "bihar-vridhjan-pension-yojana", name: "Mukhyamantri Vridhjan Pension Yojana", hindiName: "मुख्यमंत्री वृद्धजन पेंशन योजना", state: "बिहार", stateSlug: "bihar", category: "पेंशन", categorySlug: "pension-yojana", summary: "बिहार के पात्र वृद्ध नागरिकों के लिए pension support।", officialUrl: "https://www.sspmis.bihar.gov.in/", keywords: "bihar vridhjan pension old age" },
  { id: "bihar-ration-card", name: "Bihar Ration Card", hindiName: "बिहार राशन कार्ड", state: "बिहार", stateSlug: "bihar", category: "राशन", categorySlug: "all-yojana", summary: "बिहार राशन कार्ड, beneficiary list और food security services।", officialUrl: "https://epds.bihar.gov.in/", keywords: "bihar ration card epds food" },
  { id: "bihar-labour-card", name: "Bihar Labour Card", hindiName: "बिहार लेबर कार्ड", state: "बिहार", stateSlug: "bihar", category: "श्रमिक", categorySlug: "rojgar-yojana", summary: "निर्माण श्रमिकों के registration और welfare benefits की जानकारी।", officialUrl: "https://bocw.bihar.gov.in/", keywords: "bihar labour card bocw shramik" },
  { id: "bihar-kanya-utthan-yojana", name: "Mukhyamantri Kanya Utthan Yojana", hindiName: "मुख्यमंत्री कन्या उत्थान योजना", state: "बिहार", stateSlug: "bihar", category: "महिला", categorySlug: "mahila-yojana", summary: "बालिकाओं और छात्राओं के शिक्षा-सहायता लाभों से जुड़ी योजना।", officialUrl: "https://medhasoft.bih.nic.in/", keywords: "bihar kanya utthan girl scholarship" },

  { id: "rajasthan-jan-aadhaar", name: "Rajasthan Jan Aadhaar", hindiName: "राजस्थान जन आधार योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "राजस्थान में परिवार पहचान और welfare delivery के लिए Jan Aadhaar platform।", officialUrl: "https://janaadhaar.rajasthan.gov.in/", keywords: "rajasthan jan aadhaar family id" },
  { id: "rajasthan-sso-id", name: "Rajasthan SSO ID", hindiName: "राजस्थान SSO ID", state: "राजस्थान", stateSlug: "rajasthan", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "राजस्थान की online services और schemes के लिए single sign-on account।", officialUrl: "https://sso.rajasthan.gov.in/", keywords: "rajasthan sso id online service" },
  { id: "rajasthan-mukhyamantri-ayushman-arogya", name: "Mukhyamantri Ayushman Arogya Yojana", hindiName: "मुख्यमंत्री आयुष्मान आरोग्य योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "स्वास्थ्य", categorySlug: "swasthya-yojana", summary: "राजस्थान में health insurance/cashless treatment services से जुड़ी योजना।", officialUrl: "https://maa.rajasthan.gov.in/", keywords: "rajasthan ayushman arogya health insurance" },
  { id: "rajasthan-social-security-pension", name: "Rajasthan Social Security Pension", hindiName: "राजस्थान सामाजिक सुरक्षा पेंशन", state: "राजस्थान", stateSlug: "rajasthan", category: "पेंशन", categorySlug: "pension-yojana", summary: "वृद्ध, विधवा और दिव्यांग pension schemes के लिए state pension portal।", officialUrl: "https://ssp.rajasthan.gov.in/", keywords: "rajasthan pension widow old age disability" },
  { id: "rajasthan-e-mitra", name: "Rajasthan e-Mitra", hindiName: "राजस्थान ई-मित्र सेवा", state: "राजस्थान", stateSlug: "rajasthan", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "राज्य की citizen services, certificates, bill payment और application सेवाएं।", officialUrl: "https://emitra.rajasthan.gov.in/", keywords: "rajasthan e mitra citizen service" },
  { id: "rajasthan-uttar-matric-scholarship", name: "Rajasthan Uttar Matric Scholarship", hindiName: "राजस्थान उत्तर मैट्रिक छात्रवृत्ति", state: "राजस्थान", stateSlug: "rajasthan", category: "शिक्षा", categorySlug: "shiksha-yojana", summary: "पात्र छात्रों के लिए post-matric scholarship application और status।", officialUrl: "https://sje.rajasthan.gov.in/", keywords: "rajasthan scholarship uttar matric student" },
  { id: "rajasthan-mukhyamantri-kanyadan-yojana", name: "Rajasthan Mukhyamantri Kanyadan Yojana", hindiName: "राजस्थान मुख्यमंत्री कन्यादान योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "महिला", categorySlug: "mahila-yojana", summary: "पात्र परिवारों की बेटियों के विवाह सहायता से जुड़ी योजना।", officialUrl: "https://sje.rajasthan.gov.in/", keywords: "rajasthan kanyadan vivah sahayata" },
  { id: "rajasthan-farm-pond-yojana", name: "Rajasthan Farm Pond Yojana", hindiName: "राजस्थान फार्म पॉन्ड योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "किसान", categorySlug: "kisan-yojana", summary: "किसानों के लिए खेत तालाब/farm pond सहायता से जुड़ी scheme।", officialUrl: "https://rajkisan.rajasthan.gov.in/", keywords: "rajasthan farm pond kisan water" },
  { id: "rajasthan-tarbandi-yojana", name: "Rajasthan Tarbandi Yojana", hindiName: "राजस्थान तारबंदी योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "किसान", categorySlug: "kisan-yojana", summary: "खेत की fencing/tarbandi के लिए किसान सहायता scheme।", officialUrl: "https://rajkisan.rajasthan.gov.in/", keywords: "rajasthan tarbandi fencing kisan" },
  { id: "rajasthan-palankhar-yojana", name: "Rajasthan Palanhar Yojana", hindiName: "राजस्थान पालनहार योजना", state: "राजस्थान", stateSlug: "rajasthan", category: "महिला", categorySlug: "mahila-yojana", summary: "अनाथ/वंचित बच्चों के पालन-पोषण और शिक्षा सहायता से जुड़ी योजना।", officialUrl: "https://sje.rajasthan.gov.in/", keywords: "rajasthan palanhar child support" },

  { id: "maharashtra-ladki-bahin-yojana", name: "Mukhyamantri Majhi Ladki Bahin Yojana", hindiName: "मुख्यमंत्री माझी लाडकी बहिण योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "महिला", categorySlug: "mahila-yojana", summary: "महाराष्ट्र की पात्र महिलाओं के लिए monthly financial assistance scheme।", officialUrl: "https://ladakibahin.maharashtra.gov.in/", keywords: "maharashtra ladki bahin mahila monthly assistance" },
  { id: "maharashtra-mahadbt-scholarship", name: "MahaDBT Scholarship", hindiName: "महाराष्ट्र महाडीबीटी छात्रवृत्ति", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "शिक्षा", categorySlug: "shiksha-yojana", summary: "महाराष्ट्र की scholarship और DBT schemes के लिए online portal।", officialUrl: "https://mahadbt.maharashtra.gov.in/", keywords: "maharashtra mahadbt scholarship student" },
  { id: "maharashtra-shiv-bhojan-thali", name: "Shiv Bhojan Thali", hindiName: "शिव भोजन थाली योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "राशन", categorySlug: "all-yojana", summary: "जरूरतमंद लोगों को affordable meal उपलब्ध कराने की state initiative।", officialUrl: "https://mahafood.gov.in/", keywords: "maharashtra shiv bhojan thali food" },
  { id: "maharashtra-ration-card", name: "Maharashtra Ration Card", hindiName: "महाराष्ट्र राशन कार्ड", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "राशन", categorySlug: "all-yojana", summary: "महाराष्ट्र राशन कार्ड, public distribution और food services।", officialUrl: "https://mahafood.gov.in/", keywords: "maharashtra ration card mahafood" },
  { id: "maharashtra-rojgar-hami-yojana", name: "Maharashtra Rojgar Hami Yojana", hindiName: "महाराष्ट्र रोजगार हमी योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "ग्रामीण रोजगार guarantee से जुड़ी Maharashtra employment scheme।", officialUrl: "https://egs.mahaonline.gov.in/", keywords: "maharashtra rojgar hami egs employment" },
  { id: "maharashtra-bocw-welfare", name: "Maharashtra BOCW Welfare", hindiName: "महाराष्ट्र बांधकाम कामगार कल्याण योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "श्रमिक", categorySlug: "rojgar-yojana", summary: "निर्माण श्रमिकों के registration और welfare benefits की जानकारी।", officialUrl: "https://mahabocw.in/", keywords: "maharashtra bocw labour worker welfare" },
  { id: "maharashtra-sanjay-gandhi-niradhar", name: "Sanjay Gandhi Niradhar Yojana", hindiName: "संजय गांधी निराधार योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "पेंशन", categorySlug: "pension-yojana", summary: "निराधार, विधवा, दिव्यांग और जरूरतमंद नागरिकों के लिए सहायता scheme।", officialUrl: "https://sjsa.maharashtra.gov.in/", keywords: "maharashtra sanjay gandhi niradhar pension" },
  { id: "maharashtra-pik-vima-yojana", name: "Maharashtra Pik Vima Yojana", hindiName: "महाराष्ट्र पीक विमा योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "किसान", categorySlug: "kisan-yojana", summary: "फसल बीमा से जुड़ी Maharashtra farmer insurance information।", officialUrl: "https://pmfby.gov.in/", keywords: "maharashtra pik vima crop insurance kisan" },
  { id: "maharashtra-krushi-yantrikikaran", name: "Maharashtra Krushi Yantrikikaran Yojana", hindiName: "महाराष्ट्र कृषि यंत्रीकरण योजना", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "किसान", categorySlug: "kisan-yojana", summary: "कृषि उपकरण और mechanization subsidy के लिए farmer DBT services।", officialUrl: "https://mahadbt.maharashtra.gov.in/Farmer/", keywords: "maharashtra krushi yantrikikaran farmer machinery subsidy" },
  { id: "maharashtra-aaple-sarkar", name: "Aaple Sarkar Portal", hindiName: "आपले सरकार पोर्टल", state: "महाराष्ट्र", stateSlug: "maharashtra", category: "नागरिक सेवा", categorySlug: "all-yojana", summary: "महाराष्ट्र की online citizen services और certificates के लिए portal।", officialUrl: "https://aaplesarkar.mahaonline.gov.in/", keywords: "maharashtra aaple sarkar citizen service" },

  { id: "gujarat-vahli-dikri-yojana", name: "Vahli Dikri Yojana", hindiName: "गुजरात वहली dikri योजना", state: "गुजरात", stateSlug: "gujarat", category: "महिला", categorySlug: "mahila-yojana", summary: "बालिकाओं के शिक्षा और भविष्य के लिए Gujarat women & child welfare scheme।", officialUrl: "https://wcd.gujarat.gov.in/", keywords: "gujarat vahli dikri girl child" },
  { id: "gujarat-digital-gujarat-scholarship", name: "Digital Gujarat Scholarship", hindiName: "डिजिटल गुजरात छात्रवृत्ति", state: "गुजरात", stateSlug: "gujarat", category: "शिक्षा", categorySlug: "shiksha-yojana", summary: "गुजरात के विद्यार्थियों के लिए online scholarship services।", officialUrl: "https://www.digitalgujarat.gov.in/", keywords: "gujarat scholarship digital gujarat student" },
  { id: "gujarat-kunwarbai-nu-mameru", name: "Kunwarbai Nu Mameru Yojana", hindiName: "कुंवरबाई नू मामेरू योजना", state: "गुजरात", stateSlug: "gujarat", category: "महिला", categorySlug: "mahila-yojana", summary: "पात्र बेटियों के विवाह सहायता से जुड़ी Gujarat welfare scheme।", officialUrl: "https://esamajkalyan.gujarat.gov.in/", keywords: "gujarat kunwarbai nu mameru marriage assistance" },
  { id: "gujarat-manav-garima-yojana", name: "Manav Garima Yojana", hindiName: "मानव गरिमा योजना", state: "गुजरात", stateSlug: "gujarat", category: "रोजगार", categorySlug: "rojgar-yojana", summary: "स्वरोजगार और livelihood support से जुड़ी social welfare scheme।", officialUrl: "https://esamajkalyan.gujarat.gov.in/", keywords: "gujarat manav garima livelihood self employment" },
  { id: "gujarat-ikhedut-portal", name: "iKhedut Portal", hindiName: "आई-ખેડૂત पोर्टल", state: "गुजरात", stateSlug: "gujarat", category: "किसान", categorySlug: "kisan-yojana", summary: "गुजरात किसानों के लिए agriculture schemes और subsidy applications portal।", officialUrl: "https://ikhedut.gujarat.gov.in/", keywords: "gujarat ikhedut farmer agriculture subsidy" },
  { id: "gujarat-mukhyamantri-amrutam", name: "Mukhyamantri Amrutam Yojana", hindiName: "मुख्यमंत्री अमृतम योजना", state: "गुजरात", stateSlug: "gujarat", category: "स्वास्थ्य", categorySlug: "swasthya-yojana", summary: "गुजरात में health assistance/insurance services से जुड़ी योजना।", officialUrl: "https://health.gujarat.gov.in/", keywords: "gujarat mukhyamantri amrutam health" },
  { id: "gujarat-ration-card", name: "Gujarat Ration Card", hindiName: "गुजरात राशन कार्ड", state: "गुजरात", stateSlug: "gujarat", category: "राशन", categorySlug: "all-yojana", summary: "गुजरात ration card और food civil supplies services की जानकारी।", officialUrl: "https://dcs-dof.gujarat.gov.in/", keywords: "gujarat ration card food civil supplies" },
  { id: "gujarat-shramyogi-kalyan", name: "Gujarat Shramyogi Kalyan", hindiName: "गुजरात श्रमयोगी कल्याण योजना", state: "गुजरात", stateSlug: "gujarat", category: "श्रमिक", categorySlug: "rojgar-yojana", summary: "गुजरात श्रमिकों के welfare benefits और labour board services।", officialUrl: "https://glwb.gujarat.gov.in/", keywords: "gujarat shramyogi labour welfare" },
  { id: "gujarat-vidhva-sahay-yojana", name: "Gujarat Vidhva Sahay Yojana", hindiName: "गुजरात विधवा सहाय योजना", state: "गुजरात", stateSlug: "gujarat", category: "पेंशन", categorySlug: "pension-yojana", summary: "विधवा महिलाओं के लिए state assistance/pension related information।", officialUrl: "https://sje.gujarat.gov.in/", keywords: "gujarat widow pension vidhva sahay" },
  { id: "gujarat-e-nirman-card", name: "Gujarat e-Nirman Card", hindiName: "गुजरात ई-निर्माण कार्ड", state: "गुजरात", stateSlug: "gujarat", category: "श्रमिक", categorySlug: "rojgar-yojana", summary: "निर्माण श्रमिकों के registration और welfare benefits के लिए e-Nirman portal।", officialUrl: "https://enirmanbocw.gujarat.gov.in/", keywords: "gujarat e nirman card bocw labour" }
];

function loadCurrentData() {
  const code = fs.readFileSync(dataPath, "utf8");
  const context = { window: {} };
  require("vm").createContext(context);
  require("vm").runInContext(code, context);
  return { code, schemes: context.window.SCHEMES, states: context.window.SCHEME_STATES };
}

function jsString(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatScheme(scheme) {
  return `  { id: ${jsString(scheme.id)}, name: ${jsString(scheme.name)}, hindiName: ${jsString(scheme.hindiName)}, state: ${jsString(scheme.state)}, stateSlug: ${jsString(scheme.stateSlug)}, category: ${jsString(scheme.category)}, categorySlug: ${jsString(scheme.categorySlug)}, summary: ${jsString(scheme.summary)}, officialUrl: ${jsString(scheme.officialUrl)}, pageUrl: ${jsString(`../yojana/${scheme.id}.html`)}, keywords: ${jsString(scheme.keywords)} }`;
}

function formatState(state) {
  return `  { slug: ${jsString(state.slug)}, name: ${jsString(state.name)}, description: ${jsString(state.description)} }`;
}

function updateData() {
  const current = loadCurrentData();
  const existingIds = new Set(current.schemes.map((scheme) => scheme.id));
  const existingStates = new Set(current.states.map((state) => state.slug));
  const allSchemes = current.schemes.concat(schemes.filter((scheme) => !existingIds.has(scheme.id)));
  const allStates = current.states.concat(statesToAdd.filter((state) => !existingStates.has(state.slug)));
  const content = `window.SCHEMES = [\n${allSchemes.map(formatScheme).join(",\n")}\n];\n\nwindow.SCHEME_STATES = [\n${allStates.map(formatState).join(",\n")}\n];\n`;
  fs.writeFileSync(dataPath, content, "utf8");
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function schemePage(scheme) {
  const title = `${scheme.name} - ${scheme.hindiName} | All Sarkari Yojana`;
  const meta = `${scheme.hindiName} की जानकारी हिंदी में। लाभ, पात्रता, दस्तावेज, आवेदन प्रक्रिया और official website link देखें।`;
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlEscape(title)}</title>
  <meta name="description" content="${htmlEscape(meta)}" />
  <link rel="canonical" href="https://allsarkariyojana.in/yojana/${scheme.id}.html" />
  <link rel="icon" type="image/png" href="../images/app-icon.png" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body>
<div class="disclaimer-banner"><div class="container"><p>⚠️ यह SKYWAVE ERA TECHNOLOGY की निजी informational website है। यह किसी सरकारी विभाग का official portal नहीं है।</p></div></div>
<header class="site-header"><div class="container"><nav class="navbar"><a href="../index.html" class="nav-brand"><img src="../images/app-icon.png" alt="Logo" width="42" height="42" /><span>All Sarkari Yojana<span class="brand-sub">सरकारी योजनाओं की जानकारी</span></span></a><ul class="nav-links"><li><a href="../index.html">होम</a></li><li><a href="../category/all-yojana.html">सभी योजनाएं</a></li><li><a href="../search.html">खोजें</a></li><li><a href="../state/index.html">राज्य</a></li></ul><button class="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button></nav></div></header>
<div class="page-breadcrumb"><div class="container"><nav class="breadcrumb"><a href="../index.html">होम</a><span class="sep">›</span><a href="../state/${scheme.stateSlug}.html">${htmlEscape(scheme.state)}</a><span class="sep">›</span><span>${htmlEscape(scheme.name)}</span></nav></div></div>
<section class="scheme-detail-hero"><div class="container"><span class="cat-badge">${htmlEscape(scheme.category)}</span><h1>${htmlEscape(scheme.name)}</h1><p class="hindi-name">${htmlEscape(scheme.hindiName)}</p><p class="short-desc">${htmlEscape(scheme.summary)}</p></div></section>
<main id="main-content"><div class="container"><div class="scheme-content-wrapper"><div class="scheme-main-content">
  <div class="content-card"><h2>📌 योजना की जानकारी</h2><p>${htmlEscape(scheme.summary)} यह page users को योजना की basic Hindi जानकारी, official portal और application direction देने के लिए बनाया गया है।</p><div class="info-box"><p>📢 पात्रता, राशि, अंतिम तिथि और application status समय के साथ बदल सकते हैं। आवेदन से पहले official website पर latest जानकारी जरूर देखें।</p></div></div>
  <div class="content-card"><h2>✅ मुख्य लाभ</h2><ul><li>योजना से जुड़े प्रमुख लाभ और सहायता official rules के अनुसार मिलती है।</li><li>लाभ DBT, service portal, subsidy, pension, loan, training या welfare support के रूप में हो सकता है।</li><li>सही लाभ और amount के लिए official portal पर latest guideline देखें।</li></ul></div>
  <div class="content-card"><h2>👤 पात्रता</h2><ul><li>पात्रता राज्य/केंद्र सरकार के official नियमों के अनुसार तय होती है।</li><li>आयु, आय, निवास, category, occupation या documents जैसी conditions लागू हो सकती हैं।</li><li>Apply करने से पहले official eligibility section जरूर पढ़ें।</li></ul></div>
  <div class="content-card"><h2>📄 जरूरी दस्तावेज</h2><ul><li>आधार कार्ड / पहचान पत्र</li><li>निवास प्रमाण / राज्य से जुड़े documents</li><li>बैंक खाता, mobile number और scheme-specific certificates</li></ul></div>
  <div class="content-card"><h2>📝 आवेदन कैसे करें</h2><div class="steps-list"><div class="step-item"><div class="step-num">1</div><div class="step-content"><h3>Official portal खोलें</h3><p><a href="${htmlEscape(scheme.officialUrl)}" target="_blank" rel="noopener">${htmlEscape(scheme.officialUrl)}</a> पर जाएं।</p></div></div><div class="step-item"><div class="step-num">2</div><div class="step-content"><h3>Eligibility और form देखें</h3><p>Official portal पर registration, login, form, documents और instructions देखें।</p></div></div><div class="step-item"><div class="step-num">3</div><div class="step-content"><h3>Application submit करें</h3><p>सही जानकारी भरकर application submit करें और acknowledgement/status number सुरक्षित रखें।</p></div></div></div></div>
  <div class="content-card"><h2>❓ सामान्य प्रश्न</h2><div class="faq-list"><div class="faq-item"><div class="faq-question" role="button" tabindex="0">${htmlEscape(scheme.hindiName)} के लिए आवेदन कहां करें? <span class="faq-toggle">+</span></div><div class="faq-answer">इस योजना के official portal पर आवेदन या eligibility details देखें। नीचे official website link दिया गया है।</div></div><div class="faq-item"><div class="faq-question" role="button" tabindex="0">क्या यह official government page है? <span class="faq-toggle">+</span></div><div class="faq-answer">नहीं। यह निजी informational page है। Official और final जानकारी के लिए government portal देखें।</div></div></div></div>
</div><aside class="scheme-sidebar"><div class="sidebar-card"><h3>🌐 आधिकारिक वेबसाइट</h3><a href="${htmlEscape(scheme.officialUrl)}" target="_blank" rel="noopener noreferrer" class="official-link-btn">Official Portal <span class="ext-icon">↗</span></a></div><div class="sidebar-card"><h3>🏷️ श्रेणी</h3><p><strong>${htmlEscape(scheme.category)}</strong><br />${htmlEscape(scheme.state)}</p></div><div class="download-app-sidebar"><h3>📱 ऐप डाउनलोड करें</h3><p>सभी योजनाओं की जानकारी एक ऐप में</p><a href="https://play.google.com/store/apps/details?id=com.skywave.allsarkariyojna" target="_blank" rel="noopener" class="btn btn-accent btn-sm" style="width:100%;justify-content:center;margin-top:4px;">Google Play</a></div></aside></div></div></main>
<footer class="site-footer"><div class="container"><div class="footer-bottom"><p>© 2024 All Sarkari Yojana | SKYWAVE ERA TECHNOLOGY</p><div class="footer-legal-links"><a href="../legal/privacy-policy.html">Privacy</a><a href="../legal/terms.html">Terms</a><a href="../legal/disclaimer.html">Disclaimer</a></div></div></div></footer>
<button id="back-to-top" aria-label="Back to top" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:var(--primary);color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;z-index:999;">↑</button>
<script src="../js/main.js" defer></script>
</body>
</html>
`;
}

function writeSchemePages() {
  fs.mkdirSync(yojanaDir, { recursive: true });
  for (const scheme of schemes) {
    const file = path.join(yojanaDir, `${scheme.id}.html`);
    if (!fs.existsSync(file)) fs.writeFileSync(file, schemePage(scheme), "utf8");
  }
}

function statePage(state) {
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${htmlEscape(state.name)} सरकारी योजनाएं | All Sarkari Yojana</title>
  <meta name="description" content="${htmlEscape(state.name)} की सरकारी योजनाएं हिंदी में देखें। Official links, category filter और search के साथ state-wise scheme directory।" />
  <link rel="canonical" href="https://allsarkariyojana.in/state/${state.slug}.html" />
  <link rel="icon" type="image/png" href="../images/app-icon.png" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body>
<div class="disclaimer-banner"><div class="container"><p>⚠️ यह निजी informational website है। आवेदन के लिए official portal पर जाएं।</p></div></div>
<header class="site-header"><div class="container"><nav class="navbar"><a href="../index.html" class="nav-brand"><img src="../images/app-icon.png" alt="All Sarkari Yojana" width="42" height="42" /><span>All Sarkari Yojana<span class="brand-sub">सरकारी योजनाओं की जानकारी</span></span></a><ul class="nav-links"><li><a href="../index.html">होम</a></li><li><a href="index.html">राज्य</a></li><li><a href="../search.html">खोजें</a></li><li><a href="../category/all-yojana.html">सभी</a></li></ul><button class="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button></nav></div></header>
<div class="page-breadcrumb"><div class="container"><nav class="breadcrumb"><a href="../index.html">होम</a><span class="sep">›</span><a href="index.html">राज्य</a><span class="sep">›</span><span>${htmlEscape(state.name)}</span></nav></div></div>
<section class="category-hero"><div class="container"><span class="cat-emoji">🗺️</span><h1>${htmlEscape(state.name)} सरकारी योजनाएं</h1><p>${htmlEscape(state.description)}</p></div></section>
<main class="section" data-scheme-directory data-state="${htmlEscape(state.slug)}"><div class="container"><div class="directory-tools directory-tools-compact"><input type="search" id="directory-search" placeholder="${htmlEscape(state.name)} योजना खोजें..." aria-label="योजना खोजें" /><select id="directory-category" aria-label="श्रेणी चुनें"></select></div><div class="directory-summary"><strong id="directory-count">0 योजना मिली</strong><span>State-wise data से render हो रहा है।</span></div><div class="schemes-grid" id="directory-grid"></div><p class="directory-empty" id="directory-empty" hidden>कोई योजना नहीं मिली।</p></div></main>
<footer class="site-footer"><div class="container"><div class="footer-bottom"><p>© 2024 All Sarkari Yojana | SKYWAVE ERA TECHNOLOGY</p></div></div></footer>
<button id="back-to-top" aria-label="Back to top" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:var(--primary);color:white;border:none;border-radius:50%;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s;z-index:999;">↑</button>
<script src="../data/schemes.js"></script><script src="../js/scheme-directory.js" defer></script><script src="../js/main.js" defer></script>
</body>
</html>
`;
}

function writeStatePages() {
  fs.mkdirSync(stateDir, { recursive: true });
  for (const state of statesToAdd) {
    fs.writeFileSync(path.join(stateDir, `${state.slug}.html`), statePage(state), "utf8");
  }
}

function updateSitemap() {
  let xml = fs.readFileSync(sitemapPath, "utf8");
  const urls = [
    ...statesToAdd.map((state) => `https://allsarkariyojana.in/state/${state.slug}.html`),
    ...schemes.map((scheme) => `https://allsarkariyojana.in/yojana/${scheme.id}.html`)
  ];
  const blocks = urls
    .filter((url) => !xml.includes(`<loc>${url}</loc>`))
    .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-06-20</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${url.includes("/state/") ? "0.85" : "0.8"}</priority>\n  </url>`)
    .join("\n");
  if (blocks) xml = xml.replace("\n</urlset>", `\n\n  <!-- Phase 2 Scheme Expansion -->\n${blocks}\n\n</urlset>`);
  fs.writeFileSync(sitemapPath, xml, "utf8");
}

updateData();
writeSchemePages();
writeStatePages();
updateSitemap();

console.log(`Added ${schemes.length} schemes and ${statesToAdd.length} state pages.`);
