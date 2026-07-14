import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X, MapPin, AlertCircle, CheckCircle2, Heart, HeartHandshake, Truck, BicepsFlexed, Download, RefreshCw, Home, Clock, PackagePlus, PackageMinus, ArrowLeftRight, Boxes, ShieldCheck, Container, Users, Sliders, ClipboardList, Eye, CalendarCheck, Sparkles, Sun, Maximize, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, InputZipIcon, InputMessageIcon } from './icons/ServiceIcons';
import { ITEM_CATALOG, type CatalogItem, type CatalogCategory } from '../lib/itemCatalog';
import { JunkRemovalEstimateFlow, type EstimateMode } from './shared/JunkRemovalEstimateFlow';
import { MovingLaborEstimateFlow } from './shared/MovingLaborEstimateFlow';
import { detectItemsFromPhotos } from '../services/openaiService';
import { ItemIconRenderer } from './icons/JunkItemIcons';
import { calculateStaticPrice, calculateDumpsterRentalPrice, calculateMovingLaborPrice } from '../services/pricingService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState, MovingLaborOptions } from '../types';
import { BookingDetailsForm } from './BookingDetailsForm';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent } from '../lib/customerConsent';
import { toStoredMovingOptions } from '../lib/bookingPayloads';
import { ContactIntakeForm } from './shared/ContactIntakeForm';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { JunkItemCatalogSelector, getCatalogItemImage } from './shared/JunkItemCatalogSelector';
import { JunkRemovalPriceBreakdown } from './shared/JunkRemovalPriceBreakdown';
import { FLOW_PAGE_SHELL, FLOW_PAGE_CONTENT, flowPageMaxWidth, scrollToFlowStep } from '../lib/flowPageLayout';
import { FlowProgressBar } from './shared/flow/FlowProgressBar';
import { FlowZipCheck } from './shared/flow/FlowZipCheck';
import { FlowStickyNav } from './shared/flow/FlowStickyNav';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';
import { FlowSelectionCard } from './shared/flow/FlowSelectionCard';
import { ServiceTypePicker, type ServicePickerId } from './shared/flow/ServiceTypePicker';

type ServedCity = { city: string; state: string };

export const QuotePage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  return submitted ? <div>Success</div> : <div className="flex items-center justify-center min-h-screen"><p className="text-secondary">Quote page loading...</p></div>;
};