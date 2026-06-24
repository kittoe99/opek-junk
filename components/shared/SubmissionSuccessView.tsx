import React from 'react';
import { Check } from 'lucide-react';

export interface SummaryRow {
  label: string;
  value: string;
}

interface SubmissionSuccessViewProps {
  title?: string;
  description?: string;
  orderNumber?: string | null;
  summary?: SummaryRow[];
  fullScreen?: boolean;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  title = 'Submitted',
  description = 'Your information has been received.',
  orderNumber,
  summary = [],
  fullScreen = true,
}) => {
  const content = (
    <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-lg p-6 md:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
          <Check size={20} className="text-neutral-600" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
      </div>

      {orderNumber && (
        <div className="mb-5 pb-5 border-b border-neutral-100">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">Order number</p>
          <p className="text-base font-mono font-medium text-neutral-900">{orderNumber}</p>
        </div>
      )}

      {summary.length > 0 && (
        <dl className="space-y-3">
          {summary.map(({ label, value }) => (
            value ? (
              <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide sm:w-32 shrink-0">{label}</dt>
                <dd className="text-sm text-neutral-800 break-words">{value}</dd>
              </div>
            ) : null
          ))}
        </dl>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-start justify-center px-4 py-16 md:py-24">
        {content}
      </div>
    );
  }

  return content;
};
