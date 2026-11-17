import { BookingSteps } from '@/components/home/BookingSteps';
import { CateringPreview } from '@/components/home/CateringPreview';
import { Entertainment } from '@/components/home/Entertainment';
import { EveningTour } from '@/components/home/EveningTour';
import { FinalCta } from '@/components/home/FinalCta';
import { Hero } from '@/components/home/Hero';
import { Occasions } from '@/components/home/Occasions';
import { PricingPreview } from '@/components/home/PricingPreview';
import { Welcome } from '@/components/home/Welcome';

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <EveningTour />
      <Occasions />
      <PricingPreview />
      <CateringPreview />
      <Entertainment />
      <BookingSteps />
      <FinalCta />
    </>
  );
}
