import React from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const ImpactSection: React.FC = () => {
  const dimensions = [
    {
      iconClass: 'fa-solid fa-leaf text-[#2E7D32]',
      iconBg: 'bg-[#E8F5E9] border border-[#C8E6C9]',
      tag: 'ENVIRONNEMENT',
      title: 'Pratiques durables & biodiversité',
      desc: 'Encourager la conservation des sols, le maintien des arbres d\'ombrage et la préservation du couvert forestier au sein des vergers de cacao.',
      badge: 'Potentiel d\'Impact',
    },
    {
      iconClass: 'fa-solid fa-users text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      tag: 'PRODUCTEURS',
      title: 'Inclusion & autonomisation',
      desc: 'Faciliter l\'accès direct aux recommandations agricoles adaptées aux producteurs, y compris ceux ayant une faible maîtrise de l\'écrit grâce aux formats vocaux.',
      badge: 'Notre Ambition',
    },
    {
      iconClass: 'fa-solid fa-earth-africa text-amber-700',
      iconBg: 'bg-amber-50 border border-amber-200',
      tag: 'TERRITOIRES',
      title: 'Résilience agricole régionale',
      desc: 'Contribuer au renforcement de la sécurité alimentaire locale et à la durabilité de la filière cacao en Côte d\'Ivoire.',
      badge: 'Notre Objectif',
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Vision & Impact
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Notre ambition pour l'agriculture ivoirienne
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            Placer le producteur au cœur de la transition agricole vers un modèle plus résilient et diversifié.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8" staggerChildren={0.15}>
          {dimensions.map((dim, idx) => (
            <StaggerItem key={idx}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${dim.iconBg} flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}>
                      <i className={dim.iconClass}></i>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8] px-3 py-1 rounded-full">
                      {dim.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-extrabold text-[#2E7D32] tracking-wider uppercase block mb-1">
                    {dim.tag}
                  </span>

                  <h3 className="text-xl font-bold text-[#2D2421] mb-3">
                    {dim.title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {dim.desc}
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
