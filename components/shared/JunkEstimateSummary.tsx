import React from 'react';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import type { DetectedItem, PriceEstimate } from '../../types';
import { JUNK_ONLINE_BOOKING_DISCOUNT_LABEL } from '../../lib/junkRemovalPricing';
import { ItemIconRenderer } from '../icons/JunkItemIcons';
import { getCatalogItemImage } from './JunkItemCatalogSelector';

interface JunkEstimateSummaryProps {
  price: PriceEstimate;
  items: DetectedItem[];
  /** Opens the Safe Protect details; the link is hidden when omitted. */
  onLearnMoreProtection?: () => void;
}

/** Junk removal estimate: price banner, itemized list with line totals, then fees and total. */
export const JunkEstimateSummary: React.FC<JunkEstimateSummaryProps> = ({ price, items, onLearnMoreProtection }) => {
  const lines = price.lines?.length
    ? price.lines
    : items.map((item) => ({ name: item.name, quantity: item.quantity, unitPrice: 0, lineTotal: 0 }));
  const priced = Boolean(price.lines?.length);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  const itemSubtotal = price.itemSubtotal ?? price.subtotal ?? price.price;
  const subtotal = price.subtotal ?? price.price;
  const discount = price.onlineBookingDiscount ?? 0;
  const minimumApplied =
    price.orderMinimum != null && subtotal > itemSubtotal && subtotal === price.orderMinimum;

  return (
    <div className="space-y-4">
      <div className="qsum-price">
        <div>
          <p className="qsum-price-label">Your estimate</p>
          <p className="qsum-price-service">Junk Removal</p>
          {price.estimatedVolume && <p className="qest-volume">{price.estimatedVolume}</p>}
        </div>
        <p className="qsum-price-value">${price.price}</p>
      </div>

      <p className="qest-guarantee">
        <BadgeCheck size={18} aria-hidden />
        <span><strong>Based on the items below.</strong> Your provider confirms the final price on-site before any work starts.</span>
      </p>

      <section className="qsum" aria-labelledby="qest-items-title">
        <header className="qest-head">
          <h2 id="qest-items-title">Your items</h2>
          <span>{count} item{count === 1 ? '' : 's'}</span>
        </header>
        <ul>
          {lines.map((line) => (
            <li key={`${line.name}-${line.quantity}`} className="qest-line">
              <span className="qest-line-icon" aria-hidden>
                <ItemIconRenderer imagePath={getCatalogItemImage(line.name)} className="w-7 h-7" />
              </span>
              <span className="qest-line-text">
                <span className="qest-line-name">{line.name}</span>
                <span className="qest-line-qty">
                  Qty {line.quantity}{priced && line.quantity > 1 ? ` · $${line.unitPrice} each` : ''}
                </span>
              </span>
              {priced && <span className="qest-line-total">${line.lineTotal}</span>}
            </li>
          ))}
        </ul>

        <dl className="qest-totals">
          {minimumApplied && (
            <>
              <div><dt>Item subtotal</dt><dd>${itemSubtotal}</dd></div>
              <div><dt>Order minimum</dt><dd>${price.orderMinimum}</dd></div>
            </>
          )}
          <div>
            <dt>Pick up &amp; admin fee</dt>
            <dd>{discount > 0 ? <s>${subtotal}</s> : `$${subtotal}`}</dd>
          </div>
          {discount > 0 && (
            <div className="is-discount">
              <dt>{JUNK_ONLINE_BOOKING_DISCOUNT_LABEL}</dt>
              <dd>-${discount}</dd>
            </div>
          )}
          <div className="qest-total">
            <dt>Estimated total</dt>
            <dd>${price.price}</dd>
          </div>
        </dl>
      </section>

      <div className="soft-callout">
        <ShieldCheck size={16} aria-hidden />
        <p>
          <strong>Safe Protect™ included.</strong> Every booking is covered by platform damage protection.
          {onLearnMoreProtection && (
            <>{' '}<button type="button" onClick={onLearnMoreProtection}>Learn more</button></>
          )}
        </p>
      </div>
    </div>
  );
};
