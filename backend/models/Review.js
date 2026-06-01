const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,   // links to a User document
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  feedback: {
    matchScore:    Number,
    strengths:     [String],    // array of strings
    gaps:          [String],
    suggestions:   [String]
  }
}, { timestamps: true });    // createdAt = when review was done

module.exports = mongoose.model('Review', reviewSchema);