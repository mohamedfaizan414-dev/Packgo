import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const plan = await TravelPlan.findById(params.id).select('reviews').lean();
    if (!plan) return NextResponse.json({ error: 'Parent travel document context missing' }, { status: 404 });
    
    return NextResponse.json(plan.reviews || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Review processing exception fault' }, { status: 400 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Token Missing' }, { status: 401 });
    }

    await connectDB();
    const { rating, comment } = await request.json();
    
    const targetPlan = await TravelPlan.findById(params.id);
    if (!targetPlan) return NextResponse.json({ error: 'Target document context missing' }, { status: 404 });

    if (!targetPlan.reviews) targetPlan.reviews = [];

 const newReviewItem = {
  userId: (session.user as any).id,
  userName: (session.user as any)?.name || 'Anonymous Traveler',
  rating: Number(rating || 5),
  comment: comment || '',
  createdAt: new Date()
};

    targetPlan.reviews.push(newReviewItem);
    
    // Reset collection analytical trackers
    targetPlan.reviewCount = targetPlan.reviews.length;
    targetPlan.rating = Number((targetPlan.reviews.reduce((acc, curr) => acc + curr.rating, 0) / targetPlan.reviews.length).toFixed(1));

    targetPlan.markModified('reviews');
    await targetPlan.save();

    return NextResponse.json(newReviewItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Processing fault transaction aborted' }, { status: 400 });
  }
}