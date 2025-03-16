
const express = require('express');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/stats
// @desc    Update user game stats
// @access  Private
router.put('/stats', authMiddleware, async (req, res) => {
  try {
    const { gamesPlayed, correctAnswers, incorrectAnswers, score } = req.body;
    
    // Update only provided fields
    const updateFields = {};
    if (gamesPlayed !== undefined) updateFields['gameStats.gamesPlayed'] = gamesPlayed;
    if (correctAnswers !== undefined) updateFields['gameStats.correctAnswers'] = correctAnswers;
    if (incorrectAnswers !== undefined) updateFields['gameStats.incorrectAnswers'] = incorrectAnswers;
    if (score !== undefined) updateFields['gameStats.score'] = score;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        gameStats: user.gameStats
      }
    });
  } catch (err) {
    console.error('Update stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
