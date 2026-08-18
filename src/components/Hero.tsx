import React from 'react';
import { PageRoute } from '../types';
import { motion } from 'motion/react';

interface HeroProps {
  onNavigate: (route: PageRoute, sectionId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden relative">
      {/* Background soft natural radial glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#EFEBE9] border border-[#D7CCC8] text-[#5D4037] px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide"
            >
              <i className="fa-solid fa-leaf text-[#2E7D32]"></i>
              <span>Agriculture durable & Agroforesterie en Côte d'Ivoire</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#3E2723] leading-[1.18] tracking-tight"
            >
              Mieux planifier aujourd'hui pour <span className="text-[#2E7D32] underline decoration-[#8D6E63] decoration-wavy underline-offset-4">récolter durablement</span> demain.
            </motion.h1>

            {/* Body Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed"
            >
              AgroPlan CI accompagne les producteurs de cacao dans la gestion de leur parcelle et la diversification de leurs cultures grâce à des recommandations simples, visuelles et accessibles.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                onClick={() => onNavigate('ngo-portal')}
                id="hero-cta-ngo-primary"
                className="inline-flex items-center justify-center gap-2.5 bg-[#5D4037] text-white px-6 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#5D4037]/25 hover:bg-[#4E342E] hover:shadow-xl active:scale-[0.99] transition-all group cursor-pointer"
              >
                <i className="fa-solid fa-building-ngo"></i>
                <span>Accéder à l'Espace Partenaires & ONG</span>
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </button>

              <button
                onClick={() => onNavigate('landing', 'solution')}
                id="hero-cta-solution"
                className="inline-flex items-center justify-center gap-2 bg-white text-stone-800 border border-stone-300 hover:border-[#2E7D32] hover:text-[#2E7D32] px-5 py-3.5 rounded-xl font-semibold text-base shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <i className="fa-solid fa-compass text-[#2E7D32]"></i>
                <span>Découvrir notre démarche</span>
              </button>
            </motion.div>

            {/* Local Context Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-4 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-stone-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EFEBE9] flex items-center justify-center text-[#5D4037]">
                  <i className="fa-solid fa-volume-high text-xs"></i>
                </div>
                <span className="font-medium text-stone-700">Conseils Audio Vocaux</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                  <i className="fa-solid fa-tree text-xs"></i>
                </div>
                <span className="font-medium text-stone-700">Diversification Cacao & Vivriers</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                  <i className="fa-solid fa-earth-africa text-xs"></i>
                </div>
                <span className="font-medium text-stone-700">100% Adapté à la CI</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 relative"
          >
            {/* Image Frame with decorative border */}
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group">
              <img
                src="/src/assets/images/cocoa_farmer_hero_1786575905384.jpg"
                alt="Producteur de cacao ivoirien dans sa plantation avec smartphone AgroPlan CI"
                className="w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Floating App Badge Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-white/80 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-[#5D4037] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <i className="fa-solid fa-tree text-[#81C784]"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3E2723]">AgroPlan CI</p>
                  <p className="text-[11px] text-stone-500 font-medium">Parcelle Soubré • 2.5 Ha</p>
                </div>
              </motion.div>

              {/* Floating Crop Recommendation Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-stone-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EFEBE9] text-[#5D4037] flex items-center justify-center text-lg font-bold border border-[#D7CCC8]">
                    <i className="fa-solid fa-seedling text-[#2E7D32]"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">Conseil de diversification</p>
                    <p className="text-[11px] text-[#2E7D32] font-semibold">Cacao + Banane plantain + Taro</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('landing', 'solution')}
                  className="bg-[#2E7D32] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#236327] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Détail</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </motion.div>
            </div>

            {/* Decorative background accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FBC02D]/30 rounded-2xl -z-10 rotate-12 blur-sm" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
