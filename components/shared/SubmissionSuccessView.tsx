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
  referenceLabel?: string;
}

/** Confirmation screen in the soft-card style shared with Track Order. */
export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  title = 'Submitted',
  description = 'Your information has been received.',
  orderNumber,
  summary = [],
  fullScreen = true,
  referenceLabel = 'Order number',
}) => {
  const rows = summary.filter((row) => row.value);

  const content = (
    <div className="soft-wrap">
      <span className="soft-success-icon" aria-hidden>
        <Check size={26} strokeWidth={3} />
      </span>
      <h1 className="home-display soft-title">{title}</h1>
      <p className="soft-sub">{description}</p>

      {(orderNumber || rows.length > 0) && (
        <div className="soft-card">
          {orderNumber && (
            <div className="soft-head">
              <div>
                <p className="soft-label">{referenceLabel}</p>
                <p className="soft-order-number">{orderNumber}</p>
              </div>
            </div>
          )}
          {rows.length > 0 && (
            <dl className="soft-details">
              {rows.map(({ label, value }, i) => (
                <div key={`${label}-${i}`}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      <p className="soft-help">
        Questions? Call or text <a href="tel:+18777574365">(877) 757-4365</a>
      </p>
    </div>
  );

  if (fullScreen) {
    return <div className="site-page home-light interior-home soft-page">{content}</div>;
  }

  return content;
};
