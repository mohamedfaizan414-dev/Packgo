import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItinerary extends Document {
  planId: mongoose.Types.ObjectId;
  dayNumber: number;
  title: string;
  description: string;
  activities: {
    time: string;
    title: string;
    description: string;
    duration: string;
    type: 'sightseeing' | 'meal' | 'transport' | 'accommodation' | 'activity' | 'free';
    icon?: string;
  }[];
  accommodation?: {
    name: string;
    type: string;
    location: string;
  };
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  transport?: string;
  highlights: string[];
  tips: string[];
  image?: string;
}

const ItinerarySchema = new Schema<IItinerary>(
  {
    planId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [
      {
        time: String,
        title: { type: String, required: true },
        description: String,
        duration: String,
        type: {
          type: String,
          enum: ['sightseeing', 'meal', 'transport', 'accommodation', 'activity', 'free'],
          default: 'activity',
        },
        icon: String,
      },
    ],
    accommodation: {
      name: String,
      type: String,
      location: String,
    },
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },
    transport: String,
    highlights: [String],
    tips: [String],
    image: String,
  },
  { timestamps: true }
);

ItinerarySchema.index({ planId: 1, dayNumber: 1 });

const Itinerary: Model<IItinerary> =
  mongoose.models.Itinerary ?? mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export default Itinerary;
