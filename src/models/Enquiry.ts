import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  planId: mongoose.Types.ObjectId;
  planTitle: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  travelDate?: Date;
  groupSize: number;
  specialRequests?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  source: 'whatsapp' | 'form';
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    planId: { type: Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
    planTitle: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    travelDate: Date,
    groupSize: { type: Number, default: 1 },
    specialRequests: String,
    status: { type: String, enum: ['new', 'contacted', 'confirmed', 'cancelled'], default: 'new' },
    source: { type: String, enum: ['whatsapp', 'form'], default: 'whatsapp' },
  },
  { timestamps: true }
);

EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ planId: 1 });

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry ?? mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
export default Enquiry;
