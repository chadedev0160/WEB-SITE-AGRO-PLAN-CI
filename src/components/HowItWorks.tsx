import React from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      iconClass: 'fa-solid fa-user-check text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Créer son profil',
      desc: 'Saisie simple de votre Nom, Numéro de téléphone et Matricule de producteur ou coopérative.',
    },
    {
      step: 2,
      iconClass: 'fa-solid fa-tree text-[#2E7D32]',
      iconBg: 'bg-[#E8F5E9] border border-[#C8E6C9]',
      title: 'Décrire son champ',
      desc: 'Indiquer l\'âge moyen des cacaoyers, le niveau d\'ombrage perçu et la superficie approximative.',
    },
    {
      step: 3,
      iconClass: 'fa-solid fa-location-dot text-amber-700',
      iconBg: 'bg-amber-50 border border-amber-200',
      title: 'Localiser son champ',
      desc: 'Géolocalisation automatique par GPS ou sélection manuelle de votre sous-préfecture.',
    },
    {
      step: 4,
      iconClass: 'fa-solid fa-seedling text-[#2E7D32]',
      iconBg: 'bg-emerald-50 border border-emerald-200',
      title: 'Recevoir ses conseils',
      desc: 'AgroPlan CI calcule la meilleure combinaison de cultures vivrières et d\'arbres d\'ombrage.',
    },
    {
      step: 5,
      iconClass: 'fa-solid fa-calendar-check text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Suivre ses actions',
      desc: 'Retrouver et écouter ses fiches de conseils même hors ligne pendant les travaux champêtres.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Parcours Utilisateur
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Comment fonctionne AgroPlan CI ?
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            Un parcours pensé en 5 étapes simples et rapides, réalisable en moins de 3 minutes sur le terrain.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="mt-14 relative">
          {/* Connector line for desktop */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-[#D7CCC8] -translate-y-1/2 -z-0 origin-left" 
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10" staggerChildren={0.12}>
            {steps.map((item) => (
              <StaggerItem key={item.step}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-[#F9F8F6] p-5 rounded-2xl border border-stone-200/90 hover:border-[#5D4037] hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center text-base group-hover:scale-105 transition-transform`}>
                        <i className={item.iconClass}></i>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#5D4037] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        0{item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

      </div>
    </section>
  );
};
