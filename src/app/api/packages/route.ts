import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch all active packages with their metrics safely mapping to valid arrays
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const packages = await TravelPlan.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ packages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST: Handles Admin Package Addition OR Embedded Review Submission
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // ACTION CONDITION 1: Appending a Review directly to sub-document tracking arrays
    if (body.action === 'addReview') {
      const { packageId, rating, comment } = body;
      const targetPackage = await TravelPlan.findById(packageId);
      if (!targetPackage) {
        return NextResponse.json({ error: 'Package document not found' }, { status: 404 });
      }

      if (!targetPackage.reviews) {
        targetPackage.reviews = [];
      }

      targetPackage.reviews.push({
        userId: (session.user as any).id,
        userName: session.user?.name || 'Explorer Guest',
        rating: Number(rating),
        comment: comment || '',
        createdAt: new Date()
      });

      // Update calculations
      targetPackage.reviewCount = targetPackage.reviews.length;
      targetPackage.rating = Number((targetPackage.reviews.reduce((acc, curr) => acc + curr.rating, 0) / targetPackage.reviews.length).toFixed(1));
      
      targetPackage.markModified('reviews');
      await targetPackage.save();
      return NextResponse.json(targetPackage, { status: 201 });
    }

    // ACTION CONDITION 2: Admin creating a whole new package
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized administrative clearance' }, { status: 403 });
    }

    // Automatically assign lowercase character URL strings if not supplied
    const computedSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-');

    const newPackage = await TravelPlan.create({
      title: body.title,
      slug: body.slug || computedSlug,
      destination: body.destination,
      country: body.country || 'India',
      region: body.region || 'South India',
      description: body.description,
      shortDescription: body.shortDescription || (body.description ? body.description.substring(0, 150) : ''),
      price: Number(body.price || body.budget || 0),
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      category: body.category || 'beach',
      departureFrom: body.departureFrom || 'Kerala',
      isActive: true
    });

    return NextResponse.json(newPackage, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Pipeline process violation' }, { status: 400 });
  }
}