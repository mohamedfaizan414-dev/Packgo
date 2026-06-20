import { NextRequest, NextResponse } from 'next/server';
import { InteractionService } from '@/core/services/InteractionService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const interactionService = new InteractionService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const reviews = await interactionService.getPlanReviews(resolvedParams.id);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: 'Authentication Token Missing' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { rating, comment } = await request.json();
    const review = await interactionService.addReview((session.user as any).id, resolvedParams.id, rating, comment);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}