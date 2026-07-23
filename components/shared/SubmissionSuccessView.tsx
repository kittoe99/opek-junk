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
        <div className="w-11 h-11 bg-brand text-white rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_24px_-6px_rgba(255,0,110,0.55)]">
          <Check size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-sans font-extrabold text-2xl text-[var(--text)] tracking-tight">{title}</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {orderNumber && (
        <div className="mb-5 pb-5 border-b border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Order number
          </p>
          <p className="text-base font-mono font-semibold text-[var(--text)]">{orderNumber}</p>
        </div>
      )}

      {summary.length > 0 && (
        <dl className="space-y-3">
          {summary.map(({ label, value }) =>
            value ? (
              <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sm:w-32 shrink-0">
                  {label}
                </dt>
                <dd className="text-sm text-[var(--text)] break-words">{value}</dd>
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
