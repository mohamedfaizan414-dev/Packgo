import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET: Fetch the logged-in user's full wishlisted packages array
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    await connectDB();

    const userWithWishlist = await User.findById((session.user as any).id)
      .select('wishlist')
      .populate('wishlist')
      .lean();

    if (!userWithWishlist) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    return NextResponse.json(userWithWishlist.wishlist || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch wishlist items' }, { status: 400 });
  }
}

// POST: Handles adding or removing a tour package from the user's wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as any).id;
    const { travelPlanId, action } = await request.json();

    if (!travelPlanId) {
      return NextResponse.json({ error: 'Missing travelPlanId' }, { status: 400 });
    }

    let updatedUser;

    if (action === 'remove') {
      // Pull/Remove the package ID from the wishlist array cleanly
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: travelPlanId } },
        { new: true }
      ).select('wishlist').populate('wishlist').lean();
    } else {
      // Default Action: Add the package ID (using $addToSet ensures duplicates aren't created)
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: travelPlanId } },
        { new: true }
      ).select('wishlist').populate('wishlist').lean();
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser.wishlist || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update wishlist state' }, { status: 400 });
  }
}