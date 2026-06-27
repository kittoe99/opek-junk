import React, { useEffect, useMemo, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Loader2, Lock } from 'lucide-react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { BOOKING_DEPOSIT_AMOUNT, BOOKING_DEPOSIT_AMOUNT_CENTS } from '../../lib/deposit';
import { apiUrl } from '../../lib/apiBase';
import { isStripeConfigured, stripePromise } from '../../lib/stripe';

const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#ff006e',
    borderRadius: '12px',
  },
};

const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: '14px',
    color: '#1f2937',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#9ca3af',
    },
    iconColor: '#9ca3af',
    lineHeight: '24px',
  },
  invalid: {
    color: '#ef4444',
    iconColor: '#ef4444',
  },
  complete: {
    color: '#1f2937',
    iconColor: '#10b981',
  },
} as const;

const CARD_FIELD_WRAPPER =
  'px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus-within:ring-4 focus-within:ring-brand/10 focus-within:border-brand focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300';

const FIELD_LABEL =
  'block text-[10px] font-black uppercase tracking-widest text-secondary-400 mb-1.5';

async function parseJsonResponse(response: Response) {
  const responseText = await response.text();
  const trimmed = responseText.trimStart();

  if (trimmed.startsWith('<')) {
    throw new Error('Payment API is unavailable. Please try again in a moment.');
  }

  try {
    return JSON.parse(responseText) as Record<string, unknown>;
  } catch {
    const plain = trimmed.replace(/\s+/g, ' ').slice(0, 180);
    throw new Error(
      plain
        ? `Payment server error: ${plain}`
        : 'Payment server returned an invalid response. Please try again.'
    );
  }
}

async function createDepositPaymentIntent(input: {
  email: string;
  name?: string;
  phone?: string;
  serviceType?: string;
}) {
  const paymentResponse = await fetch(apiUrl('/api/create-payment-intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      phone: input.phone,
      serviceType: input.serviceType,
    }),
  });

  const paymentData = await parseJsonResponse(paymentResponse);
  if (!paymentResponse.ok) {
    throw new Error(
      (typeof paymentData.error === 'string' && paymentData.error) ||
        'Failed to initialize payment.'
    );
  }

  const clientSecret =
    typeof paymentData.clientSecret === 'string' ? paymentData.clientSecret : null;
  if (!clientSecret) {
    throw new Error('Failed to initialize payment.');
  }

  return clientSecret;
}

// ... truncated for MCP size - use full file from repo
