import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    rollNumber: {
      type: String,
      sparse: true,
      trim: true
    },
    profilePicture: {
      type: String,
      default: ''
    },
    refreshToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// MIDDLEWARE: Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    // throw to fail the save
    throw error;
  }
});

// METHOD: Compare password for login
userSchema.methods.comparePassword =async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// METHOD: Generate Access Token (short-lived)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
    }
  );
};

// METHOD: Generate Refresh Token (long-lived)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    }
  );
};

const User = mongoose.model('User', userSchema);

export default User;