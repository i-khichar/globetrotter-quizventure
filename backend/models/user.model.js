
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  gameStats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  challenges: [{
    challengeId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    }
  }]
});

// Virtual for user's URL (RESTful)
userSchema.virtual('url').get(function() {
  return `/api/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
