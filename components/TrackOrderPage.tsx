import React, { useState } from 'react';
import { MapPinCheck, Clock, CheckCircle, Circle, ArrowLeft, Search, Phone, Hash, ArrowRight, AlertCircle, ChevronRight, Check, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from './shared/PageHero';
import { TrustBadges } from './TrustBadges';
import { ServiceArea } from './ServiceArea';
import { InputPhoneIcon } from './icons/ServiceIcons';

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
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  scheduled: { label: 'Scheduled', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  en_route: { label: 'En Route', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  in_progress: { label: 'In Progress', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
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
      let query = supabase
        .from('bookings')
        .select('id, order_number, customer_info, location_info, booking_details, status, created_at')
        .order('created_at', { ascending: false });

      if (searchType === 'phone') {
        const digits = value.replace(/\D/g, '');
        query = query.like('customer_info->>phone', `%${digits}%`);
      } else {
        const normalized = value.toUpperCase().trim();
        query = query.eq('order_number', normalized);
      }

      const { data, error: queryError } = await query.limit(10);

      if (queryError) throw queryError;
      setResults(data || []);
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
      const { data, error: histError } = await supabase
        .from('order_status_history')
        .select('id, status, note, created_at')
        .eq('booking_id', order.id)
        .order('created_at', { ascending: true });

      if (histError) throw histError;
      setStatusHistory(data || []);
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
    return (
      <div className="bg-secondary-50 min-h-screen">
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => { setSelectedOrder(null); setStatusHistory([]); }}
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors bg-white px-4 py-2 rounded-full border border-secondary-100 shadow-sm"
          >
            <ArrowLeft size={16} /> Back to results
          </button>

          <div className="bg-white border border-secondary-100 rounded-3xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-secondary-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Order Number</p>
                  <p className="text-2xl font-mono font-black text-secondary">{selectedOrder.order_number}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.color}`}>
                  {s.label}
                </span>
              </div>
              <p className="text-xs text-secondary-400">Placed {formatDateTime(selectedOrder.created_at)}</p>
            </div>

            {/* Status Timeline */}
            <div className="p-6 md:p-8 border-b border-secondary-100">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Order Timeline</p>
              {historyLoading ? (
                <div className="flex items-center gap-2 text-sm text-secondary-400">
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
                              <CheckCircle size={12} className="text-secondary-300" />
                            </div>
                          )}
                        </div>
                        <div className="pb-5">
                          <p className={`text-sm font-bold ${isLast ? 'text-secondary' : 'text-secondary-400'}`}>{entryStatus.label}</p>
                          {entry.note && <p className="text-xs text-secondary-400 mt-0.5">{entry.note}</p>}
                          <p className="text-[11px] text-secondary-400 mt-0.5">{formatDateTime(entry.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-secondary-400">No timeline data available.</p>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Customer</p>
                  <p className="text-sm font-bold text-secondary">{selectedOrder.customer_info?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Phone</p>
                  <p className="text-sm font-bold text-secondary">{selectedOrder.customer_info?.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Service Address</p>
                <p className="text-sm font-bold text-secondary">
                  {selectedOrder.location_info?.address}
                  {selectedOrder.location_info?.unit_number && `, ${selectedOrder.location_info.unit_number}`}
                  {selectedOrder.location_info?.city && `, ${selectedOrder.location_info.city}`}
                  {selectedOrder.location_info?.state && `, ${selectedOrder.location_info.state}`}
                  {selectedOrder.location_info?.zip_code && ` ${selectedOrder.location_info.zip_code}`}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Service Type</p>
                  <p className="text-sm font-bold text-secondary capitalize">{selectedOrder.booking_details?.service_type?.replace(/_/g, ' ') || 'General'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Preferred Date</p>
                  <p className="text-sm font-bold text-secondary">{selectedOrder.booking_details?.preferred_date ? formatDate(selectedOrder.booking_details.preferred_date) : 'Not specified'}</p>
                </div>
              </div>
              {selectedOrder.booking_details?.price !== undefined && selectedOrder.booking_details?.price !== null && (
                <div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">Estimated Price</p>
                  <p className="text-3xl font-black text-brand">${selectedOrder.booking_details.price}</p>
                  {selectedOrder.booking_details.estimated_volume && <p className="text-xs text-secondary-400 mt-1">Volume: {selectedOrder.booking_details.estimated_volume}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-secondary-50 border-t border-secondary-100">
              <p className="text-xs text-secondary-500 text-center">
                Questions? Call support at <a href="tel:8313187139" className="font-black text-secondary hover:text-brand transition-colors">(831) 318-7139</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Track Order"
        EyebrowIcon={MapPinCheck}
        title={<>Track your <span className="text-brand">job.</span></>}
        subtitle="Enter your phone number or order number to see live status, ETA, and matched service provider details."
        image="/process-step-3.svg"
        imageAlt="Tracking your order"
      />

      <TrustBadges />

      <section className="py-10 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Tracking Lookup</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-3">
              Find your <span className="text-brand">order.</span>
            </h2>
            <p className="text-secondary-500 text-base leading-relaxed">
              Enter your phone number or order number below to see live status, ETA, and matched service provider details.
            </p>
          </div>

          <div className="bg-white border border-secondary-100 md:border-secondary-100 rounded-3xl p-6 md:p-10 shadow-xl">
            {/* Toggle */}
            <div className="flex bg-white border border-secondary-100 rounded-full p-1 mb-6">
              <button
                onClick={() => { setSearchType('phone'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  searchType === 'phone' ? 'bg-secondary text-white shadow-sm' : 'text-secondary-400 hover:text-secondary'
                }`}
              >
                <Phone size={13} /> Phone
              </button>
              <button
                onClick={() => { setSearchType('order'); setSearchValue(''); setSearched(false); setResults([]); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  searchType === 'order' ? 'bg-secondary text-white shadow-sm' : 'text-secondary-400 hover:text-secondary'
                }`}
              >
                <Hash size={13} /> Order #
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="relative mb-4 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-300 group-focus-within:text-brand transition-colors">
                  {searchType === 'phone' ? <InputPhoneIcon size={18} /> : <Search size={18} />}
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'phone' ? 'Enter your phone number' : 'e.g. OPK-A1B2C3'}
                  className="w-full pl-10 pr-4 py-4 text-sm bg-white border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand/60 focus:shadow-[0_4px_20px_rgba(255,0,110,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className="group w-full py-4 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? 'Searching...' : <>Track Order <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 mt-8 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Results */}
          {searched && !loading && !error && (
            <div className="mt-10">
              {results.length === 0 ? (
                <div className="text-center py-12 px-6 bg-white border border-secondary-100 rounded-3xl">
                  <div className="w-14 h-14 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={22} className="text-secondary-300" />
                  </div>
                  <h3 className="text-lg font-black text-secondary mb-2">No orders found</h3>
                  <p className="text-secondary-500 text-sm max-w-xs mx-auto">
                    No orders were found matching your {searchType === 'phone' ? 'phone number' : 'order number'}. Please double-check and try again.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">
                    {results.length} order{results.length !== 1 ? 's' : ''} found
                  </p>
                  {results.map((order) => {
                    const os = getStatus(order.status);
                    return (
                      <button
                        key={order.id}
                        onClick={() => handleSelectOrder(order)}
                        className="w-full bg-white border border-secondary-100 rounded-2xl p-4 md:p-5 hover:border-brand hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-black text-secondary">{order.order_number}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${os.bg} ${os.color}`}>
                                {os.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-500">
                              {order.booking_details?.service_type && <span className="capitalize">{order.booking_details.service_type.replace(/_/g, ' ')}</span>}
                              {order.booking_details?.preferred_date && <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(order.booking_details.preferred_date)}</span>}
                              {order.location_info?.city && <span className="flex items-center gap-1"><MapPin size={11} />{order.location_info.city}, {order.location_info.state}</span>}
                            </div>
                            {order.booking_details?.price !== undefined && order.booking_details?.price !== null && (
                              <p className="text-sm font-black text-brand mt-2">${order.booking_details.price}</p>
                            )}
                          </div>
                          <ChevronRight size={18} className="text-secondary-300 group-hover:text-brand transition-colors shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!searched && (
            <p className="text-xs text-secondary-400 mt-8 leading-relaxed max-w-lg">
              Your order number (e.g. <span className="font-mono font-bold text-secondary">OPK-A1B2C3</span>) was sent in your booking confirmation. If you don't have it, use your phone number instead.
            </p>
          )}
        </div>
      </section>

      <ServiceArea titleStart="Questions about" titleAccent="your order?" />
    </div>
  );
};
