import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'agricultural', 'industrial']
  },
  listingType: {
    type: String,
    required: true,
    enum: ['buy', 'rent', 'lease']
  },
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  location: {
    type: String,
    required: true
  },
  area: {
    min: Number,
    max: Number
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'matched', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Requirement', requirementSchema);