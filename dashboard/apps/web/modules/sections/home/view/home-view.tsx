'use client';

import { useScroll } from 'framer-motion';
import ScrollProgress from 'modules/components/scroll-progress';
import MainLayout from 'modules/layouts/main';

import HomeHero from '../home-hero';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />
    </MainLayout>
  );
}
