
require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/destination.model');
const { destinations } = require('./gameData');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // Clear existing destinations
    await Destination.deleteMany({});
    
    console.log('Existing destinations cleared');
    
    // Format the data to match our schema
    const formattedDestinations = destinations.map(dest => ({
      city: dest.city,
      country: dest.country,
      clues: dest.clues,
      fun_fact: dest.fun_fact,
      trivia: dest.trivia,
      image: dest.image || null
    }));
    
    // Insert destinations
    await Destination.insertMany(formattedDestinations);
    
    console.log(`${formattedDestinations.length} destinations imported successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Data import error:', error);
    process.exit(1);
  }
};

importData();
