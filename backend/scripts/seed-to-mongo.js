require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Mongoose Models
const AdminUser = require('../models/AdminUser');
const Category = require('../models/Category');
const State = require('../models/State');
const District = require('../models/District');
const Scheme = require('../models/Scheme');
const SystemSetting = require('../models/SystemSetting');
const Banner = require('../models/Banner');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/allsarkariyojana';
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB for seeding.`);
};

async function seed() {
  try {
    await connectDB();

    console.log('Clearing old database collections...');
    await Promise.all([
      AdminUser.deleteMany({}),
      Category.deleteMany({}),
      State.deleteMany({}),
      District.deleteMany({}),
      Scheme.deleteMany({}),
      SystemSetting.deleteMany({}),
      Banner.deleteMany({})
    ]);
    console.log('Old collections cleared.');

    // 1. Create Default Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'contact@sarkariyojana.app').toLowerCase();
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    
    const admin = new AdminUser({
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    });
    await admin.save();
    console.log(`\n========================================`);
    console.log(`Default Admin Created:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPass}`);
    console.log(`========================================\n`);

    // 2. Read seed.json
    const seedPath = path.join(__dirname, '../../nextjs-archive/prisma/seed.json');
    if (!fs.existsSync(seedPath)) {
      console.log('No seed.json found in nextjs-archive/prisma folder. Seeding default configuration only.');
      await seedSystemSettings();
      await mongoose.disconnect();
      return;
    }

    console.log('Reading seed.json...');
    const rawData = fs.readFileSync(seedPath, 'utf-8');
    const data = JSON.parse(rawData);

    const categoryIdMap = {};
    const stateIdMap = {};

    // 3. Seed Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`Seeding ${data.categories.length} categories...`);
      for (const cat of data.categories) {
        const newCat = new Category({
          slug: cat.slug,
          name: cat.name,
          hindiName: cat.hindiName || '',
          type: cat.type || 'scheme'
        });
        await newCat.save();
        categoryIdMap[cat.id] = newCat._id;
      }
      console.log('Categories seeded.');
    }

    // 4. Seed States
    if (data.states && data.states.length > 0) {
      console.log(`Seeding ${data.states.length} states...`);
      for (const st of data.states) {
        const newState = new State({
          slug: st.slug,
          name: st.name,
          hindiName: st.hindiName || ''
        });
        await newState.save();
        stateIdMap[st.id] = newState._id;
      }
      console.log('States seeded.');
    }

    // 5. Seed Schemes
    if (data.schemes && data.schemes.length > 0) {
      console.log(`Seeding ${data.schemes.length} schemes...`);
      let success = 0;
      for (const scheme of data.schemes) {
        try {
          const newScheme = new Scheme({
            slug: scheme.slug,
            title: scheme.title,
            hindiName: scheme.hindiName || '',
            shortDesc: scheme.shortDesc || '',
            content: scheme.content || '',
            eligibility: scheme.eligibility || '',
            benefits: scheme.benefits || '',
            documents: scheme.documents || '',
            officialLinks: scheme.officialLinks || '',
            applicationProcess: scheme.applicationProcess || '',
            images: scheme.images || '[]',
            category: scheme.categoryId ? (categoryIdMap[scheme.categoryId] || null) : null,
            state: scheme.stateId ? (stateIdMap[scheme.stateId] || null) : null,
            status: scheme.status || 'PUBLISHED',
            seoTitle: scheme.seoTitle || '',
            seoDesc: scheme.seoDesc || '',
            keywords: scheme.keywords || '',
            featured: scheme.featured || false,
            trending: scheme.trending || false,
            popular: scheme.popular || false,
            priorityOrder: scheme.priorityOrder || 0,
            views: scheme.views || 0
          });
          await newScheme.save();
          success++;
        } catch (err) {
          console.error(`Failed to seed scheme ${scheme.slug}: ${err.message}`);
        }
      }
      console.log(`Seeded ${success}/${data.schemes.length} schemes successfully.`);
    }

    // 6. Set Home Page Flags if not set
    const allSchemes = await Scheme.find().limit(30);
    if (allSchemes.length > 0) {
      console.log('Setting home page featured/trending/popular flags on sample schemes...');
      for (let i = 0; i < allSchemes.length; i++) {
        const s = allSchemes[i];
        if (i < 10) {
          s.featured = true;
        } else if (i < 20) {
          s.trending = true;
        } else if (i < 30) {
          s.popular = true;
        }
        await s.save();
      }
      console.log('Home page flags set.');
    }

    // 7. Seed System Settings
    await seedSystemSettings();

    console.log('Database seeding completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

async function seedSystemSettings() {
  console.log('Seeding System Settings...');
  const settings = [
    { key: 'admobAppId', value: 'ca-app-pub-9026245431226560~2596631953' },
    { key: 'adBanner', value: 'ca-app-pub-9026245431226560/6203493021' },
    { key: 'adInterstitial', value: 'ca-app-pub-9026245431226560/2520610337' },
    { key: 'adNative', value: 'ca-app-pub-9026245431226560/2171610603' },
    { key: 'adAppOpen', value: 'ca-app-pub-9026245431226560/4890411352' },
    { key: 'oneSignalAppId', value: 'f9f6ff5b-aa0c-4e35-9a80-59cd0df1f91f' },
    { key: 'siteName', value: 'All Sarkari Yojana' },
    { key: 'contactEmail', value: 'contact@sarkariyojana.app' },
    { key: 'minVersion', value: '1' },
    { key: 'latestVersion', value: '1' },
    { key: 'forceUpdate', value: 'false' },
    { key: 'maintenanceMode', value: 'false' }
  ];

  for (const s of settings) {
    await SystemSetting.findOneAndUpdate(
      { key: s.key },
      { value: s.value },
      { upsert: true, new: true }
    );
  }
  
  // Seed a sample Banner
  const bannerCount = await Banner.countDocuments();
  if (bannerCount === 0) {
    const banner = new Banner({
      title: 'PM Kisan Samman Nidhi Yojana 2026',
      imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
      link: '/yojana/pm-kisan-samman-nidhi',
      position: 'homepage',
      status: 'PUBLISHED',
      priority: 1
    });
    await banner.save();
    console.log('Sample banner created.');
  }

  console.log('System Settings seeded.');
}

seed();
