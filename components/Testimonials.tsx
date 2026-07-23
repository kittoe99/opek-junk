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

interface TestimonialsProps {
  theme?: 'light' | 'dark';
}

export const Testimonials: React.FC<TestimonialsProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <section
      id="testimonials"
      className={`py-16 md:py-24 overflow-hidden border-b ${
        isDark
          ? 'bg-[var(--bg-alt)] border-[var(--border)]'
          : 'bg-white border-secondary-100/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2
            className={`font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-3 ${
              isDark ? 'text-[var(--text)]' : 'text-secondary'
            }`}
          >
            Join thousands of happy customers
          </h2>
          <p
            className={`text-sm md:text-base max-w-lg mx-auto ${
              isDark ? 'text-[var(--text-muted)]' : 'text-secondary-400'
            }`}
          >
            Real reviews from homeowners and businesses who trusted us with the heavy lifting.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:snap-none">
          {testimonials.map((item) => (
            <figure
              key={item.author}
              className={`snap-center shrink-0 w-[85%] sm:w-auto rounded-2xl p-6 transition-shadow duration-300 ${
                isDark
                  ? 'bg-[var(--surface)] border border-[var(--border)] shadow-[0_10px_40px_rgba(0,0,0,0.28)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]'
                  : 'bg-white border border-secondary-100/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-brand fill-brand" />
                ))}
              </div>
              <blockquote
                className={`text-sm leading-relaxed mb-4 ${
                  isDark ? 'text-[var(--text)]' : 'text-secondary'
                }`}
              >
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption
                className={`text-xs font-semibold ${
                  isDark ? 'text-[var(--text-muted)]' : 'text-secondary-400'
                }`}
              >
                — {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
