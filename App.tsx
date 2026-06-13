import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { Services } from './components/Services';
import { ServiceArea } from './components/ServiceArea';
import { Footer } from './components/Footer';
import { QuotePage } from './components/QuotePage';
import { ContactPage } from './components/ContactPage';
import { BookingPage } from './components/BookingPage';
import { QuickActionBar } from './components/QuickActionBar';
import { WhatWeHaul } from './components/WhatWeHaul';
import { CharityBanner } from './components/CharityBanner';
import { ProcessEditorial } from './components/ProcessEditorial';
import { JunkRemovalPage } from './components/services/JunkRemovalPage';
import { DumpsterRentalPage } from './components/services/DumpsterRentalPage';
import { PropertyCleanoutPage } from './components/services/PropertyCleanoutPage';
import { MovingLaborPage } from './components/services/MovingLaborPage';
import { ProviderSignupPage } from './components/ProviderSignupPage';
import { TrackOrderPage } from './components/TrackOrderPage';
import { InHomeEstimatePage } from './components/InHomeEstimatePage';
import { ZipCheckModal } from './components/ZipCheckModal';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { SEO, seoConfig } from './components/SEO';
import { CityPage } from './components/CityPage';
import { PageLoader } from './components/PageLoader';
import { getCityBySlug } from './lib/cityData';

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
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

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
    <>
      <SEO {...seoConfig.home} />
      <Hero 
        onGetQuote={() => navigate('/quote')} 
        onBookOnline={() => navigate('/booking')}
      />
      <TrustBadges />
      <Services />
      <CharityBanner />
      <ProcessEditorial />
      <WhatWeHaul />
      <ServiceArea onGetQuote={() => setIsZipModalOpen(true)} />
      <QuickActionBar onBookOnline={() => navigate('/booking')} />
      
      <ZipCheckModal 
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        onGetQuote={() => navigate('/quote')}
      />
    </>
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

function ProviderSignupPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.providerSignup} />
      <ProviderSignupPage />
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
      <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
        <PageLoader />
        <ScrollToTop />
        <Navbar />
        
        <main className="pt-[80px] md:pt-[120px]">
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
          <Route path="/provider-signup" element={<ProviderSignupPageWithSEO />} />
          <Route path="/track-order" element={<TrackOrderPageWithSEO />} />
          <Route path="/in-home-estimate" element={<InHomeEstimatePageWithSEO />} />
          <Route path="/privacy" element={<PrivacyPolicyPageWithSEO />} />
          <Route path="/terms" element={<TermsOfServicePageWithSEO />} />
          <Route path="/locations/:slug" element={<CityPageRouteWrapper />} />
        </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;