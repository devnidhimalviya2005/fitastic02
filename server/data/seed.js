
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Food = require('../models/Food');
const foods = require('./foods.json');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Food.deleteMany({});
    await Food.insertMany(foods);
    console.log('Foods seeded:', foods.length);
  } catch (err) {
    console.log('Seed error:', err.message);
  } finally {
    process.exit();
  }
})();