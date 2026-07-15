const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const Category = require('../models/Category');
const State = require('../models/State');
const Job = require('../models/Job');
const Result = require('../models/Result');
const AdmitCard = require('../models/AdmitCard');
const Scholarship = require('../models/Scholarship');
const News = require('../models/News');
const Blog = require('../models/Blog');
const Faq = require('../models/Faq');
const Page = require('../models/Page');
const Announcement = require('../models/Announcement');
const Banner = require('../models/Banner');
const Advertisement = require('../models/Advertisement');
const Feedback = require('../models/Feedback');
const ContactMessage = require('../models/ContactMessage');
const SystemSetting = require('../models/SystemSetting');
const AnswerKey = require('../models/AnswerKey');
const Syllabus = require('../models/Syllabus');
const Admission = require('../models/Admission');
const Document = require('../models/Document');

// GET /api/v1/public/home
router.get('/home', async (req, res) => {
  try {
    const banners = await Banner.find({ status: 'PUBLISHED' }).sort({ priority: -1 }).limit(5);
    const featured = await Scheme.find({ status: 'PUBLISHED', featured: true }).populate('category').populate('state').limit(10);
    const trending = await Scheme.find({ status: 'PUBLISHED', trending: true }).populate('category').populate('state').limit(10);
    const popular = await Scheme.find({ status: 'PUBLISHED', popular: true }).populate('category').populate('state').limit(10);
    const categories = await Category.find().limit(12);
    const states = await State.find().limit(12);
    const announcements = await Announcement.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(5);
    const advertisements = await Advertisement.find({ status: 'PUBLISHED' });

    // Sarkari Result Lists
    const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const admitCards = await AdmitCard.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const results = await Result.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const answerKeys = await AnswerKey.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const syllabus = await Syllabus.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const admissions = await Admission.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);
    const documents = await Document.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(15);

    res.json({
      banners,
      featured,
      trending,
      popular,
      categories,
      states,
      announcements,
      advertisements,
      jobs,
      admitCards,
      results,
      answerKeys,
      syllabus,
      admissions,
      documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/schemes (List, Search, Category filter, State filter)
router.get('/schemes', async (req, res) => {
  try {
    const { category, state, search } = req.query;
    const query = { status: 'PUBLISHED' };

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) query.category = catDoc._id;
    }
    if (state) {
      const stateDoc = await State.findOne({ slug: state });
      if (stateDoc) query.state = stateDoc._id;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { hindiName: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } }
      ];
    }

    const schemes = await Scheme.find(query)
      .populate('category')
      .populate('state')
      .sort({ priorityOrder: -1, createdAt: -1 })
      .select('title hindiName slug shortDesc category state featured trending popular createdAt');

    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/schemes/:slug
router.get('/schemes/:slug', async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ slug: req.params.slug, status: 'PUBLISHED' })
      .populate('category')
      .populate('state');

    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    // Increment views asynchronously
    scheme.views = (scheme.views || 0) + 1;
    await scheme.save();

    res.json(scheme);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/categories/:slug
router.get('/categories/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    const schemes = await Scheme.find({ category: category._id, status: 'PUBLISHED' })
      .populate('category')
      .populate('state');

    res.json({ category, schemes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/states
router.get('/states', async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/states/:slug
router.get('/states/:slug', async (req, res) => {
  try {
    const state = await State.findOne({ slug: req.params.slug });
    if (!state) return res.status(404).json({ error: 'State not found' });
    
    const schemes = await Scheme.find({ state: state._id, status: 'PUBLISHED' })
      .populate('category')
      .populate('state');

    res.json({ state, schemes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reusable standard routes helper for simple collections (Jobs, Results, etc.)
const createPublicEndpoints = (modelName, Model) => {
  router.get(`/${modelName}`, async (req, res) => {
    try {
      const items = await Model.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get(`/${modelName}/:slug`, async (req, res) => {
    try {
      const item = await Model.findOne({ slug: req.params.slug, status: 'PUBLISHED' });
      if (!item) return res.status(404).json({ error: `${modelName} not found` });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

createPublicEndpoints('jobs', Job);
createPublicEndpoints('results', Result);
createPublicEndpoints('admit-cards', AdmitCard);
createPublicEndpoints('scholarships', Scholarship);
createPublicEndpoints('news', News);
createPublicEndpoints('blogs', Blog);
createPublicEndpoints('pages', Page);
createPublicEndpoints('answer-keys', AnswerKey);
createPublicEndpoints('syllabus', Syllabus);
createPublicEndpoints('admissions', Admission);
createPublicEndpoints('documents', Document);

// GET /api/v1/public/faqs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await Faq.find({ status: 'PUBLISHED' });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/public/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/public/feedback
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, message, type } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'Name and message are required' });
    
    const feedback = new Feedback({ name, email, message, type });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/public/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
    
    const contact = new ContactMessage({ name, email, phone, subject, message });
    await contact.save();
    res.status(201).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
