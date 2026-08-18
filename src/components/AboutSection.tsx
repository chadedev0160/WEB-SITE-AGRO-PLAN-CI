import React from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      iconClass: 'fa-solid fa-eye text-[#5D4037]',
      title: 'Observations terrain',
      desc: 'Immersion au sein des zones de production pour observer la réalité quotidienne des cacaoyers et des cultures vivrières.'
    },
    {
      iconClass: 'fa-solid fa-comments text-[#2E7D32]',
      title: 'Entretiens utilisateurs',
      desc: 'Échanges qualitatifs directs avec des producteurs, délégués de coopératives et encadreurs agricoles.'
    },
    {
      iconClass: 'fa-solid fa-magnifying-glass text-amber-700',
      title: 'Recherches documentaires',
      desc: 'Analyse des pratiques d\'agroforesterie et de diversification adaptées au climat ivoirien.'
    },
    {
      iconClass: 'fa-solid fa-pen-ruler text-[#2E7D32]',
      title: 'Démarche centrée UX/UI',
      desc: 'Conception d\'interfaces épurées avec de grandes icônes et un parcours guidé pas à pas.'
    },
    {
      iconClass: 'fa-solid fa-clipboard-check text-[#5D4037]',
      title: 'Tests utilisateurs',
      desc: 'Évaluation continue de la compréhension des écrans par des personnes à faible littératie numérique.'
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            À Propos du Projet
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Pourquoi AgroPlan CI ?
          </h2>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed">
            AgroPlan CI est un projet numérique conçu dans le cadre d'une réflexion approfondie sur les enjeux d'agriculture durable et de diversification agricole en Côte d'Ivoire.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-[#3E2723] mb-6 text-center">
            Une méthodologie rigoureuse centrée sur l'humain
          </h3>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerChildren={0.1}>
            {pillars.map((item, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 rounded-2xl bg-[#F9F8F6] border border-stone-200/90 flex items-start gap-3.5 hover:border-[#5D4037]/50 transition-colors h-full group"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-sm">
                    <i className={item.iconClass}></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 font-medium">
              Conçu pour valoriser les filières agricoles ivoiriennes et accélérer l'adoption de l'agroforesterie durable.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
