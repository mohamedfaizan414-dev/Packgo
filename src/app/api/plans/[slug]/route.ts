import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const plan = await TravelPlan.findOne({ slug: params.slug, isActive: true })
      .populate('itinerary')
      .lean();

    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // Fetch itinerary separately for reliability
    const itinerary = await Itinerary.find({ planId: (plan as { _id: unknown })._id }).sort({ dayNumber: 1 }).lean();

    return NextResponse.json({ plan, itinerary });
  } catch (error) {
    console.error('GET /api/plans/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const plan = await TravelPlan.findOneAndUpdate({ slug: params.slug }, body, { new: true });

    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('PUT /api/plans/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // ✅ CHANGED: Hard-deletes the plan from the collection using its slug identifier
    const plan = await TravelPlan.findOneAndDelete({ slug: params.slug });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Optional: Clean up associated itineraries automatically if they exist
    // await Itinerary.deleteMany({ planId: plan._id });

    return NextResponse.json({ message: 'Plan permanently deleted from database' });
  } catch (error) {
    console.error('DELETE /api/plans/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}