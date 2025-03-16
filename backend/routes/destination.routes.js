
const express = require('express');
const Destination = require('../models/destination.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/destinations
// @desc    Get all destinations
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const destinations = await Destination.find()
      .select('city country clues fun_fact trivia image');
    res.json(destinations);
  } catch (err) {
    console.error('Get destinations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/destinations/random
// @desc    Get a random destination
// @access  Private
router.get('/random', authMiddleware, async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    
    if (!destination) {
      return res.status(404).json({ message: 'No destinations found' });
    }
    
    res.json(destination);
  } catch (err) {
    console.error('Get random destination error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get destination by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (err) {
    console.error('Get destination error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
