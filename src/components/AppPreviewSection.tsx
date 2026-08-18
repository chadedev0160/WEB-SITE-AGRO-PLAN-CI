import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';

interface AppPreviewProps {
  onNavigate: (route: PageRoute) => void;
}

export const AppPreviewSection: React.FC<AppPreviewProps> = ({ onNavigate }) => {
  const [selectedScreen, setSelectedScreen] = useState<number>(1);

  const screens = [
    {
      id: 0,
      name: 'Connexion',
      iconClass: 'fa-solid fa-lock',
      title: 'Connexion sécurisée',
      desc: 'Identification rapide par numéro de téléphone et code PIN à 4 chiffres, sans mot de passe complexe.',
      screenUI: (
        <div className="space-y-4 pt-2">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#5D4037] text-white flex items-center justify-center text-xl mx-auto shadow-md">
              <i className="fa-solid fa-tree text-[#81C784]"></i>
            </div>
            <p className="text-sm font-extrabold text-[#3E2723] mt-2">AgroPlan CI</p>
            <p className="text-[11px] text-stone-500">Connexion Producteur</p>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Téléphone</label>
              <div className="bg-white border border-stone-300 rounded-xl p-2 text-xs font-semibold text-stone-800">
                07 08 09 10 11
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Code PIN (4 chiffres)</label>
              <div className="flex justify-center gap-2 pt-1">
                {['•', '•', '•', '•'].map((dot, i) => (
                  <div key={i} className="w-8 h-9 rounded-lg bg-[#EFEBE9] border border-[#D7CCC8] flex items-center justify-center font-bold text-lg text-[#5D4037]">
                    {dot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full bg-[#5D4037] hover:bg-[#4E342E] text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-colors">
            Se connecter
          </button>
        </div>
      )
    },
    {
      id: 1,
      name: 'Accueil',
      iconClass: 'fa-solid fa-house',
      title: 'Tableau de bord épuré',
      desc: 'Vue synthétique sur le bilan de la parcelle, le conseil du jour et l\'écoute audio en Baoulé, Dioula, Bété ou Français.',
      screenUI: (
        <div className="space-y-3">
          {/* Welcome card */}
          <div className="bg-[#5D4037] text-white p-3.5 rounded-2xl shadow-sm">
            <p className="text-[10px] text-[#D7CCC8] uppercase font-semibold">Bonjour, Koffi Kouadio</p>
            <p className="text-sm font-bold mt-0.5">Champ de Soubré (2.5 Ha)</p>
            <div className="mt-2 bg-black/20 backdrop-blur-xs p-2 rounded-xl flex items-center justify-between border border-white/10">
              <span className="text-xs font-medium text-stone-200">Santé Parcelle</span>
              <span className="text-xs font-extrabold bg-[#81C784] text-stone-900 px-2 py-0.5 rounded-md">78% Bon</span>
            </div>
          </div>

          {/* Audio advice box */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs shadow-xs">
                <i className="fa-solid fa-volume-high"></i>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-amber-950">Conseil audio du jour</p>
                <p className="text-[10px] text-amber-800">Planter des bananiers pour l'ombre</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-1 rounded-md font-bold">Écouter</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: 'Mon champ',
      iconClass: 'fa-solid fa-tree',
      title: 'Description simplifiée du champ',
      desc: 'Déclaration visuelle de l\'état de la plantation : cacaoyers anciens ou jeunes, niveau d\'ombrage et source d\'eau.',
      screenUI: (
        <div className="space-y-2.5">
          <div className="bg-[#EFEBE9] p-2.5 rounded-xl border border-[#D7CCC8]">
            <p className="text-[10px] font-bold text-[#5D4037] uppercase">Variété & Âge</p>
            <p className="text-xs font-extrabold text-[#3E2723]">Cacao Tout-Venant (20 ans)</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-stone-200">
            <p className="text-[10px] font-bold text-stone-500 uppercase">Ombrage Observé</p>
            <div className="flex gap-1.5 mt-1">
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-md">Faible</span>
              <span className="text-[10px] bg-[#2E7D32] text-white px-2 py-1 rounded-md font-bold">Moyen</span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded-md">Dense</span>
            </div>
          </div>
          <div className="bg-[#E8F5E9] p-2.5 rounded-xl border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] flex items-center gap-2">
            <i className="fa-solid fa-location-dot"></i>
            <span>Localisation GPS : Soubré, Nawa</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: 'Taille de parcelle',
      iconClass: 'fa-solid fa-ruler-combined',
      title: 'Saisie intuitive de superficie',
      desc: 'Saisie de la superficie en hectares ou quarterons avec gros boutons tactiles adaptés.',
      screenUI: (
        <div className="space-y-3 pt-2 text-center">
          <p className="text-xs font-bold text-stone-700">Quelle est la taille de votre champ ?</p>
          <div className="text-3xl font-extrabold text-[#2E7D32] bg-[#E8F5E9] py-3 rounded-2xl border border-[#C8E6C9]">
            2.5 Hectares
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-stone-200 py-2 rounded-xl text-xs font-bold text-stone-800">- 0.5</button>
            <button className="bg-[#2E7D32] text-white py-2 rounded-xl text-xs font-bold">+ 0.5</button>
            <button className="bg-stone-200 py-2 rounded-xl text-xs font-bold text-stone-800">+ 1.0</button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      name: 'Résultat',
      iconClass: 'fa-solid fa-circle-check',
      title: 'Diagnostic clair & visuel',
      desc: 'Compte-rendu graphique sans jargon technique : taux d\'ombrage nécessaire et potentiel de diversification.',
      screenUI: (
        <div className="space-y-2.5">
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-xl text-left">
            <span className="text-[10px] font-bold uppercase text-[#2E7D32]">Diagnostic Parcelle</span>
            <p className="text-xs font-extrabold text-[#1B5E20] mt-0.5">Parcelle propice à la diversification</p>
            <p className="text-[10px] text-stone-600 mt-1">
              Association recommandée : Banane plantain en ombrage intermédiaire + Manioc en bordures.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs font-bold text-amber-900 flex justify-between items-center">
            <span>Besoin en arbres d'ombrage</span>
            <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-bold">+20 Akpi / Ha</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      name: 'Conseils',
      iconClass: 'fa-solid fa-book-open',
      title: 'Fiches conseils pratiques',
      desc: 'Guides audio et visuels étape par étape pour planter, tailler et récolter durablement.',
      screenUI: (
        <div className="space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-left shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
                <i className="fa-solid fa-leaf text-[#2E7D32]"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Banane Plantain</p>
                <p className="text-[10px] text-stone-500">Planter tous les 3 mètres</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-left shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFEBE9] text-[#5D4037] flex items-center justify-center text-xs">
                <i className="fa-solid fa-tree"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Arbres d'Ombrage Akpi</p>
                <p className="text-[10px] text-stone-500">Densité : 18 à 25 pieds/ha</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="app-preview" className="py-16 md:py-24 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Interface Mobile
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            Une application pensée pour être comprise au premier regard.
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            De grandes icônes, des informations simples et une navigation fluide adaptée aux utilisateurs ruraux.
          </p>
        </ScrollReveal>

        {/* Screen Switcher Tabs */}
        <ScrollReveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-2">
          {screens.map((scr) => (
            <button
              key={scr.id}
              onClick={() => setSelectedScreen(scr.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedScreen === scr.id
                  ? 'bg-[#5D4037] text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <i className={scr.iconClass}></i>
              <span>{scr.name}</span>
            </button>
          ))}
        </ScrollReveal>

        {/* Selected Screen Showcase */}
        <ScrollReveal delay={0.2} className="mt-10 bg-[#F9F8F6] rounded-3xl p-6 sm:p-10 border border-stone-200/90 grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Phone Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[280px] bg-stone-900 rounded-[38px] p-3 shadow-2xl border-4 border-stone-800">
              {/* Top Notch */}
              <div className="w-20 h-4 bg-stone-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-1 bg-stone-700 rounded-full" />
              </div>

              {/* Dynamic Screen Area */}
              <div className="bg-[#F9F8F6] rounded-[28px] p-4 text-stone-900 min-h-[380px] flex flex-col justify-between border border-stone-200">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                    <span className="text-[11px] font-bold text-[#3E2723]">{screens[selectedScreen].name}</span>
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedScreen}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {screens[selectedScreen].screenUI}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-200 flex justify-around text-[10px] text-stone-500 font-semibold">
                  <span className="text-[#5D4037] font-bold">AgroPlan CI</span>
                  <span>100% Hors Ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description side */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="text-xs font-bold text-[#5D4037] uppercase tracking-wide bg-[#EFEBE9] border border-[#D7CCC8] px-3 py-1 rounded-full">
              Écran #{selectedScreen + 1} — {screens[selectedScreen].name}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedScreen}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723]">
                  {screens[selectedScreen].title}
                </h3>
                <p className="text-stone-600 text-base leading-relaxed">
                  {screens[selectedScreen].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('ngo-portal')}
                className="inline-flex items-center gap-2 bg-[#5D4037] hover:bg-[#4E342E] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <i className="fa-solid fa-building-ngo text-sm"></i>
                <span>Déployer pour vos coopératives</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>

        </ScrollReveal>

      </div>
    </section>
  );
};
