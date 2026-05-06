import React from 'react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      title: 'Snap a photo',
      desc: 'Send a picture of your junk and get instant volume analysis and a price.',
    },
    {
      title: 'Lock the price',
      desc: 'On-site confirmation with a fixed quote. No surcharges or hidden fees.',
    },
    {
      title: 'We haul it',
      desc: 'Professional pickup, sorting, and cleanup. You point—we do the rest.',
    },
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              <span className="inline-block h-px w-8 bg-gray-300" />
              <span>How it works</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight">
              Point. Price. <span className="text-gray-400">Gone.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {steps.map((step, i) => (
            <div key={i} className="bg-gray-50 p-8 md:p-10">
              <div className="text-xs text-gray-400 tabular-nums mb-6">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-2xl font-light text-gray-900 tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {onGetQuote && (
          <div className="mt-12 flex justify-center md:justify-start">
            <button
              onClick={onGetQuote}
              className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              Start your quote &rarr;
            </button>
          </div>
        )}

      </div>
    </section>
  );
};