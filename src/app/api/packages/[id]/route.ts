import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const plan = await TravelPlan.findById(params.id).lean();
    if (!plan) return NextResponse.json({ error: 'Package data not found' }, { status: 404 });

    const itinerary = await Itinerary.find({ planId: plan._id }).sort({ dayNumber: 1 }).lean();
    return NextResponse.json({ plan, itinerary }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resolve document' }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    
    const updated = await TravelPlan.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Target update instance missing' }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Data mutations rejection error' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    await connectDB();
    const deletedPlan = await TravelPlan.findByIdAndDelete(params.id);
    if (!deletedPlan) return NextResponse.json({ error: 'Package target already cleared' }, { status: 404 });

    // Safely remove structural days tied to the parent plan
    await Itinerary.deleteMany({ planId: params.id });

    return NextResponse.json({ message: 'Package cleared successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Deletion operation failure' }, { status: 400 });
  }
}