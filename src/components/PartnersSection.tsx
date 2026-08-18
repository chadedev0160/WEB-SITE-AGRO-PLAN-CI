import React from 'react';
import { PageRoute } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { motion } from 'motion/react';

interface PartnersProps {
  onNavigate: (route: PageRoute) => void;
}

export const PartnersSection: React.FC<PartnersProps> = ({ onNavigate }) => {
  return (
    <section id="partners" className="py-16 md:py-24 bg-white border-y border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <ScrollReveal direction="left" className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
              Partenariats & Écosystème
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
              Construisons une agriculture plus durable ensemble.
            </h2>

            <p className="text-stone-600 text-base md:text-lg leading-relaxed">
              AgroPlan CI a vocation à être déployé en synergie avec les coopératives agricoles, les organisations de la filière cacao, les ONG environnementales, les programmes de développement et les acteurs de l'innovation AgriTech.
            </p>

            {/* Target Entities Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <motion.div whileHover={{ y: -4 }} className="p-4 bg-[#F9F8F6] rounded-xl border border-stone-200 flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-users text-sm"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Coopératives Agricoles</h4>
                  <p className="text-xs text-stone-600">Accompagnement groupé des délégués et producteurs membres.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="p-4 bg-[#F9F8F6] rounded-xl border border-stone-200 flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-building-ngo text-sm"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">ONG & Programmes</h4>
                  <p className="text-xs text-stone-600">Projets de durabilité, agroforesterie et autonomisation des ménages.</p>
                </div>
              </motion.div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigate('ngo-portal')}
                className="inline-flex items-center justify-center gap-2 bg-[#5D4037] hover:bg-[#4E342E] text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-building-ngo text-sm"></i>
                <span>Portail Inscription ONG & Institutions</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 bg-white text-stone-800 border border-stone-300 hover:border-[#5D4037] hover:text-[#5D4037] px-5 py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer"
              >
                <i className="fa-regular fa-envelope text-sm"></i>
                <span>Nous contacter</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right Image */}
          <ScrollReveal direction="right" className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 group">
              <img
                src="/src/assets/images/agroforestry_coop_1786575919814.jpg"
                alt="Rencontre d'une coopérative agricole de cacao en Côte d'Ivoire"
                className="w-full h-[360px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-white/80">
                <p className="text-xs font-bold text-[#3E2723]">Collaboration Terrain</p>
                <p className="text-[11px] text-stone-600">Producteurs + Coopératives + Innovation Numérique</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};
