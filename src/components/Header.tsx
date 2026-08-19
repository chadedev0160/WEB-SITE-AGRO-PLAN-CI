import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { AgroPlanLogo } from './AgroPlanLogo';

interface HeaderProps {
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute, sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main navigation items (compact, organized and distinct)
  const navItems = [
    { label: 'Accueil', route: 'landing' as PageRoute, sectionId: 'hero' },
    { label: 'Solution', route: 'landing' as PageRoute, sectionId: 'solution' },
    { label: 'Fonctionnement', route: 'landing' as PageRoute, sectionId: 'how-it-works' },
    { label: 'Durabilité', route: 'landing' as PageRoute, sectionId: 'sustainability' },
    { label: 'Impact', route: 'landing' as PageRoute, sectionId: 'impact' },
    { label: 'À propos', route: 'landing' as PageRoute, sectionId: 'about' },
  ];

  const handleNavigateItem = (route: PageRoute, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(route, sectionId);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-2.5 border-b border-stone-200'
          : 'bg-[#F9F8F6]/95 backdrop-blur-xs py-3 border-b border-stone-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* ================================================================= */}
          {/* LOGO DE MARQUE OFFICIEL AGROPLAN CI                               */}
          {/* ================================================================= */}
          <button
            onClick={() => handleNavigateItem('landing', 'hero')}
            className="flex items-center text-left group focus:outline-none cursor-pointer shrink-0 py-0.5"
            id="brand-logo-btn"
            title="AgroPlan CI - Accueil"
          >
            <AgroPlanLogo size="md" showSubtitle={true} />
          </button>

          {/* ================================================================= */}
          {/* NAVIGATION PRINCIPALE DESKTOP                                     */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#EFEBE9]/70 p-1 rounded-full border border-[#D7CCC8]/80">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigateItem(item.route, item.sectionId)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeRoute === 'landing' && item.sectionId === 'hero' && !isScrolled
                    ? 'bg-[#5D4037] text-white shadow-xs'
                    : 'text-stone-700 hover:text-[#5D4037] hover:bg-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* ================================================================= */}
          {/* ACTIONS RAPIDES : CONTACT & ESPACE ONG                            */}
          {/* ================================================================= */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            
            {/* Bouton Contact */}
            <button
              onClick={() => handleNavigateItem('contact')}
              id="header-contact-btn"
              className={`text-xs font-bold px-3.5 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeRoute === 'contact'
                  ? 'bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8]'
                  : 'text-stone-700 hover:text-[#5D4037] hover:bg-white'
              }`}
            >
              <i className="fa-solid fa-phone text-xs text-[#5D4037]"></i>
              <span>Contact</span>
            </button>

            {/* Bouton Espace ONG & Institutions */}
            <button
              onClick={() => handleNavigateItem('ngo-portal')}
              id="header-ngo-portal-btn"
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 border cursor-pointer ${
                activeRoute === 'ngo-portal'
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
              }`}
            >
              <i className="fa-solid fa-building-ngo text-xs text-[#2E7D32]"></i>
              <span>Espace ONG</span>
            </button>

          </div>

          {/* ================================================================= */}
          {/* MOBILE TOGGLE                                                     */}
          {/* ================================================================= */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Ouvrir le menu"
              id="mobile-menu-toggle"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* TIROIR DE NAVIGATION MOBILE                                           */}
      {/* ===================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
              Navigation
            </p>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigateItem(item.route, item.sectionId)}
                className="w-full text-left text-xs font-bold text-stone-700 py-2.5 px-3 rounded-xl hover:bg-[#E8F5E9] hover:text-[#2E7D32] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{item.label}</span>
                <i className="fa-solid fa-chevron-right text-[10px] text-stone-400"></i>
              </button>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 space-y-2">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
              Espaces & Services
            </p>

            <button
              onClick={() => handleNavigateItem('ngo-portal')}
              className={`w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-between border cursor-pointer ${
                activeRoute === 'ngo-portal'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                  : 'bg-stone-50 text-stone-800 border-stone-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-building-ngo text-sm text-[#2E7D32]"></i>
                <span>Portail Partenaire ONG & Inscription</span>
              </span>
              <i className="fa-solid fa-chevron-right text-xs text-stone-400"></i>
            </button>

            <button
              onClick={() => handleNavigateItem('contact')}
              className="w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl bg-stone-50 text-stone-700 hover:bg-stone-100 flex items-center justify-between cursor-pointer border border-stone-200"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-xs text-stone-500"></i>
                <span>Formulaire de Contact & Assistance</span>
              </span>
              <i className="fa-solid fa-chevron-right text-[10px] text-stone-400"></i>
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
