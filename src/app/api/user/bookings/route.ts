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

    const bookings = await interactionService.getUserBookings((session.user as any).id);
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}