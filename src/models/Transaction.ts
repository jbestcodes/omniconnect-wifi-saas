
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
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
