import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number,
    
  },
  location: {
    type: String,
    
  },
  website: String,
  logoUrl: String,
  images: [String],
  established: Date,
  licenseNumber: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalProperties: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', companySchema);