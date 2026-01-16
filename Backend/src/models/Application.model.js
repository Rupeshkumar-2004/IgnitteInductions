import mongoose from 'mongoose';

// 1. Define Task Schema (REQUIRED for the admin to assign tasks)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'submitted', 'verified', 'rejected'], 
    default: 'pending' 
  },
  studentSubmission: String,
  adminFeedback: String,
  createdAt: { type: Date, default: Date.now }
});

// 2. Define Round Schema (Optional, but good for future)
const roundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedback: String,
  verdict: { type: String, enum: ['passed', 'failed', 'hold'], default: 'hold' },
  date: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    motivation: {
      type: String,
      required: [true, 'Please tell us why you want to join'],
      trim: true
    },
    skills: {
      type: [String],
      required: [true, 'Please mention at least one skill']
    },
    previousExperience: {
      type: String,
      default: ''
    },
    course: { type: String }, // Ensure this exists

    status: {
      type: String,
      enum: ['pending', 'under-review', 'accepted', 'rejected'],
      default: 'pending'
    },

    // --- CRITICAL: Add the tasks array here ---
    tasks: [taskSchema], 
    // ------------------------------------------

    currentRound: { type: String, default: 'Application Review' },
    rounds: [roundSchema],

    adminNotes: {
      type: String,
      default: ''
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

applicationSchema.pre('save',async function(next) {
  if (this.isModified('status')) {
    this.statusUpdatedAt = Date.now();
  }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;