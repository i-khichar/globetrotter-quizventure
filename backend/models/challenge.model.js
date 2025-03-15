
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const challengeSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shareLink: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  participants: [participantSchema]
});

// Virtual for challenge's URL (RESTful)
challengeSchema.virtual('url').get(function() {
  return `/api/challenges/${this._id}`;
});

module.exports = mongoose.model('Challenge', challengeSchema);
