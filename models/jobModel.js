const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  status: {
    type: String,
    enum: ['hiring', 'closed'],
    default: 'hiring',
  },
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['job', 'internship'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: [{ type: String }],
  jobType: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'On-site',
  },
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      resumeLink: {
        url: String,
        filename: String,
      },
      reason: {
        type: String,
        required: true,
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
