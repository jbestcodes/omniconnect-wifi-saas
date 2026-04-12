import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration_mins: {
    type: Number,
    required: true,
    min: 1,
  },
  data_limit_gb: {
    type: Number,
    required: true,
    min: 0,
  },
  is_unlimited: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Indexes for better performance
PackageSchema.index({ ownerId: 1 });
PackageSchema.index({ is_active: 1 });

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
