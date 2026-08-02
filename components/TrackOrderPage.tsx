import React, { useRef, useState } from 'react';
import {
  Clock,
  CheckCircle,
  Circle,
  ArrowLeft,
  Search,
  Phone,
  Hash,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  Calendar,
  MapPin,
  Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  requestOrderLookupOtp,
  verifyOrderLookupOtp,
} from '../lib/lookupOrderByPhone';
import { ServicePageHero } from './shared/ServicePageHero';
import {
  UTILITY_FORM_CARD,
  UTILITY_FORM_WRAP,
  UTILITY_INPUT,
  UTILITY_PAGE_CONTENT,
  UTILITY_PRIMARY_BUTTON,
} from '../lib/flowPageLayout';

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

interface StatusHistoryItem {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/30', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-400/30', dot: 'bg-blue-500' },
  scheduled: { label: 'Scheduled', color: 'text-indigo-300', bg: 'bg-indigo-400/10 border-indigo-400/30', dot: 'bg-indigo-500' },
  en_route: { label: 'En Route', color: 'text-orange-300', bg: 'bg-orange-400/10 border-orange-400/30', dot: 'bg-orange-500' },
  in_progress: { label: 'In Progress', color: 'text-orange-300', bg: 'bg-orange-400/10 border-orange-400/30', dot: 'bg-orange-500' },
  completed: { label: 'Completed', color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/30', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-300', bg: 'bg-red-400/10 border-red-400/30', dot: 'bg-red-500' },
};

const formatPreferredDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const formatSchedule = (date?: string, time?: string | null) => {
  if (!date) return 'Not specified';
  return time ? `${formatPreferredDate(date)} · ${time}` : formatPreferredDate(date);
};

function formatDisplayPhone(val: string) {
  if (!val) return '';
  if (val.length <= 3) return val;
  if (val.length <= 6) return `(${val.slice(0, 3)}) ${val.slice(3)}`;
  return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
}

export const TrackOrderPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
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
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetLookupState = () => {
    setResults([]);
    setSelectedOrder(null);
    setStatusHistory([]);
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
    setSelectedOrder(null);
    setStatusHistory([]);
    setSearched(false);
    try {
      const result = await requestOrderLookupOtp(formatDisplayPhone(phoneDigits));
      if (!result.ok) {
        if (result.reason === 'no_order') {
          setSearched(true);
          setResults([]);
          setError(null);
        } else {
          setError(result.error || 'Could not send verification code.');
        }
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
      setResults(result.bookings as BookingResult[]);
      setSearched(true);
      setOtpStep(false);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'phone') {
      if (otpStep) {
        await verifyPhoneCode();
      } else {
        await sendPhoneCode();
      }
      return;
    }

    const value = searchValue.trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedOrder(null);
    setStatusHistory([]);
    setSearched(true);

    try {
      const { data, error: queryError } = await supabase.rpc('track_order', {
        p_search_type: 'order',
        p_search_value: value,
      });

      if (queryError) throw queryError;
      setResults((data as BookingResult[]) || []);
    } catch (err: unknown) {
      console.error('Track order error:', err);
      setError('Unable to look up your order. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (order: BookingResult) => {
    setSelectedOrder(order);
    setHistoryLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const proofValue =
      searchType === 'phone'
        ? order.customer_info?.phone || formatDisplayPhone(phoneDigits)
        : searchValue.trim();
    try {
      const { data, error: histError } = await supabase.rpc('get_order_status_history', {
        p_booking_id: order.id,
        p_search_type: searchType,
        p_search_value: proofValue,
      });

      if (histError) throw histError;
      setStatusHistory((data as StatusHistoryItem[]) || []);
    } catch (err) {
      console.error('Failed to load status history:', err);
      setStatusHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatus = (status: string) => STATUS_MAP[status] || STATUS_MAP.pending;

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (selectedOrder) {
    const s = getStatus(selectedOrder.status);
    const detailLabel = 'text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1';
    return (
      <div className="home-dark min-h-screen pb-24">
        <div className={`${UTILITY_PAGE_CONTENT} max-w-3xl`}>
          <button
            type="button"
            onClick={() => {
              setSelectedOrder(null);
              setStatusHistory([]);
            }}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)] shadow-sm"
          >
            <ArrowLeft size={16} /> Back to results
          </button>

          <div className={`${UTILITY_FORM_CARD} overflow-hidden p-0`}>
            <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className={detailLabel}>Order Number</p>
                  <p className="text-2xl font-mono font-semibold text-[var(--text)]">{selectedOrder.order_number}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.color}`}>
                  {s.label}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Placed {formatDateTime(selectedOrder.created_at)}</p>
            </div>

            <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--surface)]">
              <p className={`${detailLabel} mb-4`}>Order Timeline</p>
              {historyLoading ? (
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Clock size={14} className="animate-spin" /> Loading timeline...
                </div>
              ) : statusHistory.length > 0 ? (
                <div className="relative">
                  {statusHistory.map((entry, i) => {
                    const isLast = i === statusHistory.length - 1;
                    const entryStatus = getStatus(entry.status);
                    return (
                      <div key={entry.id} className="flex gap-3 relative">
                        {!isLast && <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-white/10" />}
                        <div className="relative z-10 mt-0.5 shrink-0">
                          {isLast ? (
                            <div className={`w-[18px] h-[18px] rounded-full ${entryStatus.dot} flex items-center justify-center`}>
                              {entry.status === 'completed' ? (
                                <CheckCircle size={12} className="text-white" />
                              ) : (
                                <Circle size={8} className="text-white fill-white" />
                              )}
                            </div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex items-center justify-center">
                              <CheckCircle size={12} className="text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="pb-5">
                          <p className={`text-sm font-semibold ${isLast ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                            {entryStatus.label}
                          </p>
                          {entry.note && <p className="text-xs text-[var(--text-muted)] mt-0.5">{entry.note}</p>}
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{formatDateTime(entry.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No timeline data available.</p>
              )}
            </div>

            <div className="p-6 md:p-8 space-y-5 bg-[var(--surface)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className={detailLabel}>Customer</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{selectedOrder.customer_info?.name}</p>
                </div>
                <div>
                  <p className={detailLabel}>Phone</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{selectedOrder.customer_info?.phone}</p>
                </div>
              </div>
              <div>
                <p className={detailLabel}>Service Address</p>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {selectedOrder.location_info?.address}
                  {selectedOrder.location_info?.unit_number && `, ${selectedOrder.location_info.unit_number}`}
                  {selectedOrder.location_info?.city && `, ${selectedOrder.location_info.city}`}
                  {selectedOrder.location_info?.state && `, ${selectedOrder.location_info.state}`}
                  {selectedOrder.location_info?.zip_code && ` ${selectedOrder.location_info.zip_code}`}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className={detailLabel}>Service Type</p>
                  <p className="text-sm font-semibold text-[var(--text)] capitalize">
                    {selectedOrder.booking_details?.service_type?.replace(/_/g, ' ') || 'General'}
                  </p>
                </div>
                <div>
                  <p className={detailLabel}>Preferred Date</p>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {formatSchedule(
                      selectedOrder.booking_details?.preferred_date,
                      selectedOrder.booking_details?.preferred_time,
                    )}
                  </p>
                </div>
              </div>
              {selectedOrder.booking_details?.price !== undefined &&
                selectedOrder.booking_details?.price !== null && (
                  <div>
                    <p className={detailLabel}>Estimated Price</p>
                    <p className="text-3xl font-sans font-semibold text-brand">
                      ${selectedOrder.booking_details.price}
                    </p>
                    {selectedOrder.booking_details.estimated_volume && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Volume: {selectedOrder.booking_details.estimated_volume}
                      </p>
                    )}
                  </div>
                )}
            </div>

            <div className="p-6 md:p-8 bg-[var(--surface)] border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] text-center">
                Questions? Call support at{' '}
                <a href="tel:8313187139" className="font-semibold text-[var(--text)] hover:text-brand transition-colors">
                  (831) 318-7139
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-dark min-h-screen pb-24">
      <ServicePageHero
        eyebrow="Track Order"
        title={
          <>
            Track your
            <br />
            job
          </>
        }
        subtitle="Enter your phone number or order number to see live status, schedule, and service details."
        image="/opek-track-order-hero.png?v=2"
        imageAlt="Opek junk removal provider carrying a rug and nightstand"
        chip="Live status"
        primaryCta={{ label: 'Look Up Order', onClick: scrollToForm }}
        secondaryCta={{ label: 'Call Support', href: 'tel:8313187139' }}
      />

      <div
        ref={formRef}
        id="track-lookup"
        className={`${UTILITY_FORM_WRAP} animate-fade-in scroll-mt-[var(--site-header-height)]`}
      >
        <div className={UTILITY_FORM_CARD}>
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">
              {otpStep ? 'Enter your code' : 'Find your order'}
            </h2>
            <p className="text-[var(--text-muted)] text-xs">
              {otpStep
                ? `We texted a 6-digit code to ${formatDisplayPhone(phoneDigits)}.`
                : 'Search by phone or confirmation number.'}
            </p>
          </div>

          {!otpStep ? (
            <div className="flex bg-[var(--bg)] border border-[var(--border)] rounded-full p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setSearchType('phone');
                  setSearchValue('');
                  setPhoneDigits('');
                  resetLookupState();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  searchType === 'phone' ? 'bg-brand text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Phone size={13} /> Phone
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType('order');
                  setSearchValue('');
                  setPhoneDigits('');
                  resetLookupState();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  searchType === 'order' ? 'bg-brand text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Hash size={13} /> Order #
              </button>
            </div>
          ) : null}

          <form onSubmit={handleSearch}>
            {otpStep ? (
              <div className="relative mb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(e) => {
                    setError(null);
                    setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  }}
                  placeholder="######"
                  className={`${UTILITY_INPUT} tracking-[0.35em] text-center text-lg font-semibold`}
                  disabled={loading}
                  required
                />
              </div>
            ) : (
              <div className="relative mb-4">
                <input
                  type={searchType === 'phone' ? 'tel' : 'text'}
                  inputMode={searchType === 'phone' ? 'tel' : 'text'}
                  value={searchValue}
                  onChange={searchType === 'phone' ? handlePhoneChange : (e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'phone' ? 'Enter your phone number' : 'e.g. OPK-A1B2C3'}
                  className={UTILITY_INPUT}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={
                loading ||
                (otpStep ? otpCode.length !== 6 : searchType === 'phone' ? phoneDigits.length < 10 : !searchValue.trim())
              }
              className={UTILITY_PRIMARY_BUTTON}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {otpStep ? 'Verifying...' : searchType === 'phone' ? 'Sending code...' : 'Searching...'}
                </span>
              ) : otpStep ? (
                <>
                  Verify <ArrowRight size={14} />
                </>
              ) : searchType === 'phone' ? (
                <>
                  Text me a code <ArrowRight size={14} />
                </>
              ) : (
                <>
                  Track Order <ArrowRight size={14} />
                </>
              )}
            </button>
            {otpStep ? (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => void sendPhoneCode()}
                  disabled={loading}
                  className="w-full text-center text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-2"
                >
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
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors py-2"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              </div>
            ) : null}
          </form>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 mt-8 bg-brand/10 border border-brand/30 rounded-2xl">
            <AlertCircle size={18} className="text-brand shrink-0" />
            <p className="text-red-300 text-sm font-semibold">{error}</p>
          </div>
        )}

        {searched && !loading && !error && !otpStep && (
          <div className="mt-10">
            {results.length === 0 ? (
              <div className="text-center py-12 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
                <div className="w-14 h-14 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                  <Search size={22} className="text-neutral-500" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-[var(--text)] mb-2">No orders found</h3>
                <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
                  No orders were found matching your{' '}
                  {searchType === 'phone' ? 'phone number' : 'order number'}. Please double-check and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  {results.length} order{results.length !== 1 ? 's' : ''} found
                </p>
                {results.map((order) => {
                  const os = getStatus(order.status);
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => handleSelectOrder(order)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5 hover:border-brand/40 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-semibold text-[var(--text)]">{order.order_number}</span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${os.bg} ${os.color}`}
                            >
                              {os.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                            {order.booking_details?.service_type && (
                              <span className="capitalize">{order.booking_details.service_type.replace(/_/g, ' ')}</span>
                            )}
                            {order.booking_details?.preferred_date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {formatSchedule(
                                  order.booking_details.preferred_date,
                                  order.booking_details.preferred_time,
                                )}
                              </span>
                            )}
                            {order.location_info?.city && (
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {order.location_info.city}, {order.location_info.state}
                              </span>
                            )}
                          </div>
                          {order.booking_details?.price !== undefined && order.booking_details?.price !== null && (
                            <p className="text-sm font-semibold text-brand mt-2">${order.booking_details.price}</p>
                          )}
                        </div>
                        <ChevronRight size={18} className="text-neutral-500 group-hover:text-brand transition-colors shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!searched && !otpStep && (
          <p className="text-xs text-[var(--text-muted)] mt-8 leading-relaxed text-center">
            Your order number (e.g. <span className="font-mono font-semibold text-[var(--text)]">OPK-A1B2C3</span>) was
            sent in your booking confirmation. If you don&apos;t have it, use your phone number — we&apos;ll text a
            verification code before showing your orders.
          </p>
        )}
      </div>
    </div>
  );
};
