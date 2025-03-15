
const express = require('express');
const { body, validationResult } = require('express-validator');
const Challenge = require('../models/challenge.model');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/challenges
// @desc    Create a new challenge
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Generate unique share link
    const shareId = Math.random().toString(36).substring(2, 10);
    const shareLink = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/game?challenge=${shareId}`;
    
    const newChallenge = new Challenge({
      creatorId: req.user._id,
      shareLink,
      participants: []
    });
    
    const challenge = await newChallenge.save();
    
    // Add challenge to user's challenges array
    await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { 
          challenges: { 
            challengeId: challenge._id,
            createdAt: new Date(),
            status: 'active'
          } 
        } 
      }
    );
    
    res.status(201).json(challenge);
  } catch (err) {
    console.error('Create challenge error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/challenges/:id
// @desc    Get challenge by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (err) {
    console.error('Get challenge error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/challenges/link/:shareId
// @desc    Get challenge by share ID
// @access  Private
router.get('/link/:shareId', authMiddleware, async (req, res) => {
  try {
    const shareLink = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/game?challenge=${req.params.shareId}`;
    const challenge = await Challenge.findOne({ shareLink });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (err) {
    console.error('Get challenge by share ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/challenges/:id/participate
// @desc    Add participant to challenge
// @access  Private
router.post('/:id/participate', [
  authMiddleware,
  body('score', 'Score must be a number').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { score } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Check if user already participated
    const existingParticipant = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );
    
    if (existingParticipant) {
      // Update existing participant's score if higher
      if (score > existingParticipant.score) {
        existingParticipant.score = score;
        existingParticipant.completedAt = new Date();
        await challenge.save();
      }
    } else {
      // Add new participant
      challenge.participants.push({
        userId: req.user._id,
        username: req.user.username,
        score,
        completedAt: new Date()
      });
      await challenge.save();
    }
    
    res.json(challenge);
  } catch (err) {
    console.error('Add participant error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/challenges/user/:userId
// @desc    Get challenges created by user
// @access  Private
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({ creatorId: req.params.userId });
    res.json(challenges);
  } catch (err) {
    console.error('Get user challenges error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
