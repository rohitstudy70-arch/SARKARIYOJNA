const mongoose = require('mongoose');
const State = require('../models/State');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/allsarkariyojana';

const allIndianStatesAndUTs = [
  // 28 States
  { name: 'Andhra Pradesh', slug: 'andhra-pradesh', hindiName: 'आंध्र प्रदेश' },
  { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh', hindiName: 'अरुणाचल प्रदेश' },
  { name: 'Assam', slug: 'assam', hindiName: 'असम' },
  { name: 'Bihar', slug: 'bihar', hindiName: 'बिहार' },
  { name: 'Chhattisgarh', slug: 'chhattisgarh', hindiName: 'छत्तीसगढ़' },
  { name: 'Goa', slug: 'goa', hindiName: 'गोवा' },
  { name: 'Gujarat', slug: 'gujarat', hindiName: 'गुजरात' },
  { name: 'Haryana', slug: 'haryana', hindiName: 'हरियाणा' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', hindiName: 'हिमाचल प्रदेश' },
  { name: 'Jharkhand', slug: 'jharkhand', hindiName: 'झारखंड' },
  { name: 'Karnataka', slug: 'karnataka', hindiName: 'कर्नाटक' },
  { name: 'Kerala', slug: 'kerala', hindiName: 'केरल' },
  { name: 'Madhya Pradesh', slug: 'madhya-pradesh', hindiName: 'मध्य प्रदेश' },
  { name: 'Maharashtra', slug: 'maharashtra', hindiName: 'महाराष्ट्र' },
  { name: 'Manipur', slug: 'manipur', hindiName: 'मणिपुर' },
  { name: 'Meghalaya', slug: 'meghalaya', hindiName: 'मेघालय' },
  { name: 'Mizoram', slug: 'mizoram', hindiName: 'मिजोरम' },
  { name: 'Nagaland', slug: 'nagaland', hindiName: 'नागालैंड' },
  { name: 'Odisha', slug: 'odisha', hindiName: 'ओडिशा' },
  { name: 'Punjab', slug: 'punjab', hindiName: 'पंजाब' },
  { name: 'Rajasthan', slug: 'rajasthan', hindiName: 'राजस्थान' },
  { name: 'Sikkim', slug: 'sikkim', hindiName: 'सिक्किम' },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', hindiName: 'तमिलनाडु' },
  { name: 'Telangana', slug: 'telangana', hindiName: 'तेलंगाना' },
  { name: 'Tripura', slug: 'tripura', hindiName: 'त्रिपुरा' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', hindiName: 'उत्तर प्रदेश' },
  { name: 'Uttarakhand', slug: 'uttarakhand', hindiName: 'उत्तराखंड' },
  { name: 'West Bengal', slug: 'west-bengal', hindiName: 'पश्चिम बंगाल' },
  
  // 8 Union Territories
  { name: 'Andaman and Nicobar Islands', slug: 'andaman-nicobar', hindiName: 'अंडमान और निकोबार द्वीप समूह' },
  { name: 'Chandigarh', slug: 'chandigarh', hindiName: 'चंडीगढ़' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', slug: 'dadra-nagar-haveli-daman-diu', hindiName: 'दादरा और नगर हवेली एवं दमन और दीव' },
  { name: 'Delhi', slug: 'delhi', hindiName: 'दिल्ली' },
  { name: 'Jammu and Kashmir', slug: 'jammu-kashmir', hindiName: 'जम्मू और कश्मीर' },
  { name: 'Ladakh', slug: 'ladakh', hindiName: 'लद्दाख' },
  { name: 'Lakshadweep', slug: 'lakshadweep', hindiName: 'लक्षद्वीप' },
  { name: 'Puducherry', slug: 'puducherry', hindiName: 'पुडुचेरी' }
];

async function seedStates() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding states and UTs...');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of allIndianStatesAndUTs) {
      const existing = await State.findOne({ slug: item.slug });
      if (existing) {
        // Update to make sure it has the correct names
        existing.name = item.name;
        existing.hindiName = item.hindiName;
        await existing.save();
        updatedCount++;
      } else {
        // Create new state
        const newState = new State(item);
        await newState.save();
        insertedCount++;
      }
    }

    console.log(`State/UT seeding completed. Total processed: ${allIndianStatesAndUTs.length}`);
    console.log(`Successfully Created: ${insertedCount} states/UTs`);
    console.log(`Successfully Updated: ${updatedCount} states/UTs`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding states/UTs:', err);
  }
}

seedStates();
