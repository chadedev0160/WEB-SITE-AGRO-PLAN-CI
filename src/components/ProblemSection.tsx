import React from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      iconClass: 'fa-solid fa-cloud-sun-rain text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Changements climatiques',
      description: 'Les variations du climat, les périodes de sécheresse et les perturbations des pluies affectent directement les récoltes de cacao et le niveau d\'ombrage.',
      color: 'bg-white border-stone-200/90 hover:border-[#5D4037]/40',
    },
    {
      iconClass: 'fa-solid fa-layer-group text-[#2E7D32]',
      iconBg: 'bg-[#E8F5E9] border border-[#C8E6C9]',
      title: 'Espace agricole limité',
      description: 'La surface disponible sur les parcelles doit être optimisée pour associer efficacement le cacao et les cultures vivrières sans déboiser.',
      color: 'bg-white border-stone-200/90 hover:border-[#2E7D32]/40',
    },
    {
      iconClass: 'fa-solid fa-wheat-awn text-amber-700',
      iconBg: 'bg-amber-50 border border-amber-200',
      title: 'Diversification alimentaire',
      description: 'Renforcer la production de manioc, banane plantain et taro permet d\'assurer la sécurité alimentaire du ménage et de diversifier les revenus.',
      color: 'bg-white border-stone-200/90 hover:border-amber-400/50',
    },
    {
      iconClass: 'fa-solid fa-seedling text-[#2E7D32]',
      iconBg: 'bg-emerald-50 border border-emerald-200',
      title: 'Pratiques agroécologiques',
      description: 'Les producteurs ont besoin de recommandations claires et adaptées pour adopter progressivement une gestion durable et fertile de leur sol.',
      color: 'bg-white border-stone-200/90 hover:border-[#2E7D32]/40',
    },
  ];

  return (
    <section id="problem" className="py-16 md:py-24 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Constat du terrain
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Les producteurs de cacao font face à de nouveaux défis
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            Pour pérenniser l'agriculture en Côte d'Ivoire, les producteurs doivent surmonter plusieurs contraintes environnementales et économiques.
          </p>
        </ScrollReveal>

        <StaggerContainer className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerChildren={0.12}>
          {problems.map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border ${item.color} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform`}>
                    <i className={item.iconClass}></i>
                  </div>
                  <h3 className="text-lg font-bold text-[#2D2421] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {item.description}
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
