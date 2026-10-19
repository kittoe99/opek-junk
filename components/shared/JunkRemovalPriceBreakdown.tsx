import React from 'react';
import type { PriceEstimate } from '../../types';
import { JUNK_ONLINE_BOOKING_DISCOUNT_LABEL } from '../../lib/junkRemovalPricing';

interface JunkRemovalPriceBreakdownProps {
  price: PriceEstimate;
  /** Render rows only, for use inside an existing soft card. */
  embedded?: boolean;
}

export const JunkRemovalPriceBreakdown: React.FC<JunkRemovalPriceBreakdownProps> = ({ price, embedded = false }) => {
  const lines = price.lines ?? [];
  const itemSubtotal = price.itemSubtotal ?? price.subtotal ?? price.price;
  const orderMinimum = price.orderMinimum;
  const subtotal = price.subtotal ?? price.price;
  const discount = price.onlineBookingDiscount ?? 0;
  const total = price.price;
  const minimumApplied =
    orderMinimum != null && subtotal > itemSubtotal && subtotal === orderMinimum;

  const rows = (
    <dl className="soft-details">
      {lines.map((line) => (
        <div key={`${line.name}-${line.quantity}`}>
          <dt>
            {line.name}
            {line.quantity > 1 ? ` ×${line.quantity}` : ''}
          </dt>
          <dd>${line.lineTotal}</dd>
        </div>
      ))}

      {minimumApplied && (
        <>
          <div>
            <dt>Item subtotal</dt>
            <dd>${itemSubtotal}</dd>
          </div>
          <div>
            <dt>Order minimum</dt>
            <dd>${orderMinimum}</dd>
          </div>
        </>
      )}

      <div>
        <dt>Pick up &amp; admin fee</dt>
        <dd>{discount > 0 ? <s>${subtotal}</s> : `$${subtotal}`}</dd>
      </div>
      {discount > 0 && (
        <div>
          <dt>{JUNK_ONLINE_BOOKING_DISCOUNT_LABEL}</dt>
          <dd className="is-discount">-${discount}</dd>
        </div>
      )}

      <div className="soft-total">
        <dt>Estimated total</dt>
        <dd>${total}</dd>
      </div>
    </dl>
  );

  return embedded ? rows : <div className="soft-card">{rows}</div>;
};
