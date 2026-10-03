import Navbar from '@/components/pages/layouts/Navbar';
import Hero from '@/components/pages/Hero';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-full min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
}
