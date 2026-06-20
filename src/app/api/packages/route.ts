import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/infrastructure/db/mongodb';
import { TravelPlan } from '@/infrastructure/models/TravelPlan';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Fetch all packages with their pre-calculated rating metrics
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const packages = await TravelPlan.find({ isPublic: true }).sort({ createdAt: -1 });
    return NextResponse.json({ packages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Handles Admin Package Addition OR User Review Submission
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // ACTION CONDITION 1: Adding a Review
    if (body.action === 'addReview') {
      const { packageId, rating, comment } = body;
      const targetPackage = await TravelPlan.findById(packageId);
      if (!targetPackage) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }

      targetPackage.reviews.push({
        userId: (session.user as any).id,
        userName: session.user?.name || 'Explorer Guest',
        rating: Number(rating),
        comment,
        createdAt: new Date()
      });

      await targetPackage.save();
      return NextResponse.json(targetPackage, { status: 201 });
    }

    // ACTION CONDITION 2: Admin creating a whole new package
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized administrative clearance' }, { status: 403 });
    }

    const newPackage = new TravelPlan({
      title: body.title,
      destination: body.destination,
      description: body.description,
      budget: Number(body.budget),
      coverImage: body.coverImage,
      status: body.status || 'upcoming',
      itinerary: body.itinerary || [] // Directly binds the admin-defined itinerary array here!
    });

    await newPackage.save();
    return NextResponse.json(newPackage, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}