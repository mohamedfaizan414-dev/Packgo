import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist: mongoose.Types.ObjectId[];
  bookingHistory: {
    planId: mongoose.Types.ObjectId;
    planTitle: string;
    bookedAt: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
  }[];
  preferences: {
    budget?: 'budget' | 'mid-range' | 'luxury';
    destinations?: string[];
    tripTypes?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'TravelPlan' }],
    bookingHistory: [
      {
        planId: { type: Schema.Types.ObjectId, ref: 'TravelPlan' },
        planTitle: String,
        bookedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
      },
    ],
    preferences: {
      budget: { type: String, enum: ['budget', 'mid-range', 'luxury'] },
      destinations: [String],
      tripTypes: [String],
    },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);
export default User;
