import React from 'react';
import { PageRoute } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { motion } from 'motion/react';

interface CtaProps {
  onNavigate: (route: PageRoute) => void;
}

export const CtaSection: React.FC<CtaProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 md:py-20 bg-[#5D4037] text-white relative overflow-hidden">
      {/* Background soft glow patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <ScrollReveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        <span className="inline-flex items-center gap-2 bg-black/20 text-[#D7CCC8] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/10">
          <i className="fa-solid fa-seedling text-[#81C784]"></i>
          <span>Solution AgriTech Côte d'Ivoire</span>
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto text-white">
          Prêt à découvrir une nouvelle façon d'accompagner les producteurs ?
        </h2>

        <p className="text-[#EFEBE9] text-base md:text-lg max-w-2xl mx-auto font-normal">
          Explorez l'application AgroPlan CI et découvrez nos recommandations de diversification agricole simples et inclusives.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('ngo-portal')}
            id="final-cta-ngo-btn"
            className="inline-flex items-center justify-center gap-2.5 bg-[#2E7D32] hover:bg-[#256828] text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <i className="fa-solid fa-building-ngo text-sm"></i>
            <span>Rejoindre l'Espace ONG & Partenaires</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('contact')}
            id="final-cta-contact-btn"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
          >
            <i className="fa-regular fa-envelope text-sm"></i>
            <span>Nous contacter</span>
          </motion.button>
        </div>
      </ScrollReveal>
    </section>
  );
};
