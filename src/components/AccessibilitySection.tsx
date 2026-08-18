import React, { useState } from 'react';
import { speakText, stopSpeaking } from '../utils/speechUtils';
import { LocalLanguage } from '../types';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollReveal';
import { motion } from 'motion/react';

export const AccessibilitySection: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LocalLanguage>('fr');

  const demoPhrases: Record<LocalLanguage, { title: string; text: string; langName: string }> = {
    fr: {
      title: 'Français (Clair & ralenti)',
      langName: 'Français',
      text: "Pour protéger vos jeunes cacaoyers de la chaleur, plantez des bananiers plantains entre les rangs. Ils apportent de l'ombre rapide et de la nourriture pour votre ménage."
    },
    baoule: {
      title: 'Baoulé (Traduction vocale)',
      langName: 'Baoulé',
      text: "N'san bue man kakawo ba fin, tua n'gwaza banan ba man kakawo lie gbo. I man uningue, i man aliɛ n'go."
    },
    dioula: {
      title: 'Dioula (Traduction vocale)',
      langName: 'Dioula',
      text: "Ka cacaodenw lakana tile la, plantain baranw turu cacaoforow cɛla. O bɛ sumo dya ni balo di sow ma."
    },
    bete: {
      title: 'Bété (Traduction vocale)',
      langName: 'Bété',
      text: "Kô cocoa gbouo glou, zô banane glou legbe cocoa kô. Ô kpa glou, ô kpa lili."
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      speakText(
        demoPhrases[selectedLanguage].text,
        selectedLanguage === 'fr' ? 'fr-FR' : 'fr-FR',
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const principles = [
    {
      iconClass: 'fa-solid fa-volume-high text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Accompagnement Audio',
      desc: 'Toutes les recommandations principales peuvent être écrites et écoutées vocalement pour surmonter les barrières de la lecture.',
      badge: 'Bouton Audio Démo',
    },
    {
      iconClass: 'fa-solid fa-mobile-screen-button text-[#2E7D32]',
      iconBg: 'bg-[#E8F5E9] border border-[#C8E6C9]',
      title: 'Interface ultra simple',
      desc: 'Peu d\'actions par écran, des étapes guidées et aucun jargon technique complexe.',
      badge: 'Compréhension immédiate',
    },
    {
      iconClass: 'fa-solid fa-tower-broadcast text-amber-700',
      iconBg: 'bg-amber-50 border border-amber-200',
      title: 'Mode hors connexion',
      desc: 'L\'application conserve vos données et recommandations sur votre téléphone, même en zone rurale sans réseau Internet.',
      badge: '100% Fonctionnel en forêt',
    },
    {
      iconClass: 'fa-solid fa-hand-pointer text-[#5D4037]',
      iconBg: 'bg-[#EFEBE9] border border-[#D7CCC8]',
      title: 'Grandes zones tactiles',
      desc: 'Boutons larges et espacés, conçus pour une utilisation confortable par des producteurs n\'ayant pas l\'habitude des smartphones.',
      badge: 'Ergonomie champêtre',
    },
  ];

  return (
    <section id="accessibility" className="py-16 md:py-24 bg-[#F9F8F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs font-bold text-[#5D4037] uppercase tracking-wider bg-[#EFEBE9] border border-[#D7CCC8] px-3.5 py-1 rounded-full inline-block">
            Inclusion & Accessibilité
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3E2723] tracking-tight">
            La technologie doit être accessible à tous.
          </h2>
          <p className="text-stone-600 text-base md:text-lg">
            AgroPlan CI est conçu sur mesure pour s'adapter à la réalité des producteurs ruraux en Côte d'Ivoire.
          </p>
        </ScrollReveal>

        {/* Principles Grid */}
        <StaggerContainer className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerChildren={0.1}>
          {principles.map((item, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}>
                      <i className={item.iconClass}></i>
                    </div>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2D2421] mb-2">
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

        {/* Interactive Audio Player Demo Box */}
        <ScrollReveal delay={0.2} className="mt-12 bg-white rounded-2xl p-6 md:p-8 border-2 border-[#5D4037]/20 shadow-lg max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8] flex items-center justify-center text-lg font-bold">
              <i className="fa-solid fa-volume-high"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3E2723]">Démo du Lecteur Audio Vocal</h3>
              <p className="text-xs text-stone-500">Testez l'écoute d'un conseil agricole en direct</p>
            </div>
          </div>

          {/* Language Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['fr', 'baoule', 'dioula', 'bete'] as LocalLanguage[]).map((langKey) => (
              <button
                key={langKey}
                onClick={() => {
                  stopSpeaking();
                  setIsPlayingAudio(false);
                  setSelectedLanguage(langKey);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLanguage === langKey
                    ? 'bg-[#5D4037] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {demoPhrases[langKey].langName}
              </button>
            ))}
          </div>

          {/* Player Display Box */}
          <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200 relative overflow-hidden">
            <p className="text-xs font-semibold text-stone-500 uppercase mb-1">
              {demoPhrases[selectedLanguage].title}
            </p>
            <p className="text-stone-800 text-sm italic leading-relaxed">
              "{demoPhrases[selectedLanguage].text}"
            </p>

            {/* Audio Wave Visualizer Simulation */}
            {isPlayingAudio && (
              <div className="mt-3 flex items-center gap-1">
                {[40, 70, 30, 90, 50, 80, 40, 60, 30, 85].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-[#2E7D32] rounded-full animate-audio-pulse"
                    style={{ height: `${h / 2}px`, animationDelay: `${idx * 0.15}s` }}
                  />
                ))}
                <span className="text-[11px] text-[#2E7D32] font-bold ml-2">Lecture vocale en cours...</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleToggleAudio}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-700 text-white hover:bg-amber-800'
                  : 'bg-[#2E7D32] text-white hover:bg-[#236327]'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <i className="fa-solid fa-stop text-xs"></i>
                  <span>Arrêter l'écoute</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-play text-xs"></i>
                  <span>Écouter la recommandation</span>
                </>
              )}
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
