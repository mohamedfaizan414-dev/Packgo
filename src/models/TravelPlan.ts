import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITravelPlan extends Document {
  title: string;
  slug: string;
  destination: string;
  country: string;
  region: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  duration: {
    days: number;
    nights: number;
  };
  maxGroupSize: number;
  departureFrom: string;
  coverImage: string;
  images: string[];
  shortDescription: string;
  description: string;
  category: 'adventure' | 'beach' | 'cultural' | 'honeymoon' | 'family' | 'wildlife' | 'pilgrimage' | 'cruise';
  difficulty: 'easy' | 'moderate' | 'challenging';
  tags: string[];
  isTrending: boolean;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  reviews: {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TravelPlanSchema = new Schema<ITravelPlan>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    destination: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    duration: {
      days: { type: Number, required: true, min: 1 },
      nights: { type: Number, required: true, min: 0 },
    },
    maxGroupSize: { type: Number, default: 20 },
    departureFrom: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    shortDescription: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['adventure', 'beach', 'cultural', 'honeymoon', 'family', 'wildlife', 'pilgrimage', 'cruise'],
      required: true,
    },
    difficulty: { type: String, enum: ['easy', 'moderate', 'challenging'], default: 'easy' },
    tags: [{ type: String }],
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    
    // ✅ FIXED: Embedded the sub-document tracking definitions explicitly so it commits successfully to MongoDB 
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

TravelPlanSchema.index({ category: 1, isActive: 1 });
TravelPlanSchema.index({ isTrending: 1, isActive: 1 });
TravelPlanSchema.index({ isFeatured: 1, isActive: 1 });
TravelPlanSchema.index({ price: 1 });
TravelPlanSchema.index({ destination: 'text', title: 'text', tags: 'text' });

const TravelPlan: Model<ITravelPlan> =
  mongoose.models.TravelPlan ?? mongoose.model<ITravelPlan>('TravelPlan', TravelPlanSchema);

export default TravelPlan;