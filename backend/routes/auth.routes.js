
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('username', 'Username is required').notEmpty().trim().escape()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username } = req.body;
  
  try {
    // Check if user exists
    let user = await User.findOne({ username });
    
    // Create user if they don't exist
    if (!user) {
      user = new User({
        username,
        gameStats: {
          gamesPlayed: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          score: 0
        }
      });
      await user.save();
    }
    
    // Create and return JWT token
    const payload = {
      userId: user._id
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            gameStats: user.gameStats
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        gameStats: req.user.gameStats,
        challenges: req.user.challenges
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
