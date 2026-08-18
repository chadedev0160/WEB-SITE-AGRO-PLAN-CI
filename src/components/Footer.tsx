import React from 'react';
import { PageRoute } from '../types';
import { AgroPlanLogo } from './AgroPlanLogo';

interface FooterProps {
  onNavigate: (route: PageRoute, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2D1E18] text-stone-300 pt-12 pb-8 border-t border-[#3E2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <button
              onClick={() => onNavigate('landing', 'hero')}
              className="text-left cursor-pointer focus:outline-none"
              title="AgroPlan CI"
            >
              <AgroPlanLogo size="lg" theme="light" showSubtitle={true} />
            </button>
            <p className="text-xs text-stone-300 font-medium italic">
              Des récoltes durables, un avenir meilleur.
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Solution numérique d'accompagnement des producteurs de cacao et de diversification agricole en Côte d'Ivoire.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('landing', 'hero')}
                  className="hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing', 'solution')}
                  className="hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Notre solution
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing', 'sustainability')}
                  className="hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Agriculture durable
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('landing', 'about')}
                  className="hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  À propos
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Espaces & Partenariats</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('ngo-portal')}
                  className="hover:text-emerald-300 transition-colors text-[#81C784] font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-building text-xs"></i>
                  <span>Portail ONG & Institutions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#81C784] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-envelope text-xs"></i>
                  <span>Formulaire de Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links & Location */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Réseaux & Localisation</h4>
            <p className="text-xs text-stone-400 mb-3 flex items-center gap-1.5">
              <i className="fa-solid fa-location-dot text-[#81C784]"></i>
              <span>Abidjan & Régions cacaoières, Côte d'Ivoire 🇨🇮</span>
            </p>
            <div className="flex gap-2.5 text-xs font-semibold">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#4E342E] hover:bg-[#5D4037] px-3 py-1.5 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <i className="fa-brands fa-facebook-f text-xs"></i>
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#4E342E] hover:bg-[#5D4037] px-3 py-1.5 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <i className="fa-brands fa-linkedin-in text-xs"></i>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="bg-[#2E7D32]/40 hover:bg-[#2E7D32]/60 text-[#81C784] hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <i className="fa-brands fa-whatsapp text-xs"></i>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>© 2026 AgroPlan CI — Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0 italic">Projet de transition agroécologique et durabilité cacaoyère</p>
        </div>
      </div>
    </footer>
  );
};

