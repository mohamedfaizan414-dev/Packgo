import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Itinerary from '@/models/Itinerary';
import TravelPlan from '@/models/TravelPlan';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId');
    if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 });

    const itinerary = await Itinerary.find({ planId }).sort({ dayNumber: 1 }).lean();
    return NextResponse.json({ itinerary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const day = await Itinerary.create(body);

    // Link itinerary day to plan
    await TravelPlan.findByIdAndUpdate(body.planId, {
      $addToSet: { itinerary: day._id },
    });

    return NextResponse.json({ day }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create itinerary day' }, { status: 500 });
  }
}
