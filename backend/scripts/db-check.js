const mongoose = require('mongoose');
require('dotenv').config();

console.log('CWD:', process.cwd());
console.log('ENV URI:', process.env.MONGODB_URI);

const State = require('../models/State');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/allsarkariyojana');
    console.log('Connected DB Host:', mongoose.connection.host);
    console.log('Connected DB Name:', mongoose.connection.name);
    const count = await State.countDocuments();
    console.log('State Documents Count:', count);
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}
test();
