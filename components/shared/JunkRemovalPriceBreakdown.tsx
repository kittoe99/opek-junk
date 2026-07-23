import React from 'react';
import type { PriceEstimate } from '../../types';
import { JUNK_ONLINE_BOOKING_DISCOUNT_LABEL } from '../../lib/junkRemovalPricing';

interface JunkRemovalPriceBreakdownProps {
  price: PriceEstimate;
}

export const JunkRemovalPriceBreakdown: React.FC<JunkRemovalPriceBreakdownProps> = ({ price }) => {
  const lines = price.lines ?? [];
  const itemSubtotal = price.itemSubtotal ?? price.subtotal ?? price.price;
  const orderMinimum = price.orderMinimum;
  const subtotal = price.subtotal ?? price.price;
  const discount = price.onlineBookingDiscount ?? 0;
  const total = price.price;
  const minimumApplied =
    orderMinimum != null && subtotal > itemSubtotal && subtotal === orderMinimum;

  return (
    <div className="bg-[var(--surface)] rounded-3xl p-5 md:p-6 border border-[var(--border)]">
      {lines.length > 0 && (
        <div className="space-y-2.5 mb-5 pb-5 border-b border-[var(--border)]">
          {lines.map((line) => (
            <div
              key={`${line.name}-${line.quantity}`}
              className="flex justify-between items-start gap-3 text-sm md:text-base"
            >
              <span className="text-[var(--text-muted)] font-medium min-w-0">
                {line.name}
                {line.quantity > 1 ? ` ×${line.quantity}` : ''}
              </span>
              <span className="text-[var(--text)]-900 font-bold shrink-0">${line.lineTotal}</span>
            </div>
          ))}
        </div>
      )}

      {minimumApplied && (
        <>
          <div className="flex justify-between items-center text-sm md:text-base mb-3">
            <span className="text-[var(--text-muted)] font-medium">Item subtotal</span>
            <span className="text-[var(--text)]-900 font-bold">${itemSubtotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm md:text-base mb-5 pb-5 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)] font-medium">Order minimum</span>
            <span className="text-[var(--text)]-900 font-bold">${orderMinimum}</span>
          </div>
        </>
      )}

      <div className="space-y-3 mb-5 pb-5 border-b border-[var(--border)]">
        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-[var(--text-muted)] font-medium">Pick up & Admin fee</span>
          <span className={`font-bold ${discount > 0 ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text)]-900'}`}>
            ${subtotal}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-emerald-300 font-medium">{JUNK_ONLINE_BOOKING_DISCOUNT_LABEL}</span>
            <span className="text-emerald-300 font-bold">-${discount}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Estimated Total
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{price.estimatedVolume}</p>
        </div>
        <p className="text-3xl md:text-4xl font-black text-brand">${total}</p>
      </div>
    </div>
  );
};
