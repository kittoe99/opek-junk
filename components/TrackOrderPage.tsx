import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Calendar, Check, ChevronRight, Hash, Loader2, MapPin, Phone, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { requestOrderLookupOtp, verifyOrderLookupOtp } from '../lib/lookupOrderByPhone';
import { UTILITY_INPUT } from '../lib/flowPageLayout';

interface BookingResult {
  id: string;
  order_number: string;
  customer_info: {
    name: string;
    phone: string;
    email: string;
  };
  location_info: {
    address: string;
    unit_number: string | null;
    city: string;
    state: string;
    zip_code: string;
  };
  booking_details: {
    service_type: string;
    preferred_date: string;
    preferred_time?: string | null;
    details: string;
    estimated_items: string[] | null;
    estimated_volume: string | null;
    price: number | null;
    estimate_summary: string | null;
    photo_url: string | null;
  };
  status: string;
  created_at: string;
}

/** Customer-facing progress: every backend status maps onto one of these steps. */
const STEPS = ['Booked', 'Confirmed', 'On the way', 'Done'] as const;
const STEP_INDEX: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  scheduled: 1,
  en_route: 2,
  in_progress: 2,
  completed: 3,
};
const STATUS_LABEL: Record<string, string> = {
  pending: 'Booked',
  confirmed: 'Confirmed',
  scheduled: 'Scheduled',
  en_route: 'On the way',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusLabel = (status: string) => STATUS_LABEL[status] ?? 'Booked';

const formatSchedule = (date?: string, time?: string | null) => {
  if (!date) return 'Date to be confirmed';
  let label = date;
  try {
    label = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch {
    // keep raw value
  }
  return time ? `${label} · ${time}` : label;
};

const formatAddress = (loc: BookingResult['location_info']) =>
  [
    [loc?.address, loc?.unit_number].filter(Boolean).join(', '),
    [loc?.city, [loc?.state, loc?.zip_code].filter(Boolean).join(' ')].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join(', ');

const serviceName = (order: BookingResult) =>
  order.booking_details?.service_type?.replace(/_/g, ' ') || 'Junk removal';

function formatDisplayPhone(val: string) {
  if (!val) return '';
  if (val.length <= 3) return val;
  if (val.length <= 6) return `(${val.slice(0, 3)}) ${val.slice(3)}`;
  return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`soft-badge ${status === 'cancelled' ? 'is-cancelled' : status === 'completed' ? 'is-done' : ''}`}>
    {statusLabel(status)}
  </span>
);

export const TrackOrderPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'phone' | 'order'>('phone');
  const [searchValue, setSearchValue] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [results, setResults] = useState<BookingResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<BookingResult | null>(null);

  const showResults = (orders: BookingResult[]) => {
    setResults(orders);
    setSearched(true);
    // One match: go straight to it.
    setSelectedOrder(orders.length === 1 ? orders[0] : null);
  };

  const switchSearchType = (type: 'phone' | 'order') => {
    setSearchType(type);
    setSearchValue('');
    setPhoneDigits('');
    setResults([]);
    setSelectedOrder(null);
    setSearched(false);
    setError(null);
    setOtpStep(false);
    setOtpCode('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 11 && val.startsWith('1')) val = val.slice(1);
    const digits = val.slice(0, 10);
    setPhoneDigits(digits);
    setSearchValue(formatDisplayPhone(digits));
  };

  const sendPhoneCode = async () => {
    setError(null);
    if (phoneDigits.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    setResults([]);
    setSearched(false);
    try {
      const result = await requestOrderLookupOtp(formatDisplayPhone(phoneDigits));
      if (!result.ok) {
        if (result.reason === 'no_order') showResults([]);
        else setError(result.error || 'Could not send verification code.');
        return;
      }
      setOtpStep(true);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async () => {
    setError(null);
    const digits = otpCode.replace(/\D/g, '');
    if (digits.length !== 6) {
      setError('Enter the 6-digit code we texted you.');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOrderLookupOtp(formatDisplayPhone(phoneDigits), digits);
      if (!result.ok || !result.bookings) {
        setError(result.error || 'Verification failed.');
        return;
      }
      setOtpStep(false);
      setOtpCode('');
      showResults(result.bookings as BookingResult[]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'phone') {
      await (otpStep ? verifyPhoneCode() : sendPhoneCode());
      return;
    }

    const value = searchValue.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const { data, error: queryError } = await supabase.rpc('track_order', {
        p_search_type: 'order',
        p_search_value: value,
      });
      if (queryError) throw queryError;
      showResults((data as BookingResult[]) || []);
    } catch (err: unknown) {
      console.error('Track order error:', err);
      setError('Unable to look up your order. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => switchSearchType(searchType);

  // ── Order detail ──
  if (selectedOrder) {
    const order = selectedOrder;
    const cancelled = order.status === 'cancelled';
    const current = STEP_INDEX[order.status] ?? 0;
    const price = order.booking_details?.price;

    return (
      <div className="site-page home-light interior-home soft-page">
        <div className="soft-wrap">
          <button
            type="button"
            className="track-back"
            onClick={() => (results.length > 1 ? setSelectedOrder(null) : startOver())}
          >
            <ArrowLeft size={16} aria-hidden />
            {results.length > 1 ? 'All orders' : 'New search'}
          </button>

          <div className="soft-card">
            <div className="track-order-head">
              <div>
                <p className="soft-label">Order</p>
                <p className="soft-order-number">{order.order_number}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {!cancelled && (
              <ol className="track-steps" aria-label="Order progress">
                {STEPS.map((step, i) => (
                  <li
                    key={step}
                    className={i < current ? 'is-done' : i === current ? 'is-current' : ''}
                    aria-current={i === current ? 'step' : undefined}
                  >
                    <span className="track-step-dot" aria-hidden>
                      {i < current || (i === current && order.status === 'completed') ? <Check size={12} strokeWidth={3.5} /> : null}
                    </span>
                    <span className="track-step-label">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            <dl className="soft-details">
              <div>
                <dt><Calendar size={16} aria-hidden />When</dt>
                <dd>{formatSchedule(order.booking_details?.preferred_date, order.booking_details?.preferred_time)}</dd>
              </div>
              <div>
                <dt><MapPin size={16} aria-hidden />Where</dt>
                <dd>{formatAddress(order.location_info) || '—'}</dd>
              </div>
              <div>
                <dt><Hash size={16} aria-hidden />Service</dt>
                <dd className="capitalize">{serviceName(order)}</dd>
              </div>
              {price !== undefined && price !== null && (
                <div>
                  <dt>Estimate</dt>
                  <dd className="soft-price">${price}</dd>
                </div>
              )}
            </dl>
          </div>

          <p className="soft-help">
            Need to change something? Call or text <a href="tel:8313187139">(831) 318-7139</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Lookup ──
  const submitDisabled =
    loading || (otpStep ? otpCode.length !== 6 : searchType === 'phone' ? phoneDigits.length < 10 : !searchValue.trim());

  return (
    <div className="site-page home-light interior-home soft-page">
      <div className="soft-wrap">
        <h1 className="home-display soft-title">Track your order</h1>
        <p className="soft-sub">
          {otpStep
            ? `Enter the 6-digit code we texted to ${formatDisplayPhone(phoneDigits)}.`
            : 'Look up your booking by phone number or order number.'}
        </p>

        <div className="soft-card">
          {!otpStep && (
            <div className="soft-tabs" role="tablist" aria-label="Search by">
              <button
                type="button"
                role="tab"
                aria-selected={searchType === 'phone'}
                onClick={() => switchSearchType('phone')}
              >
                <Phone size={15} aria-hidden /> Phone
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={searchType === 'order'}
                onClick={() => switchSearchType('order')}
              >
                <Hash size={15} aria-hidden /> Order number
              </button>
            </div>
          )}

          <form onSubmit={handleSearch} className="track-form" noValidate>
            {otpStep ? (
              <>
                <label htmlFor="track-code" className="sr-only">Verification code</label>
                <input
                  id="track-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => {
                    setError(null);
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  }}
                  placeholder="••••••"
                  className={`${UTILITY_INPUT} track-code-input`}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  autoFocus
                />
              </>
            ) : (
              <>
                <label htmlFor="track-search" className="sr-only">
                  {searchType === 'phone' ? 'Phone number' : 'Order number'}
                </label>
                <input
                  id="track-search"
                  type={searchType === 'phone' ? 'tel' : 'text'}
                  inputMode={searchType === 'phone' ? 'tel' : 'text'}
                  autoComplete={searchType === 'phone' ? 'tel-national' : 'off'}
                  value={searchValue}
                  onChange={searchType === 'phone' ? handlePhoneChange : (e) => { setError(null); setSearchValue(e.target.value); }}
                  placeholder={searchType === 'phone' ? '(555) 123-4567' : 'OPK-XXXXXX'}
                  className={UTILITY_INPUT}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                />
              </>
            )}

            <button type="submit" disabled={submitDisabled} aria-busy={loading} className="flow-btn flow-btn-primary w-full">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" aria-hidden /><span>{otpStep ? 'Verifying…' : searchType === 'phone' ? 'Sending code…' : 'Finding order…'}</span></>
              ) : (
                <>
                  {otpStep ? 'Verify' : searchType === 'phone' ? 'Text me a code' : 'Find my order'}
                  <ArrowRight size={18} aria-hidden />
                </>
              )}
            </button>

            {error && (
              <p className="soft-error" role="alert">
                <AlertCircle size={16} aria-hidden />
                {error}
              </p>
            )}

            {otpStep ? (
              <div className="track-otp-actions">
                <button type="button" onClick={() => void sendPhoneCode()} disabled={loading}>
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpCode('');
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Change number
                </button>
              </div>
            ) : (
              <p className="soft-hint">
                {searchType === 'phone'
                  ? 'We’ll text a code to confirm it’s you.'
                  : 'Your order number is in your booking confirmation.'}
              </p>
            )}
          </form>
        </div>

        {searched && !loading && !error && !otpStep && (
          results.length === 0 ? (
            <div className="track-empty">
              <Search size={22} aria-hidden />
              <p className="track-empty-title">No orders found</p>
              <p>Check the {searchType === 'phone' ? 'phone number' : 'order number'} and try again.</p>
            </div>
          ) : (
            <div className="track-results">
              <p className="soft-label">{results.length} orders found</p>
              {results.map((order) => (
                <button key={order.id} type="button" className="track-result" onClick={() => setSelectedOrder(order)}>
                  <span className="min-w-0 flex-1">
                    <span className="track-result-top">
                      <span className="track-result-number">{order.order_number}</span>
                      <StatusBadge status={order.status} />
                    </span>
                    <span className="track-result-meta">
                      <span className="capitalize">{serviceName(order)}</span>
                      {' · '}
                      {formatSchedule(order.booking_details?.preferred_date, order.booking_details?.preferred_time)}
                    </span>
                  </span>
                  <ChevronRight size={18} aria-hidden className="shrink-0 text-[#9488a3]" />
                </button>
              ))}
            </div>
          )
        )}

        <p className="soft-help">
          Questions? Call or text <a href="tel:8313187139">(831) 318-7139</a>
        </p>
      </div>
    </div>
  );
};
