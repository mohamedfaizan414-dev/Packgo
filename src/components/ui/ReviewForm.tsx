'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ReviewForm({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!session) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-card">
        <p className="text-gray-500 text-sm mb-3">Enjoyed this tour package?</p>
        <Link 
          href="/auth/login" 
          className="inline-block text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
        >
          Log in to leave a verified review →
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug) {
      toast.error('Missing package identifying parameters.');
      return;
    }

    if (rating === 0) {
      toast.error('Please tap a star number selection before posting.');
      return;
    }

    try {
      setSubmitting(true);
      
      // ✅ CHANGED: Shifted endpoint integration completely back to the text slug parameter template string
      const res = await fetch(`/api/plans/${slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Thank you! Your feedback has been posted.');
        setRating(0);
        setComment('');
        router.refresh(); 
      } else {
        toast.error(data.error || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Submission transactional fault:', error);
      toast.error('Connection timed out. Please review local port availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
      <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Share Your Experience</h3>
      <p className="text-xs text-gray-400 mb-4">Your rating updates the overall score card across the discovery feeds.</p>

      <form onSubmit={handleReviewSubmit} className="space-y-4">
        {/* Star Rating Layout Block */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform active:scale-90"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Opinion Comment Box */}
        <div>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write details regarding guides, hotels, or scenery milestones..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 placeholder-gray-400 bg-white text-slate-800"
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-sky-600/10"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving Feedback...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}