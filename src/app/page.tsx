'use client';

import React from 'react';
import Nav from '@/components/nav';
import Hero from '@/components/hero';
import ModelSection from '@/components/model-section';
import VisWorkflowWheel from '@/components/vis-workflow-wheel';
import FeaturesGrid from '@/components/features-grid';

export default function HomePage() {
  return (
    <main className='selection-teal min-h-screen bg-white'>
      <Nav />
      <Hero />
      <ModelSection />
      <VisWorkflowWheel />
      <FeaturesGrid />
    </main>
  );
}
