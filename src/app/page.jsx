import Navbar from '@/components/layouts/Navbar';
import Hero from '@/components/pages/Hero';
import SpaFeatures from '@/components/pages/SpaFeatures';
import Service from '@/components/pages/Service';
import SpaPackages from '@/components/pages/SpaPackages';
import SpaSpecialists from '@/components/pages/SpaSpecialists';
import SpaTestimonials from '@/components/pages/SpaTestimonials';
import SpaCtaBanner from '@/components/pages/SpaCtaBanner';
import Footer from '@/components/layouts/Footer';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-full min-h-screen">
      <Navbar />
      <Hero />
      <SpaFeatures />
      <Service />
      <SpaPackages />
      <SpaSpecialists />
      <SpaTestimonials />
      <SpaCtaBanner />
      <Footer />
    </div>
  );
}
