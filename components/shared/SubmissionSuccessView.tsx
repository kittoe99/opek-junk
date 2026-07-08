import React from 'react';
import { Check } from 'lucide-react';
import { UTILITY_FORM_CARD, UTILITY_PAGE_CONTENT, UTILITY_PAGE_SHELL } from '../../lib/flowPageLayout';

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
    <div className={`${UTILITY_FORM_CARD} max-w-lg w-full`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 bg-secondary text-white rounded-2xl flex items-center justify-center shrink-0">
          <Check size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-secondary">{title}</h2>
          <p className="text-sm text-secondary-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {orderNumber && (
        <div className="mb-5 pb-5 border-b border-secondary-100/80">
          <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-1">Order number</p>
          <p className="text-base font-mono font-semibold text-secondary">{orderNumber}</p>
        </div>
      )}

      {summary.length > 0 && (
        <dl className="space-y-3">
          {summary.map(({ label, value }) =>
            value ? (
              <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-xs font-semibold text-secondary-400 uppercase tracking-wider sm:w-32 shrink-0">
                  {label}
                </dt>
                <dd className="text-sm text-secondary break-words">{value}</dd>
              </div>
            ) : null,
          )}
        </dl>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`${UTILITY_PAGE_SHELL} flex items-start justify-center`}>
        <div className={UTILITY_PAGE_CONTENT}>{content}</div>
      </div>
    );
  }

  return content;
};
