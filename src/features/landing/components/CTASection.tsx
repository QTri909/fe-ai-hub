import React from 'react';

export const CTASection = () => {
  return (
    <section className="py-16 relative overflow-hidden bg-surface-container-high border-y border-surface-variant">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-secondary-container/10 pointer-events-none"></div>
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-4">Ready to accelerate your QA workflow?</h2>
        <p className="text-body-lg text-on-surface-variant mb-8">Join thousands of engineering teams deploying with confidence.</p>
        <button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-title-lg hover:shadow-[0_0_20px_rgba(208,188,255,0.4)] transition-all active:scale-95">
          Start Free Trial
        </button>
      </div>
    </section>
  );
};
