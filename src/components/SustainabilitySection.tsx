import React from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const SustainabilitySection: React.FC = () => {
  const cards = [
    {
      iconClass: 'fa-solid fa-tree text-[#2E7D32]',
      iconBg: 'bg-[#E8F5E9] border border-[#C8E6C9]',
      title: 'Agroforesterie',
      desc: 'Favoriser une meilleure coexistence entre arbres forestiers d\'ombrage (Akpi, Framiré, Iroko) et cacaoyers lorsque les conditions agricoles le permettent.',
      bg: 'bg-white border-stone-200/90 hover:border-[#2E7D32]/40'
    },
    {
      iconClass: 'fa-solid fa-wheat-awn text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Diversification des cultures',
      desc: 'Encourager l\'association raisonnée du cacao avec le manioc, la banane plantain et le taro pour diversifier l\'alimentation et les sources de revenus.',
      bg: 'bg-white border-stone-200/90 hover:border-[#5D4037]/40'
    },
    {
      iconClass: 'fa-solid fa-droplet text-blue-700',
      iconBg: 'bg-blue-50 border border-blue-200',
      title: 'Gestion des ressources',
      desc: 'Promouvoir une gestion responsable de l\'eau de pluie et préserver le microclimat de la parcelle pendant les saisons sèches.',
      bg: 'bg-white border-stone-200/90 hover:border-blue-300'
    },
    {
      iconClass: 'fa-solid fa-seedling text-[#2E7D32]',
      iconBg: 'bg-emerald-50 border border-emerald-200',
      title: 'Préservation des sols',
      desc: 'Sensibiliser au paillage organique avec les résidus de cabosses et feuilles pour protéger le sol du dessèchement et enrichir la terre.',
      bg: 'bg-white border-stone-200/90 hover:border-[#2E7D32]/40'
    }
  ];

  return (
    <section id="sustainability" className="py-16 md:py-24 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Démarche Écologique
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Cultiver autrement, préserver demain.
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            AgroPlan CI s'inscrit dans une démarche globale d'agriculture durable adaptée au contexte cacaoier ivoirien.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerChildren={0.12}>
          {cards.map((card, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border ${card.bg} shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full group`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform`}>
                    <i className={card.iconClass}></i>
                  </div>
                  <h3 className="text-lg font-bold text-[#2D2421] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
