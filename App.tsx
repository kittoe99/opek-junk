import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Hero } from './components/Hero';
import {
  HomeFeaturedServices,
  HomeHowItWorks,
  HomeReviews,
  HomeWaysToBook,
} from './components/home/HomeSections';
import { HomeNavbar } from './components/home/HomeNavbar';
import { HomeFooter } from './components/home/HomeFooter';
import { HomeMobileCTA } from './components/home/HomeMobileCTA';
import { HomeCoverageSection } from './components/home/HomeCoverageSection';
import { QuickActionBar } from './components/QuickActionBar';
import { SEO, seoConfig } from './components/SEO';
import { PageTransition, PageEnter } from './components/PageTransition';
import { getCityBySlug } from './lib/cityData';

const QuotePage = React.lazy(() => import('./components/QuotePage').then((m) => ({ default: m.QuotePage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));
const ChatPage = React.lazy(() => import('./components/ChatPage').then((m) => ({ default: m.ChatPage })));
const BookingPage = React.lazy(() => import('./components/BookingPage').then((m) => ({ default: m.BookingPage })));
const ProviderSignupPage = React.lazy(() => import('./components/ProviderSignupPage').then((m) => ({ default: m.ProviderSignupPage })));
const SignUpPage = React.lazy(() => import('./components/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const TrackOrderPage = React.lazy(() => import('./components/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const InHomeEstimatePage = React.lazy(() => import('./components/InHomeEstimatePage').then((m) => ({ default: m.InHomeEstimatePage })));
const MattressBookingPage = React.lazy(() => import('./components/services/MattressBookingPage').then((m) => ({ default: m.MattressBookingPage })));
const JunkRemovalPage = React.lazy(() => import('./components/services/JunkRemovalPage').then((m) => ({ default: m.JunkRemovalPage })));
const DumpsterRentalPage = React.lazy(() => import('./components/services/DumpsterRentalPage').then((m) => ({ default: m.DumpsterRentalPage })));
const PropertyCleanoutPage = React.lazy(() => import('./components/services/PropertyCleanoutPage').then((m) => ({ default: m.PropertyCleanoutPage })));
const SmallLocalMovesPage = React.lazy(() => import('./components/services/SmallLocalMovesPage').then((m) => ({ default: m.SmallLocalMovesPage })));
const MattressDisposalPage = React.lazy(() => import('./components/services/MattressDisposalPage').then((m) => ({ default: m.MattressDisposalPage })));
const JunkRemovalAdsLandingPage = React.lazy(() => import('./components/lp/JunkRemovalAdsLandingPage').then((m) => ({ default: m.JunkRemovalAdsLandingPage })));
const LocalMovesAdsLandingPage = React.lazy(() => import('./components/lp/LocalMovesAdsLandingPage').then((m) => ({ default: m.LocalMovesAdsLandingPage })));
const PrivacyPolicyPage = React.lazy(() => import('./components/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('./components/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage })));
const SmsConsentPage = React.lazy(() => import('./components/SmsConsentPage').then((m) => ({ default: m.SmsConsentPage })));
const CityPage = React.lazy(() => import('./components/CityPage').then((m) => ({ default: m.CityPage })));

const QUICK_ACTION_HIDDEN_PREFIXES = ['/quote', '/booking', '/sms-consent', '/chat'];
const FOOTER_HIDDEN_PREFIXES = ['/quote', '/booking', '/chat'];
const NAVBAR_HIDDEN_PREFIXES = ['/quote', '/booking', '/chat'];

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );
}

function GlobalQuickActionBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (QUICK_ACTION_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const onBookOnline = () => {
    if (pathname === '/services/mattress-disposal') {
      navigate('/booking/mattress');
      return;
    }
    if (pathname === '/lp/junk-removal') {
      navigate('/booking', { state: { serviceType: 'Junk Removal' } });
      return;
    }
    if (pathname === '/lp/local-moves') {
      navigate('/booking', { state: { serviceType: 'Moving Labor' } });
      return;
    }
    navigate('/booking');
  };

  return <QuickActionBar onBookOnline={onBookOnline} variant="light" />;
}

function GlobalFooter() {
  const { pathname } = useLocation();

  if (FOOTER_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return <HomeFooter />;
}

function GlobalNavbar() {
  const { pathname } = useLocation();

  if (NAVBAR_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return <HomeNavbar />;
}

function MainShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const flowChrome = NAVBAR_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <main className={flowChrome ? 'pt-0' : 'pt-[var(--site-header-height)]'}>
      {children}
    </main>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant: the page transition curtain covers the jump.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="home-light home-page">
      <SEO {...seoConfig.home} />
      <Hero
        onGetQuote={() => navigate('/quote')}
        onBookOnline={() => navigate('/booking')}
      />
      <HomeFeaturedServices />
      <HomeHowItWorks />
      <HomeCoverageSection />
      <HomeWaysToBook />
      <HomeReviews />
      <HomeMobileCTA onGetQuote={() => navigate('/quote')} />
    </div>
  );
}

function QuotePageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.quote} />
      <QuotePage />
    </>
  );
}

function ContactPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.contact} />
      <ContactPage />
    </>
  );
}

function ChatPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.chat} />
      <ChatPage />
    </>
  );
}

function BookingPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.booking} />
      <BookingPage />
    </>
  );
}

function JunkRemovalPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.junkRemoval} />
      <JunkRemovalPage />
    </>
  );
}

function JunkRemovalAdsLandingPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.junkRemovalAds} />
      <JunkRemovalAdsLandingPage />
    </>
  );
}

function LocalMovesAdsLandingPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.localMovesAds} />
      <LocalMovesAdsLandingPage />
    </>
  );
}

function DumpsterRentalPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.dumpsterRental} />
      <DumpsterRentalPage />
    </>
  );
}

function PropertyCleanoutPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.propertyCleanout} />
      <PropertyCleanoutPage />
    </>
  );
}



function SmallLocalMovesPageWithSEO() {
  return (
    <>
      <SEO
        title="Small Local Moves | Opek Junk Removal"
        description="Affordable local moves for studios and small homes. Book truck and crew by the hour — or labor only if you already have a truck."
      />
      <SmallLocalMovesPage />
    </>
  );
}

function MattressDisposalPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.mattressDisposal} />
      <MattressDisposalPage />
    </>
  );
}

function ProviderSignupPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.providerSignup} />
      <ProviderSignupPage />
    </>
  );
}

function SignUpPageWithSEO() {
  return (
    <>
      <SEO
        title="Contractor Sign Up | Opek Junk Removal"
        description="Create your independent contractor account to continue your Opek provider application."
        noindex
      />
      <SignUpPage />
    </>
  );
}

function TrackOrderPageWithSEO() {
  return (
    <>
      <SEO title="Track Your Order | Opek Junk Removal" description="Track the status of your junk removal booking with your phone number or order number." />
      <TrackOrderPage />
    </>
  );
}

function InHomeEstimatePageWithSEO() {
  return (
    <>
      <SEO title="Free In-Home Estimate | Opek Junk Removal" description="Schedule a free, no-obligation in-home estimate. A vetted local provider will visit your property and provide an accurate quote on the spot." />
      <InHomeEstimatePage />
    </>
  );
}

function PrivacyPolicyPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.privacy} />
      <PrivacyPolicyPage />
    </>
  );
}

function TermsOfServicePageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.terms} />
      <TermsOfServicePage />
    </>
  );
}

function SmsConsentPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.smsConsent} />
      <SmsConsentPage />
    </>
  );
}

function CityPageRouteWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const city = getCityBySlug(slug ?? '');
  if (!city) return <Navigate to="/" replace />;
  return <CityPage city={city} />;
}

function App() {
  return (
    <Router>
      <div className="site-root min-h-screen selection:bg-brand selection:text-white">
        <PageTransition />
        <ScrollToTop />
        <GlobalNavbar />

        <MainShell>
        <PageEnter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quote" element={<QuotePageWithSEO />} />
            <Route path="/contact" element={<ContactPageWithSEO />} />
            <Route path="/chat" element={<ChatPageWithSEO />} />
            <Route path="/booking" element={<BookingPageWithSEO />} />
            <Route path="/services/junk-removal" element={<JunkRemovalPageWithSEO />} />
            <Route path="/lp/junk-removal" element={<JunkRemovalAdsLandingPageWithSEO />} />
            <Route path="/lp/local-moves" element={<LocalMovesAdsLandingPageWithSEO />} />
            <Route path="/services/dumpster-rental" element={<DumpsterRentalPageWithSEO />} />
            <Route path="/services/residential-junk-removal" element={<Navigate to="/services/junk-removal" replace />} />
            <Route path="/services/commercial" element={<Navigate to="/services/junk-removal" replace />} />
            <Route path="/services/property-cleanout" element={<PropertyCleanoutPageWithSEO />} />
            <Route path="/services/donations-pickup" element={<Navigate to="/" replace />} />
            <Route path="/services/moving-labor" element={<Navigate to="/services/small-local-moves" replace />} />
            <Route path="/services/small-local-moves" element={<SmallLocalMovesPageWithSEO />} />
            <Route path="/services/mattress-disposal" element={<MattressDisposalPageWithSEO />} />
            <Route path="/booking/mattress" element={<MattressBookingPage />} />
            <Route path="/provider-signup" element={<ProviderSignupPageWithSEO />} />
            <Route path="/sign-up" element={<SignUpPageWithSEO />} />
            <Route path="/track-order" element={<TrackOrderPageWithSEO />} />
            <Route path="/in-home-estimate" element={<InHomeEstimatePageWithSEO />} />
            <Route path="/privacy" element={<PrivacyPolicyPageWithSEO />} />
            <Route path="/terms" element={<TermsOfServicePageWithSEO />} />
            <Route path="/sms-consent" element={<SmsConsentPageWithSEO />} />
            <Route path="/locations/:slug" element={<CityPageRouteWrapper />} />
          </Routes>
        </Suspense>
        </PageEnter>
        </MainShell>

        <GlobalQuickActionBar />
        <GlobalFooter />
      </div>
    </Router>
  );
}

export default App;
