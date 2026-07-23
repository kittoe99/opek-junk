import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JunkHaulAway } from './components/JunkHaulAway';
import { RelatedServices } from './components/RelatedServices';
import { HustleMuscle } from './components/HustleMuscle';
import { OpekApproach } from './components/OpekApproach';
import { LocalServiceAreas } from './components/LocalServiceAreas';
import { ServiceArea } from './components/ServiceArea';
import { Testimonials } from './components/Testimonials';
import { ZipFinder } from './components/ZipFinder';
import { Footer } from './components/Footer';
import { QuickActionBar } from './components/QuickActionBar';
import { JunkRemovalPage } from './components/services/JunkRemovalPage';
import { DumpsterRentalPage } from './components/services/DumpsterRentalPage';
import { PropertyCleanoutPage } from './components/services/PropertyCleanoutPage';
import { MovingLaborPage } from './components/services/MovingLaborPage';
import { SmallLocalMovesPage } from './components/services/SmallLocalMovesPage';
import { MattressDisposalPage } from './components/services/MattressDisposalPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { SEO, seoConfig } from './components/SEO';
import { CityPage } from './components/CityPage';
import { PageLoader } from './components/PageLoader';
import { getCityBySlug } from './lib/cityData';

const QuotePage = React.lazy(() => import('./components/QuotePage').then((m) => ({ default: m.QuotePage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));
const BookingPage = React.lazy(() => import('./components/BookingPage').then((m) => ({ default: m.BookingPage })));
const ProviderSignupPage = React.lazy(() => import('./components/ProviderSignupPage').then((m) => ({ default: m.ProviderSignupPage })));
const SignUpPage = React.lazy(() => import('./components/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const TrackOrderPage = React.lazy(() => import('./components/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const InHomeEstimatePage = React.lazy(() => import('./components/InHomeEstimatePage').then((m) => ({ default: m.InHomeEstimatePage })));
const MattressBookingPage = React.lazy(() => import('./components/services/MattressBookingPage').then((m) => ({ default: m.MattressBookingPage })));

const QUICK_ACTION_HIDDEN_PREFIXES = ['/quote', '/booking'];
const FOOTER_HIDDEN_PREFIXES = ['/quote', '/booking'];

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
    navigate('/booking');
  };

  return <QuickActionBar onBookOnline={onBookOnline} />;
}

function GlobalFooter() {
  const { pathname } = useLocation();

  if (FOOTER_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return <Footer />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="home-dark">
      <SEO {...seoConfig.home} />
      <Hero
        onGetQuote={() => navigate('/quote')}
        onBookOnline={() => navigate('/booking')}
      />
      <JunkHaulAway />
      <RelatedServices excludePath="/services/junk-removal" />
      <HustleMuscle />
      <OpekApproach />
      <LocalServiceAreas />
      <ServiceArea
        titleStart="Schedule a pickup."
        titleAccent="Providers handle the rest."
        theme="dark"
      />
      <Testimonials theme="dark" />
      <ZipFinder />
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



function MovingLaborPageWithSEO() {
  return (
    <>
      <SEO title="Moving Labor | Opek Junk Removal" description="Hire professional moving labor to load, unload, or move items within your home." />
      <MovingLaborPage />
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

function CityPageRouteWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const city = getCityBySlug(slug ?? '');
  if (!city) return <Navigate to="/" replace />;
  return <CityPage city={city} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#070709] text-neutral-100 selection:bg-brand selection:text-white">
        <PageLoader />
        <ScrollToTop />
        <Navbar />
        
        <main className="pt-[var(--site-header-height)]">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quote" element={<QuotePageWithSEO />} />
            <Route path="/contact" element={<ContactPageWithSEO />} />
            <Route path="/booking" element={<BookingPageWithSEO />} />
            <Route path="/services/junk-removal" element={<JunkRemovalPageWithSEO />} />
            <Route path="/services/dumpster-rental" element={<DumpsterRentalPageWithSEO />} />
            <Route path="/services/residential-junk-removal" element={<Navigate to="/services/junk-removal" replace />} />
            <Route path="/services/commercial" element={<Navigate to="/services/junk-removal" replace />} />
            <Route path="/services/property-cleanout" element={<PropertyCleanoutPageWithSEO />} />
            <Route path="/services/donations-pickup" element={<Navigate to="/" replace />} />
            <Route path="/services/moving-labor" element={<MovingLaborPageWithSEO />} />
            <Route path="/services/small-local-moves" element={<SmallLocalMovesPage />} />
            <Route path="/services/mattress-disposal" element={<MattressDisposalPageWithSEO />} />
            <Route path="/booking/mattress" element={<MattressBookingPage />} />
            <Route path="/provider-signup" element={<ProviderSignupPageWithSEO />} />
            <Route path="/sign-up" element={<SignUpPageWithSEO />} />
            <Route path="/track-order" element={<TrackOrderPageWithSEO />} />
            <Route path="/in-home-estimate" element={<InHomeEstimatePageWithSEO />} />
            <Route path="/privacy" element={<PrivacyPolicyPageWithSEO />} />
            <Route path="/terms" element={<TermsOfServicePageWithSEO />} />
            <Route path="/locations/:slug" element={<CityPageRouteWrapper />} />
          </Routes>
        </Suspense>
        </main>

        <GlobalQuickActionBar />
        <GlobalFooter />
      </div>
    </Router>
  );
}

export default App;
