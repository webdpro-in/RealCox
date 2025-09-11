import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priceRange: {
    type: String,
    // required: true
  },
  area: {
    type: Number,
    // required: true
  },
  unit: {
    type: String,
    enum: ['sqft', 'acres', 'hectares'],
    default: 'sqft'
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  images: [String],
  propertyType: {
    type: String,
    enum: ['residential', 'commercial', 'agricultural', 'industrial'],
    // required: true
  },
  listingType: {
    type: String,
    enum: ['sale', 'rent', 'lease'],
    // required: true
  },
  amenities: [String],
  nearbyFacilities: [String],
  legalStatus: {
    type: String,
    enum: ['clear', 'disputed', 'under-litigation'],
    default: 'clear'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Land', landSchema);