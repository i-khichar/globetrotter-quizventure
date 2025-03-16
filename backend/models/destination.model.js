
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  clues: {
    type: [String],
    required: true,
    validate: [arrayMinLength, 'Destination must have at least one clue']
  },
  fun_fact: {
    type: [String],
    default: []
  },
  trivia: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: null
  }
});

// Validator to ensure array has at least one element
function arrayMinLength(val) {
  return val.length > 0;
}

// Virtual for destination's URL (RESTful)
destinationSchema.virtual('url').get(function() {
  return `/api/destinations/${this._id}`;
});

module.exports = mongoose.model('Destination', destinationSchema);
