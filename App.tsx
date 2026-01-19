import React, { useEffect } from 'react';
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
import { ProviderSignupPage } from './components/ProviderSignupPage';
import { OpenAITestPage } from './components/OpenAITestPage';

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
    <>
      <Hero onGetQuote={() => navigate('/quote')} />
      <Services />
      <Process onGetQuote={() => navigate('/quote')} />
      <ServiceArea onGetQuote={() => navigate('/quote')} />
      <QuickActionBar onBookOnline={() => navigate('/booking')} />
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
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/services/residential" element={<ResidentialPage />} />
          <Route path="/services/commercial" element={<CommercialPage />} />
          <Route path="/services/construction" element={<ConstructionPage />} />
          <Route path="/services/e-waste" element={<EWastePage />} />
          <Route path="/services/property-cleanout" element={<PropertyCleanoutPage />} />
          <Route path="/provider-signup" element={<ProviderSignupPage />} />
          <Route path="/test-openai" element={<OpenAITestPage />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;