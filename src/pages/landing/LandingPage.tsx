import React from 'react';
import {
  TopNav,
  HeroSection,
  PainPoints,
  CoreFeatures,
  DashboardPreview,
  CTASection,
  Footer,
} from '@/features/landing/components';

export const LandingPage = () => {
  return (
    <div className="bg-surface text-on-surface font-body-lg antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-grow pt-32">
        <HeroSection />
        <PainPoints />
        <CoreFeatures />
        <DashboardPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
