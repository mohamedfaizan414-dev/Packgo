import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

// ✅ Define options locally or import them from a separate clean configuration wrapper if preferred
import { authOptions } from '../../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // 1. Authenticate user context via session token
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'You must be logged in to leave a review' }, { status: 401 });
    }

    // 2. Extract and validate form data body
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Please submit a valid star rating between 1 and 5' }, { status: 400 });
    }

    // 3. Establish active collection database connection
    await connectDB();

    // Query flexibly by ID or text string slug depending on context format
    const isObjectId = mongoose.Types.ObjectId.isValid(params.slug);
    const queryCondition = isObjectId ? { _id: params.slug } : { slug: params.slug };

    const plan = await TravelPlan.findOne(queryCondition);
    if (!plan) {
      return NextResponse.json({ error: 'Travel package document not found' }, { status: 404 });
    }

    // Initialize fallback array if older entries lack it
    if (!plan.reviews) {
      plan.reviews = [];
    }

    // 4. Safely check for valid user id types to prevent unhandled 500 casting exceptions
    const rawUserId = (session.user as any).id || (session.user as any)._id;
    const finalUserId = mongoose.Types.ObjectId.isValid(rawUserId)
      ? new mongoose.Types.ObjectId(rawUserId)
      : new mongoose.Types.ObjectId();

    // 5. Build clean, schema-compliant object
    const newReview = {
      userId: finalUserId,
      userName: session.user.name || 'Anonymous Traveler',
      rating: Number(rating),
      comment: comment || '', 
      createdAt: new Date(),
    };

    // 6. Append data directly to the embedded document array
    plan.reviews.push(newReview);

    // 7. Update analytical numbers accurately across discovery layouts
    const totalReviewsCount = plan.reviews.length;
    const aggregateStarsSum = plan.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    
    plan.reviewCount = totalReviewsCount;
    plan.rating = Number((aggregateStarsSum / totalReviewsCount).toFixed(1));

    // 8. Inform Mongoose tracking engines regarding sub-document array modifications
    plan.markModified('reviews');

    // 9. Save and commit cleanly to remote document instances
    await plan.save();

    // On-demand evict Next.js cache structures to keep counts completely synchronous across views
    revalidatePath(`/plan/${params.slug}`);
    revalidatePath('/');

    return NextResponse.json({ 
      success: true,
      message: 'Review saved successfully!', 
      rating: plan.rating, 
      reviewCount: plan.reviewCount 
    }, { status: 201 });

  } catch (error: any) {
    console.error('CRITICAL ERROR - Review Route Crash:', error);
    return NextResponse.json({ 
      error: 'Failed to process feedback score', 
      details: error?.message || 'Unknown database pipeline rejection' 
    }, { status: 500 });
  }
}