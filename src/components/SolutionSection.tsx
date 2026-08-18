import React, { useState } from 'react';
import { PageRoute } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';

interface SolutionProps {
  onNavigate: (route: PageRoute) => void;
}

export const SolutionSection: React.FC<SolutionProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Comprendre sa parcelle',
      desc: 'Le producteur renseigne quelques informations simples : âge des cacaoyers, niveau d\'ombrage et superficie estimée.',
      iconClass: 'fa-solid fa-map-location-dot',
      phoneScreen: {
        title: 'Ma Parcelle',
        subtitle: 'Saisie simplifiée',
        content: (
          <div className="space-y-3">
            <div className="bg-[#EFEBE9] p-2.5 rounded-xl border border-[#D7CCC8]">
              <span className="text-[10px] text-[#5D4037] font-bold uppercase">Âge des arbres</span>
              <p className="text-sm font-bold text-[#3E2723]">Cacaoyers de 18 ans</p>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-800 font-bold uppercase">Ombrage actuel</span>
              <p className="text-sm font-bold text-amber-950">Faible (Soleil direct)</p>
            </div>
            <div className="bg-[#E8F5E9] p-2.5 rounded-xl border border-[#C8E6C9]">
              <span className="text-[10px] text-[#2E7D32] font-bold uppercase">Superficie</span>
              <p className="text-sm font-bold text-[#1B5E20]">2.5 Hectares (Soubré)</p>
            </div>
          </div>
        )
      }
    },
    {
      num: '02',
      title: 'Analyser & diagnostiquer',
      desc: 'AgroPlan CI analyse automatiquement le niveau d\'ombrage, la santé du sol et la pertinence d\'association avec des cultures vivrières.',
      iconClass: 'fa-solid fa-chart-pie',
      phoneScreen: {
        title: 'Analyse Automatique',
        subtitle: 'Bilan de la parcelle',
        content: (
          <div className="space-y-3">
            <div className="bg-[#E8F5E9] p-3 rounded-xl border border-[#C8E6C9] flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-600 font-medium">Santé Globale</span>
                <p className="text-base font-extrabold text-[#2E7D32]">78 / 100</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center text-sm">
                <i className="fa-solid fa-seedling"></i>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                <span>Taux d'Ombrage</span>
                <span>25% (Besoin +15%)</span>
              </div>
              <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-[#5D4037] rounded-full" />
              </div>
            </div>
          </div>
        )
      }
    },
    {
      num: '03',
      title: 'Recevoir des recommandations',
      desc: 'Le producteur obtient une liste claire de cultures et d\'arbres d\'ombrage recommandés (banane plantain, manioc, taro, Akpi) avec audio vocal disponible.',
      iconClass: 'fa-solid fa-wand-magic-sparkles',
      phoneScreen: {
        title: 'Recommandations',
        subtitle: 'Cultures & Ombrage',
        content: (
          <div className="space-y-2">
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm">
                <i className="fa-solid fa-leaf text-[#2E7D32]"></i>
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-bold text-stone-900">Banane Plantain</p>
                <p className="text-[10px] text-stone-500">Ombrage temporaire + Revenus</p>
              </div>
              <i className="fa-solid fa-volume-high text-xs text-[#5D4037]"></i>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EFEBE9] text-[#5D4037] flex items-center justify-center text-sm">
                <i className="fa-solid fa-tree text-[#5D4037]"></i>
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-bold text-stone-900">Framiré & Akpi</p>
                <p className="text-[10px] text-stone-500">Ombrage permanent & fertilité</p>
              </div>
              <i className="fa-solid fa-volume-high text-xs text-[#5D4037]"></i>
            </div>
          </div>
        )
      }
    },
    {
      num: '04',
      title: 'Suivre ses actions terrain',
      desc: 'Le producteur consulte à tout moment son calendrier de travail agricole et ses conseils enregistrés en mode hors connexion.',
      iconClass: 'fa-solid fa-calendar-check',
      phoneScreen: {
        title: 'Suivi Agricole',
        subtitle: 'Prochaines étapes',
        content: (
          <div className="space-y-2">
            <div className="p-2 bg-[#E8F5E9] rounded-lg border border-[#C8E6C9] flex items-center gap-2">
              <i className="fa-solid fa-check text-xs text-[#2E7D32]"></i>
              <span className="text-xs font-semibold text-stone-800">Planter 25 rejetons de banane</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-stone-400" />
              <span className="text-xs text-stone-600">Paillage au pied des cacaoyers</span>
            </div>
          </div>
        )
      }
    }
  ];

  return (
    <section id="solution" className="py-16 md:py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Notre Approche
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Une solution pensée pour le terrain
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            AgroPlan CI transforme les informations de la parcelle en recommandations simples et compréhensibles par tous.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#5D4037] shadow-md ring-2 ring-[#5D4037]/20'
                      : 'bg-white/70 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#5D4037] text-white shadow-sm'
                          : 'bg-[#EFEBE9] text-[#5D4037]'
                      }`}
                    >
                      <i className={step.iconClass}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-900">
                          {step.title}
                        </h3>
                        <i
                          className={`fa-solid fa-chevron-right text-xs transition-transform ${
                            isSelected ? 'text-[#5D4037] translate-x-1' : 'text-stone-400'
                          }`}
                        />
                      </div>
                      <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <ScrollReveal delay={0.3} className="pt-2">
              <button
                onClick={() => onNavigate('ngo-portal')}
                className="inline-flex items-center gap-2 bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-building-ngo text-sm"></i>
                <span>Accéder au Portail ONG & Partenaires</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </ScrollReveal>
          </div>

          {/* Interactive Phone Frame Visual */}
          <ScrollReveal direction="right" duration={0.6} className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-xs bg-stone-900 rounded-[36px] p-3 shadow-2xl border-4 border-stone-800 relative">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-stone-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-stone-700 rounded-full" />
              </div>

              {/* Screen Area */}
              <div className="bg-[#F9F8F6] rounded-[28px] p-4 text-stone-900 min-h-[360px] flex flex-col justify-between border border-stone-200">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#5D4037] text-white flex items-center justify-center text-[10px] font-bold">
                        <i className="fa-solid fa-leaf text-[9px] text-[#81C784]"></i>
                      </div>
                      <span className="text-xs font-bold text-stone-800">AgroPlan CI</span>
                    </div>
                    <span className="text-[10px] bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8] px-2 py-0.5 rounded-full font-bold">
                      {steps[activeStep].num}
                    </span>
                  </div>

                  {/* Dynamic Screen Header */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3"
                    >
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        {steps[activeStep].phoneScreen.subtitle}
                      </h4>
                      <p className="text-base font-extrabold text-[#3E2723]">
                        {steps[activeStep].phoneScreen.title}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dynamic Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    >
                      {steps[activeStep].phoneScreen.content}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom App Navigation Bar simulation */}
                <div className="mt-4 pt-2 border-t border-stone-200 grid grid-cols-3 text-center text-[10px] font-semibold text-stone-500">
                  <div className="text-[#5D4037] font-bold">Accueil</div>
                  <div>Mon Champ</div>
                  <div className="text-[#2E7D32]">Conseils</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};
