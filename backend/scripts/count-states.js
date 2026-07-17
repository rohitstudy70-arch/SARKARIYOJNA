const mongoose = require('mongoose');
const State = require('../models/State');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/allsarkariyojana';

async function count() {
  try {
    await mongoose.connect(mongoURI);
    const count = await State.countDocuments();
    const list = await State.find({}, 'name slug');
    console.log(`Count: ${count}`);
    console.log('List of states inside database:', list.map(s => s.name));
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}
count();
