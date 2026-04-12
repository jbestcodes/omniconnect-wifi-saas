
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  clientMac: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  paidAt: {
    type: Date,
  },
  accessDurationMinutes: {
    type: Number,
    default: 60,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subaccount: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Indexes for better performance
TransactionSchema.index({ ownerId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ paidAt: 1 });
TransactionSchema.index({ reference: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
