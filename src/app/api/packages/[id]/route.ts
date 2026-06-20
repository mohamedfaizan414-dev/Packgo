import { NextRequest, NextResponse } from 'next/server';
import { TravelPlanService } from '@/core/services/TravelPlanService';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const planService = new TravelPlanService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const plan = await planService.getPackageDetails(resolvedParams.id);
    return NextResponse.json(plan, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const updated = await planService.updatePackage(resolvedParams.id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
    }

    const resolvedParams = await params;
    await planService.deletePackage(resolvedParams.id);
    return NextResponse.json({ message: 'Package cleared successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}