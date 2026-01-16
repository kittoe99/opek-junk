import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ServiceArea } from './components/ServiceArea';
import { Footer } from './components/Footer';
import { QuotePage } from './components/QuotePage';
import { ContactPage } from './components/ContactPage';
import { QuickActionBar } from './components/QuickActionBar';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quote' | 'contact'>('home');

  const handleNavigate = (view: 'home' | 'quote' | 'contact', sectionId?: string) => {
    setCurrentView(view);
    
    // If going to home and a section is requested, scroll to it after render
    if (view === 'home') {
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If going to other pages, scroll top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderView = () => {
    switch(currentView) {
      case 'quote':
        return <QuotePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <>
            <Hero onGetQuote={() => handleNavigate('quote')} />
            <Services />
            <Process onGetQuote={() => handleNavigate('quote')} />
            <ServiceArea onGetQuote={() => handleNavigate('quote')} />
            <QuickActionBar onBookOnline={() => handleNavigate('quote')} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      
      {renderView()}
      
      <Footer />
    </div>
  );
}

export default App;