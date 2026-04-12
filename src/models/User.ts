import mongoose from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  siteId?: string; // Omada Site ID for Business Owners
  whatsappNumber?: string; // For dynamic support routing
  paystackSubaccountCode?: string; // For payment routing
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.BUSINESS_OWNER,
    required: true,
  },
  siteId: {
    type: String,
    required: function(this: IUser) {
      return this.role === UserRole.BUSINESS_OWNER;
    },
    trim: true,
  },
  whatsappNumber: {
    type: String,
    trim: true,
  },
  paystackSubaccountCode: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ siteId: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
