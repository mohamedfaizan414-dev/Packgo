import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import Itinerary from '@/models/Itinerary';
import MainLayout from '@/components/layout/MainLayout';
import BookNowButton from '@/components/ui/BookNowButton';
import ReviewForm from '@/components/ui/ReviewForm';
import { formatPrice, getDurationLabel, getDiscountPercent, WHATSAPP_NUMBER } from '@/lib/utils';
import { Star, Clock, Users, MapPin, Check, ChevronRight, TrendingUp, Shield } from 'lucide-react';

async function getPlan(slug: string) {
  await connectDB();
  const plan = await TravelPlan.findOne({ slug, isActive: true }).lean();
  if (!plan) return null;
  const itinerary = await Itinerary.find({ planId: (plan as { _id: unknown })._id }).sort({ dayNumber: 1 }).lean();
  return { plan: JSON.parse(JSON.stringify(plan)), itinerary: JSON.parse(JSON.stringify(itinerary)) };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getPlan(params.slug);
  if (!data) return { title: 'Package Not Found' };
  return { title: `${data.plan.title} | PackGo`, description: data.plan.shortDescription };
}

export default async function PlanDetailPage({ params }: { params: { slug: string } }) {
  const data = await getPlan(params.slug);
  if (!data) notFound();
  
  const { plan, itinerary } = data;
  const discount = plan.discountedPrice ? getDiscountPercent(plan.price, plan.discountedPrice) : 0;

  return (
    <MainLayout>
      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Hero Banner Banner Frame */}
        <div className="relative h-72 md:h-96 lg:h-[480px] overflow-hidden">
          <Image src={plan.coverImage} alt={plan.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
          {plan.isTrending && (
            <div className="absolute top-6 left-6">
              <span className="badge bg-orange-500 text-white text-sm px-4 py-1.5"><TrendingUp className="w-4 h-4" /> Trending</span>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-6 right-6">
              <span className="badge bg-green-500 text-white text-sm px-4 py-1.5">{discount}% OFF</span>
            </div>
          )}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-semibold">{Number(plan.rating || 0).toFixed(1)}</span>
              {/* ✅ FIXED: Dynamic runtime count logic fallback ensures numbers align correctly on layout mount templates */}
              <span className="text-white/70 text-sm">({plan.reviews?.length ?? plan.reviewCount ?? 0} reviews)</span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-white">{plan.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
            
            {/* ── SECTION 1: CORE TRAVEL DETAILS & ITINERARY ── */}
            <div className="order-1 lg:col-span-2 space-y-8">
              {/* Quick Info Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-card flex flex-wrap gap-6">
                {[
                  { icon: MapPin, label: 'Destination', value: plan.destination },
                  { icon: Clock, label: 'Duration', value: getDurationLabel(plan.duration.days, plan.duration.nights) },
                  { icon: Users, label: 'Group Size', value: `Max ${plan.maxGroupSize}` },
                  { icon: Shield, label: 'Difficulty', value: plan.difficulty },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="font-semibold text-slate-800 text-sm capitalize">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3">About This Trip</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{plan.description}</p>
              </div>

              {/* Trip Highlights */}
              {plan.highlights?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h2 className="font-display font-bold text-xl text-slate-900 mb-4">Trip Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-gray-700 text-sm">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Itinerary Dropdowns */}
              {itinerary.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-card">
                  <h2 className="font-display font-bold text-xl text-slate-900 mb-6">Day-by-Day Itinerary</h2>
                  <div className="space-y-4">
                    {itinerary.map((day: any, idx: number) => (
                      <details key={idx} className="group border border-gray-100 rounded-xl overflow-hidden">
                        <summary className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 select-none list-none">
                          <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {day.dayNumber}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Day {day.dayNumber}</p>
                            <p className="font-semibold text-slate-800">{day.title}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white">
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{day.description}</p>
                          {day.activities?.map((act: any, j: number) => (
                            <div key={j} className="flex gap-3 mb-3 last:mb-0">
                              <div className="text-xs text-slate-400 w-16 shrink-0 pt-0.5 font-semibold">{act.time}</div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{act.title}</p>
                                {act.description && <p className="text-gray-500 text-xs mt-0.5">{act.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 2: STICKY SIDEBAR BOOKING CARD ── */}
            <div className="order-2 lg:order-none lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <div className="mb-4">
                  {plan.discountedPrice ? (
                    <>
                      <p className="text-gray-400 text-sm line-through">{formatPrice(plan.price)}</p>
                      <p className="font-display font-bold text-3xl text-sky-600">{formatPrice(plan.discountedPrice)}</p>
                      <p className="text-green-600 text-xs font-semibold mt-0.5">You save {formatPrice(plan.price - plan.discountedPrice)}!</p>
                    </>
                  ) : (
                    <p className="font-display font-bold text-3xl text-sky-600">{formatPrice(plan.price)}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">per person · {getDurationLabel(plan.duration.days, plan.duration.nights)}</p>
                </div>

                <BookNowButton plan={{ title: plan.title, destination: plan.destination, duration: plan.duration, price: plan.price, discountedPrice: plan.discountedPrice }} whatsappNumber={WHATSAPP_NUMBER} />

                <div className="mt-5 space-y-2.5 text-xs text-gray-500 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Secure tour reservation verified</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Flexible cancellations allowed</div>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: REVIEWS CONSOLE ── */}
            <div className="order-3 lg:col-span-2 space-y-6">
              <ReviewForm slug={params.slug} />

              {/* Dynamic Historic Reviews Feed List */}
              {plan.reviews?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-4">
                  {/* ✅ FIXED: Ensures this sub-header count accurately tracks the array layer boundaries */}
                  <h3 className="font-display font-bold text-lg text-slate-900">User Reviews ({plan.reviews.length})</h3>
                  <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-1 space-y-4">
                    {plan.reviews.map((rev: any, index: number) => (
                      <div key={index} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-800">{rev.userName}</p>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, sIdx) => (
                              <Star key={sIdx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100/60 inline-block w-full mt-1">
                          {rev.comment || "Rated without adding written feedback."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}