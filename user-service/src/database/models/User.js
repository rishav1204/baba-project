import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  district: { type: String, trim: true },
  pincode: { type: String, trim: true },
  village: { type: String, trim: true },
  area: { type: String, trim: true },
  houseNo: { type: String, trim: true },
  isDefault: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 2 && 
               v[0] >= -180 && v[0] <= 180 && 
               v[1] >= -90 && v[1] <= 90;
      },
      message: 'Invalid coordinates'
    }
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  phone: {
    type: String,
    sparse: true,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  caste: {
    type: String,
    trim: true
  },
  addresses: [addressSchema],
  location: {
    type: locationSchema,
    index: '2dsphere'
  },
  deviceId: {
    type: String,
    trim: true
  },
  lastLoggedIn: {
    type: Date
  },
  webLastLoggedIn: {
    type: Date
  },
  currentVersion: {
    type: String,
    trim: true
  },
  loggedInType: {
    type: String,
    enum: ['EMAIL', 'PHONE', 'GOOGLE', 'GUEST'],
    default: 'EMAIL'
  },
  isNotificationEnabled: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en',
    trim: true
  },
  profilePic: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimized queries
userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
userSchema.index({ isDeleted: 1, isActive: 1 });
// userSchema.index({ location: '2dsphere' });

// Clean response data - remove sensitive fields
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otpData;
  return obj;
};

// Add virtual fields if needed
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lName || ''}`.trim();
});

const User = mongoose.model('User', userSchema);

export default User;