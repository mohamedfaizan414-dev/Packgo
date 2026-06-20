import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import FeaturedPlansSection from '@/components/home/FeaturedPlansSection';
import TrendingSection from '@/components/home/TrendingSection';
import CategorySection from '@/components/home/CategorySection';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
<FeaturedPlansSection />
<TrendingSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <NewsletterSection />
    </MainLayout>
  );
}
