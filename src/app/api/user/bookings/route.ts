import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET: Fetch the logged-in traveler's entire booking pipeline history logs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    await connectDB();

    const userProfile = await User.findById((session.user as any).id)
      .select('bookingHistory')
      .lean();

    if (!userProfile) {
      return NextResponse.json({ error: 'Traveler profile instance not found' }, { status: 404 });
    }

    // Return the array or an empty array fallback if they haven't made bookings yet
    return NextResponse.json(userProfile.bookingHistory || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve booking records' }, { status: 400 });
  }
}