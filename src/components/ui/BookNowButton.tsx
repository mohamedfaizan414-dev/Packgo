'use client';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppURL, buildWhatsAppBookingMessage } from '@/lib/utils';

interface Props {
  plan: { title: string; destination: string; duration: { days: number; nights: number }; price: number; discountedPrice?: number };
  whatsappNumber: string;
}

export default function BookNowButton({ plan, whatsappNumber }: Props) {
  const handleBook = () => {
    const message = buildWhatsAppBookingMessage(plan);
    const url = buildWhatsAppURL(whatsappNumber, message);
    window.open(url, '_blank');
  };

  return (
    <button onClick={handleBook}
      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3.5 rounded-xl transition-all text-base">
      <MessageCircle className="w-5 h-5" />
      Book via WhatsApp
    </button>
  );
}
