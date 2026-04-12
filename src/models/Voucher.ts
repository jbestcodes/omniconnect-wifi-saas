import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: /^[A-Z0-9]{6}$/
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  status: {
    type: String,
    enum: ['unused', 'active', 'expired'],
    default: 'unused',
  },
  client_mac: {
    type: String,
    trim: true,
  },
  used_at: {
    type: Date,
  },
  expires_at: {
    type: Date,
  },
  created_by: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Index for faster lookups
VoucherSchema.index({ code: 1 });
VoucherSchema.index({ status: 1 });
VoucherSchema.index({ package_id: 1 });
VoucherSchema.index({ ownerId: 1 });

export default mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);
