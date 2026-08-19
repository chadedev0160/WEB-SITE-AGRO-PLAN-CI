import React, { useState, useEffect } from 'react';
import { PageRoute, PartnerAccount } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { HowItWorks } from './components/HowItWorks';
import { AppPreviewSection } from './components/AppPreviewSection';
import { AccessibilitySection } from './components/AccessibilitySection';
import { SustainabilitySection } from './components/SustainabilitySection';
import { ImpactSection } from './components/ImpactSection';
import { PartnersSection } from './components/PartnersSection';
import { AboutSection } from './components/AboutSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { ContactPage } from './components/ContactPage';
import { AppSimulator } from './components/AppSimulator';
import { NgoPortalPage } from './components/NgoPortalPage';
import { NgoDashboardApp } from './components/NgoDashboardApp';
import { DEMO_PARTNER_ACCOUNTS } from './data/partnersData';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<PageRoute>('landing');
  const [isNgoDashboardActive, setIsNgoDashboardActive] = useState(false);
  const [standaloneAccount, setStandaloneAccount] = useState<PartnerAccount>(DEMO_PARTNER_ACCOUNTS[0]);

  // Handle URL path initialization (/app, /contact, /ngo-portal, /dashboard)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/app') {
      setActiveRoute('app');
    } else if (path === '/contact') {
      setActiveRoute('contact');
    } else if (path === '/ngo-portal') {
      setActiveRoute('ngo-portal');
    } else if (path === '/dashboard') {
      setActiveRoute('dashboard');
      setIsNgoDashboardActive(true);
    } else {
      setActiveRoute('landing');
    }

    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/app') {
        setActiveRoute('app');
        setIsNgoDashboardActive(false);
      } else if (p === '/contact') {
        setActiveRoute('contact');
        setIsNgoDashboardActive(false);
      } else if (p === '/ngo-portal') {
        setActiveRoute('ngo-portal');
        setIsNgoDashboardActive(false);
      } else if (p === '/dashboard') {
        setActiveRoute('dashboard');
        setIsNgoDashboardActive(true);
      } else {
        setActiveRoute('landing');
        setIsNgoDashboardActive(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: PageRoute, sectionId?: string) => {
    setActiveRoute(route);
    if (route === 'dashboard') {
      setIsNgoDashboardActive(true);
    } else if (route !== 'ngo-portal') {
      setIsNgoDashboardActive(false);
    }

    // Update URL history state nicely
    const targetPath = route === 'landing' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    if (route === 'landing' && sectionId) {
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F5F7F2] text-[#213123] font-poppins selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
        {/* Header stays across public pages, hidden in standalone NGO dashboard */}
        {!isNgoDashboardActive && activeRoute !== 'dashboard' && (
          <Header activeRoute={activeRoute} onNavigate={handleNavigate} />
        )}

        <main className="flex-1">
          {activeRoute === 'landing' && (
            <>
              <Hero onNavigate={handleNavigate} />
              <ProblemSection />
              <SolutionSection onNavigate={handleNavigate} />
              <HowItWorks />
              <AppPreviewSection onNavigate={handleNavigate} />
              <AccessibilitySection />
              <SustainabilitySection />
              <ImpactSection />
              <PartnersSection onNavigate={handleNavigate} />
              <AboutSection />
              <CtaSection onNavigate={handleNavigate} />
            </>
          )}

          {activeRoute === 'app' && (
            <AppSimulator onNavigate={handleNavigate} />
          )}

          {activeRoute === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}

          {activeRoute === 'ngo-portal' && (
            <NgoPortalPage
              onNavigate={handleNavigate}
              onDashboardActiveChange={setIsNgoDashboardActive}
            />
          )}

          {activeRoute === 'dashboard' && (
            <NgoDashboardApp
              account={standaloneAccount}
              onLogout={() => {
                setIsNgoDashboardActive(false);
                handleNavigate('ngo-portal');
              }}
              onNavigateToPublicSite={(route) => {
                setIsNgoDashboardActive(false);
                handleNavigate(route || 'landing');
              }}
            />
          )}
        </main>

        {/* Footer stays across public pages, hidden in standalone NGO dashboard */}
        {!isNgoDashboardActive && activeRoute !== 'dashboard' && (
          <Footer onNavigate={handleNavigate} />
        )}
      </div>
    </ToastProvider>
  );
}
