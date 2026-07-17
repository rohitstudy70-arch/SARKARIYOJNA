const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/allsarkariyojana';

const categoriesToSeed = [
  // Students (छात्र)
  { name: 'Students', slug: 'students', hindiName: 'छात्र (Students)' },
  { name: 'Scholarship', slug: 'scholarship', hindiName: 'छात्रवृत्ति (Scholarship)' },
  { name: 'Free Laptop and Bicycle', slug: 'free-laptop-bicycle', hindiName: 'फ्री लैपटॉप/साइकिल (कुछ राज्यों में)' },
  { name: 'Education Loan Assistance', slug: 'education-loan-assistance', hindiName: 'शिक्षा ऋण सहायता' },
  { name: 'Skill Development', slug: 'skill-development', hindiName: 'स्किल डेवलपमेंट' },

  // Women (महिलाएँ)
  { name: 'Women', slug: 'women', hindiName: 'महिलाएँ (Women)' },
  { name: 'Self Employment Assistance', slug: 'self-employment-assistance', hindiName: 'स्वरोजगार सहायता' },
  { name: 'Maternity Benefits', slug: 'maternity-benefits', hindiName: 'मातृत्व लाभ' },
  { name: 'Self Help Groups (SHG)', slug: 'self-help-groups-shg', hindiName: 'स्वयं सहायता समूह (SHG)' },
  { name: 'Girl Child Education and Marriage Assistance', slug: 'girl-child-assistance', hindiName: 'बेटियों की शिक्षा और विवाह सहायता' },

  // Farmers (किसान)
  { name: 'Farmers', slug: 'farmers', hindiName: 'किसान (Farmers)' },
  { name: 'Crop Insurance', slug: 'crop-insurance', hindiName: 'फसल बीमा' },
  { name: 'Fertilizer and Seed Subsidy', slug: 'fertilizer-seed-subsidy', hindiName: 'खाद-बीज सब्सिडी' },
  { name: 'Irrigation Schemes', slug: 'irrigation-schemes', hindiName: 'सिंचाई योजनाएँ' },
  { name: 'Agri Equipment Subsidy', slug: 'agri-equipment-subsidy', hindiName: 'कृषि उपकरण पर सब्सिडी' },

  // Unemployed Youth (बेरोजगार युवा)
  { name: 'Unemployed Youth', slug: 'unemployed-youth', hindiName: 'बेरोजगार युवा (Unemployed Youth)' },
  { name: 'Skill Training', slug: 'skill-training', hindiName: 'स्किल ट्रेनिंग' },
  { name: 'Employment Schemes', slug: 'employment-schemes', hindiName: 'रोजगार योजनाएँ' },
  { name: 'Startup and Business Loan', slug: 'startup-business-loan', hindiName: 'स्टार्टअप और बिजनेस लोन' },

  // Senior Citizens (वरिष्ठ नागरिक)
  { name: 'Senior Citizens', slug: 'senior-citizens', hindiName: 'वरिष्ठ नागरिक (Senior Citizens)' },
  { name: 'Old Age Pension', slug: 'old-age-pension', hindiName: 'वृद्धावस्था पेंशन' },
  { name: 'Health Assistance', slug: 'health-assistance', hindiName: 'स्वास्थ्य सहायता' },
  { name: 'Social Security Schemes', slug: 'social-security-schemes', hindiName: 'सामाजिक सुरक्षा योजनाएँ' },

  // Persons with Disabilities (दिव्यांग)
  { name: 'Persons with Disabilities', slug: 'disabled', hindiName: 'दिव्यांग (Persons with Disabilities)' },
  { name: 'Disabled Pension', slug: 'disabled-pension', hindiName: 'पेंशन (दिव्यांग)' },
  { name: 'Special Education Assistance', slug: 'disabled-education', hindiName: 'शिक्षा सहायता (दिव्यांग)' },
  { name: 'Assistive Devices', slug: 'disabled-devices', hindiName: 'उपकरण सहायता' },
  { name: 'Employment Support', slug: 'disabled-employment', hindiName: 'नौकरी में सहायता' },

  // Poor Families (BPL/EWS) (गरीब परिवार)
  { name: 'Poor Families (BPL/EWS)', slug: 'poor-families-bpl-ews', hindiName: 'गरीब परिवार (BPL/EWS)' },
  { name: 'Ration', slug: 'ration', hindiName: 'राशन' },
  { name: 'Housing', slug: 'housing', hindiName: 'आवास' },
  { name: 'Free Medical Treatment', slug: 'free-treatment', hindiName: 'मुफ्त इलाज' },
  { name: 'Gas Connection', slug: 'gas-connection', hindiName: 'गैस कनेक्शन' },
  { name: 'Toilet Construction', slug: 'toilet-construction', hindiName: 'शौचालय निर्माण' },

  // Workers/Labourers (मजदूर)
  { name: 'Workers and Labourers', slug: 'workers-labourers', hindiName: 'मजदूर (Workers/Labourers)' },
  { name: 'Accident Insurance', slug: 'accident-insurance', hindiName: 'दुर्घटना बीमा' },
  { name: 'Life Insurance', slug: 'life-insurance', hindiName: 'जीवन बीमा' },
  { name: 'Worker Pension', slug: 'worker-pension', hindiName: 'पेंशन (मजदूर)' },
  { name: 'Building and Construction Worker Schemes', slug: 'construction-worker-schemes', hindiName: 'भवन एवं निर्माण श्रमिक योजनाएँ' },

  // Traders and MSME (व्यापारी और MSME)
  { name: 'Traders and MSMEs', slug: 'traders-msme', hindiName: 'व्यापारी और MSME' },
  { name: 'Business Loans', slug: 'business-loans', hindiName: 'बिजनेस लोन' },
  { name: 'Subsidies', slug: 'subsidies', hindiName: 'सब्सिडी' },
  { name: 'Digital Business Support', slug: 'digital-business-support', hindiName: 'डिजिटल बिजनेस सहायता' },
  { name: 'Export Promotion', slug: 'export-promotion', hindiName: 'निर्यात प्रोत्साहन' },

  // SC / ST / OBC / EWS
  { name: 'SC / ST / OBC / EWS', slug: 'sc-st-obc-ews', hindiName: 'SC / ST / OBC / EWS' },
  { name: 'SC/ST Hostel Facility', slug: 'sc-st-hostel', hindiName: 'हॉस्टल सुविधा' },
  { name: 'SC/ST Skill Training', slug: 'sc-st-skill-training', hindiName: 'कौशल प्रशिक्षण' },
  { name: 'SC/ST Entrepreneurship Support', slug: 'sc-st-entrepreneurship', hindiName: 'उद्यमिता सहायता' },

  // Soldiers and Ex-Servicemen (सैनिक और पूर्व सैनिक)
  { name: 'Soldiers and Ex-Servicemen', slug: 'soldiers-ex-servicemen', hindiName: 'सैनिक और पूर्व सैनिक (Ex-Servicemen)' },
  { name: 'Ex-Servicemen Pension', slug: 'military-pension', hindiName: 'पेंशन (सैनिक)' },
  { name: 'Military Health Facilities', slug: 'military-health-facilities', hindiName: 'स्वास्थ्य सुविधाएँ' },
  { name: 'Soldiers Children Education', slug: 'military-children-education', hindiName: 'बच्चों की शिक्षा सहायता' },
  { name: 'Rehabilitation Schemes', slug: 'rehabilitation-schemes', hindiName: 'पुनर्वास योजनाएँ' },

  // All Citizens (सभी नागरिकों के लिए)
  { name: 'All Citizens', slug: 'all-citizens', hindiName: 'सभी नागरिकों के लिए' },
  { name: 'Health Insurance', slug: 'health-insurance', hindiName: 'स्वास्थ्य बीमा' },
  { name: 'Pension Schemes', slug: 'pension-schemes', hindiName: 'पेंशन योजनाएँ' },
  { name: 'Banking and Financial Inclusion', slug: 'banking-financial-inclusion', hindiName: 'बैंकिंग और वित्तीय समावेशन' },
  { name: 'Digital Services', slug: 'digital-services', hindiName: 'डिजिटल सेवाएँ' }
];

async function seedCategories() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding Yojana Categories...');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of categoriesToSeed) {
      const existing = await Category.findOne({ slug: item.slug });
      if (existing) {
        existing.name = item.name;
        existing.hindiName = item.hindiName;
        await existing.save();
        updatedCount++;
      } else {
        const newCat = new Category(item);
        await newCat.save();
        insertedCount++;
      }
    }

    console.log(`Categories seeding completed. Total processed: ${categoriesToSeed.length}`);
    console.log(`Successfully Created: ${insertedCount} categories`);
    console.log(`Successfully Updated: ${updatedCount} categories`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding categories:', err);
  }
}

seedCategories();
