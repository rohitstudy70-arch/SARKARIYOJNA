const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const Job = require('../models/Job');
const Result = require('../models/Result');
const AdmitCard = require('../models/AdmitCard');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/sarkariyojna';

async function updateToHindi() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for Hindi translation updates...');

    // 1. Update some schemes to pure Hindi titles
    const schemesToUpdate = [
      { slug: 'anganwadi-icds', hindiTitle: 'आंगनवाड़ी / आईसीडीएस योजना (केंद्र सरकार)' },
      { slug: 'ap-amma-vodi', hindiTitle: 'अम्मा वोडी योजना (आंध्र प्रदेश सरकार)' },
      { slug: 'ap-jagananna-housing', hindiTitle: 'जगनन्ना आवास योजना (आंध्र प्रदेश)' },
      { slug: 'ap-jagananna-thodu', hindiTitle: 'जगनन्ना थोडु ऋण योजना' },
      { slug: 'pm-kisan-samman-nidhi', hindiTitle: 'प्रधानमंत्री किसान सम्मान निधि योजना (PM-KISAN)' },
      { slug: 'pm-awas-yojana-gramin', hindiTitle: 'प्रधानमंत्री आवास योजना ग्रामीण (PMAY-G)' },
      { slug: 'pm-shram-yogi-maan-dhan', hindiTitle: 'पीएम श्रम योगी मान-धन पेंशन योजना' },
      { slug: 'up-police-recruitment', hindiTitle: 'उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड' }
    ];

    for (const item of schemesToUpdate) {
      const scheme = await Scheme.findOne({ slug: item.slug });
      if (scheme) {
        scheme.title = item.hindiTitle;
        await scheme.save();
        console.log(`Updated scheme [${item.slug}] title to Hindi.`);
      }
    }

    // 2. Insert some Sample Jobs, Results, Admit Cards in pure Hindi to demonstrate
    console.log('Inserting sample Hindi Sarkari Result items...');

    // Delete existing sample jobs/results/admitcards that match the Hindi titles to prevent duplicate testing
    await Job.deleteMany({ slug: { $in: ['up-anganwadi-bharti-2026', 'rrb-technician-bharti'] } });
    await Result.deleteMany({ slug: { $in: ['up-police-constable-pariksha-parinam', 'ssc-gd-constable-parinam'] } });
    await AdmitCard.deleteMany({ slug: { $in: ['ctet-pariksha-pravesh-patra', 'uppsc-pcs-pravesh-patra'] } });

    // Insert Jobs
    await Job.create([
      {
        slug: 'up-anganwadi-bharti-2026',
        title: 'यूपी आंगनवाड़ी भर्ती 2026 ऑनलाइन फॉर्म (सभी जिलों के लिए)',
        status: 'PUBLISHED',
        applyLink: 'https://upanganwadibharti.in',
        officialLink: 'https://balvikasup.gov.in',
        content: 'उत्तर प्रदेश बाल विकास सेवा एवं पुष्टाहार विभाग द्वारा आंगनवाड़ी कार्यकत्री के पदों पर बम्पर भर्ती निकाली गई है। सभी योग्य महिला अभ्यर्थी नीचे दिए गए लिंक से ऑनलाइन आवेदन कर सकती हैं।'
      },
      {
        slug: 'rrb-technician-bharti',
        title: 'रेलवे आरआरबी तकनीशियन भर्ती 2026 (6565 पद) - आवेदन करें',
        status: 'PUBLISHED',
        applyLink: 'https://rrbapply.gov.in',
        officialLink: 'https://indianrailways.gov.in',
        content: 'भारतीय रेलवे भर्ती बोर्ड (RRB) द्वारा तकनीशियन (Technician Grade I & III) के पदों पर भर्ती के लिए आवेदन आमंत्रित किए गए हैं। आवेदन की अंतिम तिथि जल्द आ रही है।'
      }
    ]);

    // Insert Results
    await Result.create([
      {
        slug: 'up-police-constable-pariksha-parinam',
        title: 'यूपी पुलिस कांस्टेबल परीक्षा परिणाम 2026 - घोषित',
        status: 'PUBLISHED',
        resultLink: 'https://uppbpb.gov.in/results',
        officialLink: 'https://uppbpb.gov.in',
        content: 'उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड (UPPBPB) द्वारा कांस्टेबल परीक्षा 2025 का लिखित परीक्षा परिणाम आधिकारिक वेबसाइट पर जारी कर दिया गया है। अभ्यर्थी अपना रोल नंबर दर्ज कर परिणाम डाउनलोड कर सकते हैं।'
      }
    ]);

    // Insert Admit Cards
    await AdmitCard.create([
      {
        slug: 'ctet-pariksha-pravesh-patra',
        title: 'सीटीईटी परीक्षा प्रवेश पत्र (CTET Admit Card) - डाउनलोड लिंक सक्रिय',
        status: 'PUBLISHED',
        admitCardLink: 'https://ctet.nic.in',
        officialLink: 'https://ctet.nic.in',
        content: 'केंद्रीय माध्यमिक शिक्षा बोर्ड (CBSE) द्वारा आयोजित केंद्रीय शिक्षक पात्रता परीक्षा (CTET) 2026 का प्रवेश पत्र जारी कर दिया गया है। अभ्यर्थी नीचे दिए गए लिंक से डाउनलोड करें।'
      }
    ]);

    console.log('Hindi data translation demonstration successfully written to MongoDB.');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating Hindi data:', err);
  }
}

updateToHindi();
