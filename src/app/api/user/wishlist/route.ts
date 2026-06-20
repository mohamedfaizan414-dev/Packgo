import { NextRequest, NextResponse } from 'next/server';
import { InteractionService } from '@/core/services/InteractionService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const interactionService = new InteractionService();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const wishlist = await interactionService.getUserWishlist((session.user as any).id);
    return NextResponse.json(wishlist, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Required' }, { status: 401 });
    }

    const { travelPlanId, action } = await request.json();
    const item = await interactionService.toggleWishlist((session.user as any).id, travelPlanId, action);
    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}