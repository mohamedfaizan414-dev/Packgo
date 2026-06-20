import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function buildWhatsAppURL(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildWhatsAppBookingMessage(plan: {
  title: string;
  destination: string;
  duration: { days: number; nights: number };
  price: number;
  discountedPrice?: number;
}): string {
  const price = plan.discountedPrice ?? plan.price;
  return `Hi PackGo! 🌍 I'm interested in booking the following package:

*Package:* ${plan.title}
*Destination:* ${plan.destination}
*Duration:* ${plan.duration.days} Days / ${plan.duration.nights} Nights
*Price:* ₹${price.toLocaleString('en-IN')} per person

Please share more details and availability. Thank you!`;
}

export function getDiscountPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}

export function getDurationLabel(days: number, nights: number): string {
  return `${days}D / ${nights}N`;
}

export const CATEGORIES = [
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { value: 'honeymoon', label: 'Honeymoon', emoji: '💑' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'wildlife', label: 'Wildlife', emoji: '🦁' },
  { value: 'pilgrimage', label: 'Pilgrimage', emoji: '🙏' },
  { value: 'cruise', label: 'Cruise', emoji: '🚢' },
] as const;

export const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER ?? '9544661551';
