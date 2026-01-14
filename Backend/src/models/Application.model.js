import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true
    },
    // Why do you want to join?
    motivation: {
      type: String,
      required: [true, 'Please tell us why you want to join'],
      minlength: [50, 'Please write at least 50 characters'],
      maxlength: [1000, 'Motivation cannot exceed 1000 characters'],
      trim: true
    },
    // Skills and interests
    skills: {
      type: [String], // Array of strings
      required: [true, 'Please mention at least one skill which pulled you here'],
      validate: {
        validator: function(arr) {
          return arr.length > 0 && arr.length <= 10;
        },
        message: 'Please provide a skills'
      }
    },
    // Previous experience (optional)
    previousExperience: {
      type: String,
      maxlength: [500, 'Experience description cannot exceed 500 characters'],
      trim: true,
      default: ''
    },
    // Application status
    status: {
      type: String,
      enum: ['pending', 'under-review', 'accepted', 'rejected'],
      default: 'pending'
    },
    // Admin notes (only admins can see/edit this)
    adminNotes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
      default: ''
    },
    // When was the status last updated
    statusUpdatedAt: {
      type: Date,
      default: Date.now
    },
    // Track who reviewed this application (optional)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// INDEX: For faster queries
applicationSchema.index({ user: 1 }); // Find applications by user
applicationSchema.index({ status: 1 }); // Find applications by status
applicationSchema.index({ createdAt: -1 }); // Sort by date (newest first)

// MIDDLEWARE: Update statusUpdatedAt when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusUpdatedAt = Date.now();
  }
  next();
});

// METHOD: Check if user can edit application
applicationSchema.methods.canBeEditedBy = function(userId) {
  // Only pending applications can be edited by the user who created them
  return this.status === 'pending' && this.user.toString() === userId.toString();
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;