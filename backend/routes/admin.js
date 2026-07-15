const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Models
const Scheme = require('../models/Scheme');
const Category = require('../models/Category');
const State = require('../models/State');
const District = require('../models/District');
const Job = require('../models/Job');
const Result = require('../models/Result');
const AdmitCard = require('../models/AdmitCard');
const Scholarship = require('../models/Scholarship');
const News = require('../models/News');
const Blog = require('../models/Blog');
const Faq = require('../models/Faq');
const Page = require('../models/Page');
const Announcement = require('../models/Announcement');
const Menu = require('../models/Menu');
const Redirect = require('../models/Redirect');
const Banner = require('../models/Banner');
const Advertisement = require('../models/Advertisement');
const Feedback = require('../models/Feedback');
const ContactMessage = require('../models/ContactMessage');
const SystemSetting = require('../models/SystemSetting');
const AnswerKey = require('../models/AnswerKey');
const Syllabus = require('../models/Syllabus');
const Admission = require('../models/Admission');
const Document = require('../models/Document');

// Apply JWT authentication middleware to all admin routes
router.use(authMiddleware);

// ================= STATS ENDPOINT =================
router.get('/stats', async (req, res) => {
  try {
    const [
      schemes, categories, states, jobs, results,
      admitCards, scholarships, news, blogs,
      feedbacks, contactMessages
    ] = await Promise.all([
      Scheme.countDocuments(),
      Category.countDocuments(),
      State.countDocuments(),
      Job.countDocuments(),
      Result.countDocuments(),
      AdmitCard.countDocuments(),
      Scholarship.countDocuments(),
      News.countDocuments(),
      Blog.countDocuments(),
      Feedback.countDocuments({ status: 'NEW' }),
      ContactMessage.countDocuments({ status: 'NEW' })
    ]);

    res.json({
      schemes,
      categories,
      states,
      jobs,
      results,
      admitCards,
      scholarships,
      news,
      blogs,
      newFeedbacks: feedbacks,
      newContactMessages: contactMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= SYSTEM SETTINGS ENDPOINTS =================
router.get('/settings', async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = req.body; // Expects array of { key, value } or object { key: value }
    if (Array.isArray(settings)) {
      for (const s of settings) {
        await SystemSetting.findOneAndUpdate(
          { key: s.key },
          { value: s.value },
          { upsert: true, new: true }
        );
      }
    } else {
      for (const [key, value] of Object.entries(settings)) {
        await SystemSetting.findOneAndUpdate(
          { key },
          { value: String(value) },
          { upsert: true, new: true }
        );
      }
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= SCHEMES CRUD WITH POPULATION =================
router.get('/schemes', async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const scheme = await Scheme.findById(id).populate('category').populate('state');
      if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
      return res.json(scheme);
    }
    const schemes = await Scheme.find().populate('category').populate('state').sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/schemes', async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/schemes', async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    if (!id) return res.status(400).json({ error: 'ID is required' });
    const scheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/schemes', async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'ID is required' });
    const scheme = await Scheme.findByIdAndDelete(id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json({ success: true, message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= CRUD ROUTE REGISTER HELPER =================
const registerCrud = (pathName, Model) => {
  router.get(`/${pathName}`, async (req, res) => {
    try {
      const { id } = req.query;
      if (id) {
        const item = await Model.findById(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        return res.json(item);
      }
      const items = await Model.find().sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post(`/${pathName}`, async (req, res) => {
    try {
      const item = new Model(req.body);
      await item.save();
      res.status(201).json({ success: true, item });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put(`/${pathName}`, async (req, res) => {
    try {
      const id = req.body.id || req.query.id || req.body._id;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete(`/${pathName}`, async (req, res) => {
    try {
      const id = req.query.id || req.body.id;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const item = await Model.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Register all other modules
registerCrud('categories', Category);
registerCrud('states', State);
registerCrud('districts', District);
registerCrud('jobs', Job);
registerCrud('results', Result);
registerCrud('admit-cards', AdmitCard);
registerCrud('scholarships', Scholarship);
registerCrud('news', News);
registerCrud('blogs', Blog);
registerCrud('faqs', Faq);
registerCrud('pages', Page);
registerCrud('announcements', Announcement);
registerCrud('menus', Menu);
registerCrud('redirects', Redirect);
registerCrud('banners', Banner);
registerCrud('advertisements', Advertisement);
registerCrud('feedbacks', Feedback);
registerCrud('contact-messages', ContactMessage);
registerCrud('answer-keys', AnswerKey);
registerCrud('syllabus', Syllabus);
registerCrud('admissions', Admission);
registerCrud('documents', Document);

module.exports = router;
