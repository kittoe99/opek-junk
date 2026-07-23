import React, { useState } from 'react';
import { Clock, CheckCircle, Circle, ArrowLeft, Search, Phone, Hash, ArrowRight, AlertCircle, ChevronRight, Check, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  UTILITY_FORM_CARD,
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PAGE_CONTENT,
  UTILITY_PAGE_SHELL,
  UTILITY_PRIMARY_BUTTON,
} from '../lib/flowPageLayout';
import { UtilityPageHeader } from './shared/UtilityPageHeader';

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
  } catch { return dateStr; }
};

const formatSchedule = (date?: string, time?: string | null) => {
  if (!date) return 'Not specified';
  return time ? `${formatPreferredDate(date)} · ${time}` : formatPreferredDate(date);
};

export const TrackOrderPage: React.FC = () => {
  const [searchType, setSearchType] = useState<'phone' | 'order'>('phone');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<BookingResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<BookingResult | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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
        p_search_type: searchType,
        p_search_value: value,
      });

      if (queryError) throw queryError;
      setResults((data as BookingResult[]) || []);
    } catch (err: any) {
      console.error('Track order error:', err);
      setError('Unable to look up your order. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (order: BookingResult) => {
    setSelectedOrder(order);
    setHistoryLoading(true);
    try {
      const { data, error: histError } = await supabase.rpc('get_order_status_history', {
        p_booking_id: order.id,
        p_search_type: searchType,
        p_search_value: searchValue.trim(),
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

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch { return dateStr; }
  };

  // Order detail view
  if (selectedOrder) {
    const s = getStatus(selectedOrder.status);
    const detailLabel = 'text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1';
    return (
      <div className={UTILITY_PAGE_SHELL}>
        <div className={`${UTILITY_PAGE_CONTENT} max-w-3xl`}>
          <button
            onClick={() => { setSelectedOrder(null); setStatusHistory([]); }}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)] shadow-sm"
          >
            <ArrowLeft size={16} /> Back to results
          </button>

          <div className={`${UTILITY_FORM_CARD} overflow-hidden p-0`}>
            {/* Header */}
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

            {/* Status Timeline */}
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
                        {!isLast && <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-secondary-100" />}
                        <div className="relative z-10 mt-0.5 shrink-0">
                          {isLast ? (
                            <div className={`w-[18px] h-[18px] rounded-full ${entryStatus.dot} flex items-center justify-center`}>
                              {entry.status === 'completed' ? <CheckCircle size={12} className="text-white" /> : <Circle size={8} className="text-white fill-white" />}
                            </div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full bg-secondary-100 flex items-center justify-center">
                              <CheckCircle size={12} className="text-neutral-500" />
                            </div>
                          )}
                        </div>
                        <div className="pb-5">
                          <p className={`text-sm font-semibold ${isLast ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{entryStatus.label}</p>
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

            {/* Details */}
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
                  <p className="text-sm font-semibold text-[var(--text)] capitalize">{selectedOrder.booking_details?.service_type?.replace(/_/g, ' ') || 'General'}</p>
                </div>
                <div>
                  <p className={detailLabel}>Preferred Date</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{formatSchedule(selectedOrder.booking_details?.preferred_date, selectedOrder.booking_details?.preferred_time)}</p>
                </div>
              </div>
              {selectedOrder.booking_details?.price !== undefined && selectedOrder.booking_details?.price !== null && (
                <div>
                  <p className={detailLabel}>Estimated Price</p>
                  <p className="text-3xl font-sans font-semibold text-brand">${selectedOrder.booking_details.price}</p>
                  {selectedOrder.booking_details.estimated_volume && <p className="text-xs text-[var(--text-muted)] mt-1">Volume: {selectedOrder.booking_details.estimated_volume}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-[var(--surface)] border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] text-center">
                Questions? Call support at <a href="tel:8313187139" className="font-semibold text-[var(--text)] hover:text-brand transition-colors">(831) 318-7139</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={UTILITY_PAGE_SHELL}>
      <UtilityPageHeader
        eyebrow="Track Order"
        title={<>Track your <span className="text-brand">job.</span></>}
        description="Enter your phone number or order number to see live status, ETA, and matched provider details."
      />

      <div className={UTILITY_PAGE_CONTENT}>
        <div className={`${UTILITY_FORM_CARD} max-w-md mx-auto`}>
            {/* Toggle */}
            <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 mb-6">
              <button
                onClick={() => { setSearchType('phone'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  searchType === 'phone' ? 'bg-brand text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Phone size={13} /> Phone
              </button>
              <button
                onClick={() => { setSearchType('order'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  searchType === 'order' ? 'bg-brand text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Hash size={13} /> Order #
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="relative mb-4 group">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'phone' ? 'Enter your phone number' : 'e.g. OPK-A1B2C3'}
                  className={UTILITY_INPUT}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className={UTILITY_PRIMARY_BUTTON}
              >
                {loading ? 'Searching...' : <>Track Order <ArrowRight size={14} /></>}
              </button>
            </form>
        </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 mt-8 max-w-md mx-auto bg-brand/10 border border-brand/30 rounded-2xl">
              <AlertCircle size={18} className="text-brand shrink-0" />
              <p className="text-red-300 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Results */}
          {searched && !loading && !error && (
            <div className="mt-10 max-w-md mx-auto">
              {results.length === 0 ? (
                <div className="text-center py-12 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
                  <div className="w-14 h-14 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                    <Search size={22} className="text-neutral-500" />
                  </div>
                  <h3 className="font-sans text-lg font-semibold text-[var(--text)] mb-2">No orders found</h3>
                  <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
                    No orders were found matching your {searchType === 'phone' ? 'phone number' : 'order number'}. Please double-check and try again.
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
                        onClick={() => handleSelectOrder(order)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 md:p-5 hover:border-brand/40 hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-semibold text-[var(--text)]">{order.order_number}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${os.bg} ${os.color}`}>
                                {os.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                              {order.booking_details?.service_type && <span className="capitalize">{order.booking_details.service_type.replace(/_/g, ' ')}</span>}
                              {order.booking_details?.preferred_date && <span className="flex items-center gap-1"><Calendar size={11} />{formatSchedule(order.booking_details.preferred_date, order.booking_details.preferred_time)}</span>}
                              {order.location_info?.city && <span className="flex items-center gap-1"><MapPin size={11} />{order.location_info.city}, {order.location_info.state}</span>}
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

          {!searched && (
            <p className="text-xs text-[var(--text-muted)] mt-8 leading-relaxed max-w-md mx-auto text-center">
              Your order number (e.g. <span className="font-mono font-semibold text-[var(--text)]">OPK-A1B2C3</span>) was sent in your booking confirmation. If you don't have it, use your phone number instead.
            </p>
          )}
      </div>
    </div>
  );
};
