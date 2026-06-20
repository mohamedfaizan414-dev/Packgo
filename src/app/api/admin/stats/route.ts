import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import User from '@/models/User';
import Enquiry from '@/models/Enquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalPlans, activePlans, totalUsers, totalEnquiries, newEnquiries, trendingPlans] =
      await Promise.all([
        TravelPlan.countDocuments(),
        TravelPlan.countDocuments({ isActive: true }),
        User.countDocuments({ role: 'user' }),
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ status: 'new' }),
        TravelPlan.find({ isTrending: true, isActive: true })
          .select('title bookingCount rating')
          .limit(5)
          .lean(),
      ]);

    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const categoryStats = await TravelPlan.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({
      stats: { totalPlans, activePlans, totalUsers, totalEnquiries, newEnquiries },
      trendingPlans,
      recentEnquiries,
      categoryStats,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
