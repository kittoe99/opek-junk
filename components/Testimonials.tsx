import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'Very professional and punctual. They took special care to ensure heavy furniture made it safely out of the house.',
    author: 'Carleton H.',
  },
  {
    quote: 'They made the cleanout so quick and easy. Very adaptable even when we found more items than expected.',
    author: 'Eddie C.',
  },
  {
    quote: 'Quick and efficient! Second time booking with Opek and always an easy experience.',
    author: 'Mackenzie N.',
  },
  {
    quote: 'The crew was strong, careful, and kind. Working with providers like them keeps me coming back.',
    author: 'Amy W.',
  },
  {
    quote: 'Prompt, excellent communication, friendly — furniture carefully handled and placed exactly where we wanted.',
    author: 'Susan J.',
  },
  {
    quote: 'Excellent and pleasant customer service, communication, and efficient removal. Highly recommend.',
    author: 'Teddy W.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary-50/40 border-b border-secondary-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-secondary tracking-tight mb-3">
            Join thousands of happy customers
          </h2>
          <p className="text-secondary-400 text-sm md:text-base max-w-lg mx-auto">
            Real reviews from homeowners and businesses who trusted us with the heavy lifting.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:snap-none">
          {testimonials.map((item) => (
            <figure
              key={item.author}
              className="snap-center shrink-0 w-[85%] sm:w-auto bg-white rounded-2xl border border-secondary-100/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#00B67A] fill-[#00B67A]" />
                ))}
              </div>
              <blockquote className="text-secondary text-sm leading-relaxed mb-4">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="text-secondary-400 text-xs font-semibold">
                — {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
