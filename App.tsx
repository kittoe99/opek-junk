import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ServiceArea } from './components/ServiceArea';
import { Footer } from './components/Footer';
import { QuotePage } from './components/QuotePage';
import { ContactPage } from './components/ContactPage';
import { BookingPage } from './components/BookingPage';
import { QuickActionBar } from './components/QuickActionBar';
import { ResidentialPage } from './components/services/ResidentialPage';
import { CommercialPage } from './components/services/CommercialPage';
import { ConstructionPage } from './components/services/ConstructionPage';
import { EWastePage } from './components/services/EWastePage';
import { PropertyCleanoutPage } from './components/services/PropertyCleanoutPage';
import { DumpsterRentalPage } from './components/services/DumpsterRentalPage';
import { ProviderSignupPage } from './components/ProviderSignupPage';
import { TrackOrderPage } from './components/TrackOrderPage';
import { OpenAITestPage } from './components/OpenAITestPage';
import { ZipCheckModal } from './components/ZipCheckModal';
import { SEO, seoConfig } from './components/SEO';

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
      <Services />
      <Process onGetQuote={() => navigate('/quote')} />
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

function ResidentialPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.residential} />
      <ResidentialPage />
    </>
  );
}

function CommercialPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.commercial} />
      <CommercialPage />
    </>
  );
}

function ConstructionPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.construction} />
      <ConstructionPage />
    </>
  );
}

function EWastePageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.ewaste} />
      <EWastePage />
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

function DumpsterRentalPageWithSEO() {
  return (
    <>
      <SEO {...seoConfig.dumpsterRental} />
      <DumpsterRentalPage />
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
        <ScrollToTop />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePageWithSEO />} />
          <Route path="/contact" element={<ContactPageWithSEO />} />
          <Route path="/booking" element={<BookingPageWithSEO />} />
          <Route path="/services/residential" element={<ResidentialPageWithSEO />} />
          <Route path="/services/commercial" element={<CommercialPageWithSEO />} />
          <Route path="/services/construction" element={<ConstructionPageWithSEO />} />
          <Route path="/services/e-waste" element={<EWastePageWithSEO />} />
          <Route path="/services/property-cleanout" element={<PropertyCleanoutPageWithSEO />} />
          <Route path="/services/dumpster-rental" element={<DumpsterRentalPageWithSEO />} />
          <Route path="/provider-signup" element={<ProviderSignupPageWithSEO />} />
          <Route path="/track-order" element={<TrackOrderPageWithSEO />} />
          <Route path="/test-openai" element={<OpenAITestPage />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;