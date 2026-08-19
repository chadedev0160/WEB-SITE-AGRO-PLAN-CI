import React, { useState } from 'react';
import { PageRoute, FarmerProfile, FarmParcel, LocalLanguage, AdviceItem, RecommendedCrop } from '../types';
import { DEFAULT_PARCELS, INITIAL_ADVICES } from '../data/mockData';
import { FARMER_PORTRAITS, INITIAL_PRODUCERS_WITH_CARTOGRAPHY } from '../data/producersData';
import { ParcelCartographyViewer } from './ParcelCartographyViewer';
import { speakText, stopSpeaking } from '../utils/speechUtils';
import { useToast } from '../context/ToastContext';
import { AgroPlanLogo } from './AgroPlanLogo';
import {
  Smartphone,
  ArrowLeft,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Home,
  Trees,
  Sparkles,
  BookOpen,
  User,
  Lock,
  Plus,
  CheckCircle2,
  ChevronRight,
  Sun,
  CloudRain,
  Share2,
  Play,
  Square,
  Info,
  Maximize2,
  RotateCcw,
  CreditCard,
  QrCode
} from 'lucide-react';

interface AppSimulatorProps {
  onNavigate: (route: PageRoute) => void;
}

type AppStep = 'splash' | 'auth_choice' | 'register' | 'login' | 'pin_setup' | 'pin_verify' | 'home' | 'parcel_detail' | 'parcel_form' | 'analysis' | 'advices';

export const AppSimulator: React.FC<AppSimulatorProps> = ({ onNavigate }) => {
  const toast = useToast();
  // Offline mode state
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [usePhoneFrame, setUsePhoneFrame] = useState<boolean>(true);

  // App step state
  const [currentStep, setCurrentStep] = useState<AppStep>('home'); // Default directly to home for smooth review, with splash entry option

  // User Profile State with official Farmer Card Code and Photo
  const [user, setUser] = useState<FarmerProfile>({
    name: 'Koffi Kouadio',
    phone: '07 08 09 10 11',
    farmerCardCode: 'CI-CCC-2024-88492',
    ngoAffiliationCode: 'ONG-ANADER-NAWA',
    coopMatricule: 'COOP-SB-2024-88',
    region: 'Soubré (Nawa)',
    pin: '1234',
    isRegistered: true,
    photoUrl: FARMER_PORTRAITS.koffi,
  });
  const [showCardCartography, setShowCardCartography] = useState<boolean>(false);

  // Auth form inputs
  const [inputName, setInputName] = useState('');
  const [inputCardCode, setInputCardCode] = useState('CI-CCC-2024-88492');
  const [inputNgoCode, setInputNgoCode] = useState('ONG-ANADER-NAWA');
  const [inputPhone, setInputPhone] = useState('');
  const [inputCoop, setInputCoop] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Parcels State
  const [parcels, setParcels] = useState<FarmParcel[]>(DEFAULT_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<FarmParcel>(DEFAULT_PARCELS[0]);

  // Parcel Form State
  const [parcelName, setParcelName] = useState('Nouvelle Parcelle');
  const [parcelRegion, setParcelRegion] = useState('Soubré');
  const [parcelSize, setParcelSize] = useState<number>(2.0);
  const [cocoaAge, setCocoaAge] = useState<number>(15);
  const [shadeLevel, setShadeLevel] = useState<'Faible' | 'Moyen' | 'Important'>('Faible');
  const [soilType, setSoilType] = useState<'Sablo-argileux' | 'Argileux' | 'Humifère' | 'Latéritique'>('Sablo-argileux');

  // Advices state
  const [advices, setAdvices] = useState<AdviceItem[]>(INITIAL_ADVICES);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<LocalLanguage>('fr');

  // Tab navigation inside App ('home' | 'parcels' | 'card' | 'analysis' | 'advices')
  const [activeTab, setActiveTab] = useState<'home' | 'parcels' | 'card' | 'analysis' | 'advices'>('home');

  // Audio Play Handler
  const handlePlayAudio = (item: AdviceItem) => {
    if (activeAudioId === item.id) {
      stopSpeaking();
      setActiveAudioId(null);
      return;
    }

    const textToSpeak = item.audioText[selectedLang];
    setActiveAudioId(item.id);
    speakText(
      textToSpeak,
      'fr-FR',
      () => setActiveAudioId(item.id),
      () => setActiveAudioId(null),
      () => setActiveAudioId(null)
    );
  };

  // Run Smart Recommendation Algorithm for custom parcel
  const handleCreateParcel = (e: React.FormEvent) => {
    e.preventDefault();

    // Recommendation logic based on farmer inputs
    const recs: RecommendedCrop[] = [];

    // Shade recommendation
    if (shadeLevel === 'Faible' || cocoaAge > 20) {
      recs.push({
        name: 'Akpi / Framiré (Ombrage & Fertilité)',
        category: "Arbre d'ombrage",
        icon: '🌳',
        benefits: 'Restaure l\'ombrage régulateur et la litière de feuilles.',
        densityAdvice: '20 à 25 pieds par hectare',
        waterNeed: 'Faible'
      });
    }

    // Food crop recommendation
    recs.push({
      name: 'Banane Plantain',
      category: 'Vivrier',
      icon: '🍌',
      benefits: 'Ombrage intermédiaire rapide et sécurité alimentaire du foyer.',
      densityAdvice: '3m x 3m entre les lignes de cacao',
      waterNeed: 'Moyen'
    });

    recs.push({
      name: 'Manioc Variété Résistante',
      category: 'Vivrier',
      icon: '🥔',
      benefits: 'Culture de bordure idéale contre les adventices.',
      densityAdvice: 'Le long des limites de la parcelle',
      waterNeed: 'Faible'
    });

    if (soilType === 'Humifère' || soilType === 'Sablo-argileux') {
      recs.push({
        name: 'Taro / Macabo',
        category: 'Vivrier',
        icon: '🌱',
        benefits: 'Valorisation des zones humides et bas de pente.',
        densityAdvice: 'En bas de versant',
        waterNeed: 'Élevé'
      });
    }

    const newParcel: FarmParcel = {
      id: `p-${Date.now()}`,
      name: parcelName || `Parcelle ${parcels.length + 1}`,
      region: parcelRegion,
      sizeHectares: parcelSize,
      cocoaTreeAgeYears: cocoaAge,
      shadeLevel,
      soilType,
      hasWaterSource: true,
      healthScore: shadeLevel === 'Faible' ? 68 : 84,
      shadeScore: shadeLevel === 'Faible' ? 20 : shadeLevel === 'Moyen' ? 45 : 75,
      recommendedCrops: recs,
    };

    setParcels([...parcels, newParcel]);
    setSelectedParcel(newParcel);
    setActiveTab('analysis');
    setCurrentStep('home');
    toast.success(
      'Parcelle ajoutée avec succès !',
      `Diagnostic et recommandations générés pour ${newParcel.name} (${newParcel.sizeHectares} Ha).`
    );
  };

  // Auth Handlers
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputPhone) return;
    const assignedCode = inputCardCode.trim() || `CI-CCC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const assignedNgo = inputNgoCode.trim() || 'ONG-ANADER-NAWA';
    setUser({
      name: inputName,
      phone: inputPhone,
      farmerCardCode: assignedCode,
      ngoAffiliationCode: assignedNgo,
      coopMatricule: inputCoop || 'Indépendant',
      region: 'Soubré (Nawa)',
      pin: '1234',
      isRegistered: true,
    });
    toast.success('Carte Planteur & Code ONG Enregistrés !', `Affilié à l'ONG/Institution : ${assignedNgo}`);
    setCurrentStep('pin_setup');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === user.pin || inputPin === '1234') {
      setPinError('');
      toast.success('Authentification réussie !', `Bienvenue ${user.name} (Affiliation : ${user.ngoAffiliationCode || 'ONG-ANADER-NAWA'}).`);
      setCurrentStep('home');
    } else {
      setPinError('Code PIN incorrect. Essayez 1234.');
      toast.error('Échec d\'authentification', 'Code PIN incorrect. Veuillez réessayer avec 1234.');
    }
  };

  // Inside Phone Screen Content Render
  const renderAppScreen = () => {
    // 1. Splash Screen
    if (currentStep === 'splash') {
      return (
        <div className="flex flex-col items-center justify-between h-full py-8 px-5 text-center bg-[#1E3A2B] text-white rounded-[28px]">
          <div className="space-y-3 my-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-[#F9F8F6] rounded-3xl flex items-center justify-center p-3 mx-auto shadow-2xl border border-emerald-400/40">
              <AgroPlanLogo variant="icon" size="custom" className="w-16 h-16" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black tracking-tight text-white">Agro Plan CI</h2>
              <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
                Identification Planteur & Code Unique ONG
              </p>
            </div>

            {/* Farmer Card Badge Preview */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl text-left text-[10px] space-y-1.5 w-full max-w-[240px]">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-amber-300" />
                  <span>Carte Planteur Démo</span>
                </span>
                <span className="text-[9px] bg-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-100 font-mono">
                  CCC-CI
                </span>
              </div>
              <p className="font-mono text-amber-300 font-bold text-xs">{user.farmerCardCode}</p>
              
              <div className="flex items-center justify-between pt-1 border-t border-emerald-800/60 text-[9px]">
                <span className="text-stone-300">Code ONG :</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-1 rounded border border-amber-400/30">
                  {user.ngoAffiliationCode || 'ONG-ANADER-NAWA'}
                </span>
              </div>
              <p className="text-stone-300 text-[9px]">{user.name} • {user.region}</p>
            </div>
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={() => setCurrentStep('login')}
              className="w-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Se connecter avec ma Carte Planteur</span>
            </button>
            <button
              onClick={() => setCurrentStep('register')}
              className="w-full bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-[11px] border border-emerald-600 transition-colors cursor-pointer"
            >
              Enregistrer avec Code ONG
            </button>
          </div>
        </div>
      );
    }

    // 2. Registration Screen
    if (currentStep === 'register') {
      return (
        <div className="p-4 space-y-3 text-left overflow-y-auto h-full">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button onClick={() => setCurrentStep('splash')} className="text-stone-500 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Enregistrer ma Carte</h3>
              <p className="text-[10px] text-stone-500">Rattachement à votre ONG ou Institution de tutelle</p>
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-xs">
            {/* NGO ID Code Field */}
            <div className="bg-amber-50 border border-amber-300 p-2 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-950 text-[10px]">
                  Code Unique de l'ONG (ID Partenaire) *
                </label>
                <span className="text-[8px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                  Requis
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="Ex: ONG-ANADER-NAWA"
                value={inputNgoCode}
                onChange={(e) => setInputNgoCode(e.target.value.toUpperCase())}
                className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-extrabold text-stone-900 outline-none uppercase"
              />
              <p className="text-[9px] text-amber-800">
                Code ID fourni par votre encadreur pour connecter votre profil au dashboard central.
              </p>
            </div>

            {/* Card Code Field */}
            <div className="bg-emerald-50 border border-emerald-300 p-2 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-emerald-900 text-[10px] flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-[#2E7D32]" />
                  <span>Code Carte Planteur *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setInputCardCode(`CI-CCC-2026-${Math.floor(10000 + Math.random() * 90000)}`)}
                  className="text-[9px] font-bold text-[#2E7D32] hover:underline cursor-pointer"
                >
                  Générer code
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="CI-CCC-2024-88492"
                value={inputCardCode}
                onChange={(e) => setInputCardCode(e.target.value)}
                className="w-full p-2 bg-white border border-emerald-200 rounded-lg text-xs font-mono font-bold text-stone-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 uppercase text-[10px]">Nom complet du Planteur *</label>
              <input
                type="text"
                required
                placeholder="Ex: Kouadio Yao"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full p-2 bg-stone-100 border border-stone-300 rounded-xl mt-0.5 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 uppercase text-[10px]">Numéro Téléphone *</label>
              <input
                type="tel"
                required
                placeholder="07 08 09 10 11"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                className="w-full p-2 bg-stone-100 border border-stone-300 rounded-xl mt-0.5 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 uppercase text-[10px]">Coopérative de rattachement</label>
              <input
                type="text"
                placeholder="Ex: Coop-CA Soubré"
                value={inputCoop}
                onChange={(e) => setInputCoop(e.target.value)}
                className="w-full p-2 bg-stone-100 border border-stone-300 rounded-xl mt-0.5 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2E7D32] hover:bg-[#256628] text-white py-2.5 rounded-xl font-bold text-xs shadow-md mt-2 cursor-pointer transition-colors"
            >
              Valider & Connecter à l'ONG
            </button>
          </form>
        </div>
      );
    }

    // 3. PIN Setup / Login Screen
    if (currentStep === 'login' || currentStep === 'pin_setup') {
      return (
        <div className="p-4 space-y-4 text-left">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button onClick={() => setCurrentStep('splash')} className="text-stone-500 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                {currentStep === 'pin_setup' ? 'Créer un code PIN' : 'Connexion Sécurisée'}
              </h3>
              <p className="text-[10px] text-stone-500">Identification par Carte Planteur</p>
            </div>
          </div>

          {/* Active Card Badge Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2B] text-amber-300 flex items-center justify-center font-bold text-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 font-medium">Carte de Planteur :</p>
                  <p className="font-mono font-bold text-xs text-[#1E3A2B]">{user.farmerCardCode}</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="pt-1 border-t border-emerald-200/80 flex items-center justify-between text-[10px]">
              <span className="text-stone-600">ID Tutelle ONG :</span>
              <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                {user.ngoAffiliationCode || 'ONG-ANADER-NAWA'}
              </span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3 text-center">
            <p className="text-xs text-stone-600">
              Entrez votre code secret à 4 chiffres (PIN test : <strong className="text-[#2E7D32]">1234</strong>)
            </p>

            <div className="flex justify-center gap-2">
              <input
                type="password"
                maxLength={4}
                required
                placeholder="1234"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="w-32 text-center tracking-[0.5em] text-lg font-bold p-2.5 bg-stone-100 border border-stone-300 rounded-xl outline-none focus:border-[#2E7D32]"
              />
            </div>

            {pinError && <p className="text-[11px] text-red-600 font-semibold">{pinError}</p>}

            <button
              type="submit"
              className="w-full bg-[#2E7D32] hover:bg-[#256628] text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Ouvrir mon Espace Planteur
            </button>
          </form>
        </div>
      );
    }

    // 4. Main Tab Screen Views (Home, Parcels, Card, Analysis, Advices)
    return (
      <div className="flex flex-col h-full justify-between">
        {/* Top App Header with Farmer Card ID Badge */}
        <div className="bg-[#1E3A2B] text-white px-3 py-2.5 rounded-t-2xl flex items-center justify-between text-xs border-b border-emerald-700/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center font-bold text-amber-300 text-xs">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold leading-none">{user.name}</p>
              </div>
              <p className="text-[9px] font-mono text-amber-300 font-semibold mt-0.5">
                {user.farmerCardCode}
              </p>
            </div>
          </div>

          {/* Offline indicator toggle button */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              isOffline ? 'bg-amber-500 text-stone-900' : 'bg-emerald-800 text-emerald-100'
            }`}
            title="Activer/Désactiver le mode hors connexion"
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{isOffline ? 'Hors Ligne' : 'En Ligne'}</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 text-left">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-3">
              
              {/* Farmer ID Mini-Card Banner */}
              <div
                onClick={() => setActiveTab('card')}
                className="bg-gradient-to-r from-[#2D5A3F] to-[#1E3A2B] text-white p-2.5 rounded-xl shadow-xs border border-emerald-500/30 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-400 text-stone-900 flex items-center justify-center font-extrabold text-[10px]">
                    CI
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-emerald-200 font-bold block">
                      Carte Planteur Conseil Café-Cacao
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {user.farmerCardCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-200 group-hover:text-white font-medium">
                  <span>Voir Carte</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-[10px] font-bold text-emerald-900 uppercase">Météo Agricole Soubré</p>
                    <p className="text-xs font-semibold text-stone-700">28°C • Période propice à la plantation</p>
                  </div>
                </div>
              </div>

              {/* Selected Parcel Card */}
              <div className="bg-white border border-stone-200 p-3 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-xs font-extrabold text-stone-900">{selectedParcel.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-[#2E7D32] px-2 py-0.5 rounded-md font-bold">
                    {selectedParcel.sizeHectares} Ha
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-stone-50 p-1.5 rounded-lg">
                    <span className="text-stone-500 block">Âge Cacaoyers</span>
                    <strong className="text-stone-800 text-xs">{selectedParcel.cocoaTreeAgeYears} ans</strong>
                  </div>
                  <div className="bg-stone-50 p-1.5 rounded-lg">
                    <span className="text-stone-500 block">Niveau Ombrage</span>
                    <strong className="text-amber-800 text-xs">{selectedParcel.shadeLevel} ({selectedParcel.shadeScore}%)</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('analysis')}
                  className="w-full bg-[#2E7D32] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 mt-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Voir Recommandations</span>
                </button>
              </div>

              {/* Audio Conseil Featured Box */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-950">Conseil Audio du Jour</span>
                  </div>
                  
                  {/* Lang Selector */}
                  <div className="flex gap-1 text-[9px] font-bold">
                    {(['fr', 'baoule', 'dioula'] as LocalLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${
                          selectedLang === lang ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-amber-900 italic font-medium leading-tight">
                  "{advices[0].audioText[selectedLang]}"
                </p>

                <button
                  onClick={() => handlePlayAudio(advices[0])}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {activeAudioId === advices[0].id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{activeAudioId === advices[0].id ? 'Arrêter' : 'Écouter la recommandation'}</span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrentStep('parcel_form')}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#2E7D32]" />
                  <span>Nouvelle parcelle</span>
                </button>
                <button
                  onClick={() => setActiveTab('advices')}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#2E7D32]" />
                  <span>Fiches conseils</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PARCELS */}
          {activeTab === 'parcels' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-stone-600">Mes Parcelles ({parcels.length})</h4>
                <button
                  onClick={() => setCurrentStep('parcel_form')}
                  className="bg-[#2E7D32] hover:bg-[#256628] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter</span>
                </button>
              </div>

              {parcels.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedParcel(p)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedParcel.id === p.id
                      ? 'bg-emerald-50 border-[#2E7D32] ring-1 ring-[#2E7D32]'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{p.name}</span>
                    <span className="text-[10px] font-bold text-stone-500">{p.sizeHectares} Ha</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Cacaoyers: {p.cocoaTreeAgeYears} ans • Ombrage: {p.shadeLevel} ({p.shadeScore}%)
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CARTE DE PLANTEUR DIGITALE */}
          {activeTab === 'card' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase text-stone-700">Ma Carte de Planteur Officielle</h4>
                <span className="text-[9px] font-bold bg-emerald-100 text-[#2E7D32] px-2 py-0.5 rounded-full">
                  Valide & Vérifiée
                </span>
              </div>

              {/* Digital Card Rendering */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A2B] via-[#2A5038] to-[#152B1E] text-white p-4 shadow-md border border-emerald-500/40 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-emerald-800 border border-emerald-400/50 flex items-center justify-center font-bold text-amber-300 text-[10px]">
                      CI
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-emerald-300 font-bold">
                        Rép. de Côte d'Ivoire
                      </p>
                      <p className="text-[9px] font-extrabold text-white">Conseil Café-Cacao</p>
                    </div>
                  </div>

                  {/* Golden Chip */}
                  <div className="w-7 h-5 rounded bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-300 flex items-center justify-center shadow-xs">
                    <div className="w-5 h-3 border border-amber-800/30 grid grid-cols-2">
                      <div className="border-r border-amber-800/30"></div>
                      <div></div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="w-16 h-20 bg-emerald-950 rounded-xl border-2 border-emerald-400/80 overflow-hidden shadow-inner flex flex-col items-center justify-center text-center relative">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <>
                          <User className="w-6 h-6 text-emerald-300 mb-0.5" />
                          <span className="text-[7px] text-emerald-200 uppercase font-bold">Planteur</span>
                        </>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[6px] text-emerald-300 font-bold text-center py-0.2">
                        CCC ID
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1 text-xs">
                    <div>
                      <span className="text-[7px] uppercase tracking-wider text-emerald-300/80 font-bold block">
                        Code Carte de Planteur
                      </span>
                      <span className="font-mono font-extrabold text-xs text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/30 inline-block">
                        {user.farmerCardCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-[7px] text-emerald-300/80 uppercase font-bold block">Titulaire</span>
                      <p className="font-bold text-white text-xs">{user.name}</p>
                    </div>
                    <div>
                      <span className="text-[7px] text-amber-300/90 uppercase font-bold block">ID Rattachement ONG</span>
                      <span className="font-mono text-[10px] font-extrabold text-amber-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-amber-400/40 inline-block">
                        {user.ngoAffiliationCode || 'ONG-ANADER-NAWA'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] text-stone-200">
                      <span>Région : {user.region}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with QR Bar */}
                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[8px] text-emerald-200">
                  <span className="font-mono">NFC: {user.farmerCardCode.replace('CI-CCC-', 'NFC-')}</span>
                  <span className="font-bold text-amber-300">RDUE Conforme</span>
                </div>
              </div>

              {/* Cartography Toggle for Field */}
              <button
                onClick={() => setShowCardCartography(!showCardCartography)}
                className="w-full bg-[#1B5E20] hover:bg-[#144718] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Trees className="w-4 h-4 text-emerald-300" />
                <span>{showCardCartography ? 'Masquer la Cartographie GPS' : 'Voir la Cartographie GPS de mon Champ'}</span>
              </button>

              {/* Interactive Cartography inside Mobile Simulator */}
              {showCardCartography && (
                <div className="animate-in fade-in zoom-in duration-150">
                  <ParcelCartographyViewer cartography={INITIAL_PRODUCERS_WITH_CARTOGRAPHY[0].cartography} />
                </div>
              )}

              {/* Usage notice */}
              <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-xs space-y-1">
                <p className="font-bold text-stone-800 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Utilisation de votre carte :</span>
                </p>
                <p className="text-[10px] text-stone-600 leading-relaxed">
                  Présentez ce code unique lors des pesées de fèves de cacao en coopérative, des audits d'ombrage et pour recevoir vos paiements directs certifiés.
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: ANALYSIS & RECOMMENDATIONS */}
          {activeTab === 'analysis' && (
            <div className="space-y-3">
              <div className="bg-emerald-800 text-white p-3 rounded-xl space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-200">Recommandations AgroPlan</p>
                <h4 className="text-sm font-extrabold">{selectedParcel.name}</h4>
                <p className="text-[11px] text-emerald-100">
                  Diversification optimisée pour {selectedParcel.sizeHectares} Ha à {selectedParcel.region}.
                </p>
              </div>

              {/* Recommended Crops list */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Cultures & Arbres Recommandés</span>
                
                {selectedParcel.recommendedCrops.map((crop, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{crop.icon}</span>
                        <span className="text-xs font-bold text-stone-900">{crop.name}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-[#2E7D32] px-1.5 py-0.5 rounded font-bold">
                        {crop.category}
                      </span>
                    </div>

                    <p className="text-[10px] text-stone-600 leading-tight">{crop.benefits}</p>
                    <p className="text-[10px] font-semibold text-[#2E7D32]">📍 Densité : {crop.densityAdvice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ADVICES */}
          {activeTab === 'advices' && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-stone-700 uppercase">Conseils & Pratiques</h4>
              
              {advices.map((adv) => (
                <div key={adv.id} className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{adv.icon}</span>
                      <span className="text-xs font-bold text-stone-900">{adv.title}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-600 leading-relaxed italic">
                    "{adv.audioText[selectedLang]}"
                  </p>

                  <button
                    onClick={() => handlePlayAudio(adv)}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 text-[#2E7D32] font-bold text-[10px] py-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {activeAudioId === adv.id ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{activeAudioId === adv.id ? 'Arrêter Audio' : 'Écouter'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* FORM: CREATE PARCEL MODAL OVERLAY */}
          {currentStep === 'parcel_form' && (
            <div className="p-2 space-y-3 bg-white rounded-xl border border-stone-300">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-xs font-bold text-stone-900">Nouvelle Parcelle</span>
                <button onClick={() => setCurrentStep('home')} className="text-stone-400 text-xs font-bold cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateParcel} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-stone-600">Nom du champ</label>
                  <input
                    type="text"
                    required
                    value={parcelName}
                    onChange={(e) => setParcelName(e.target.value)}
                    className="w-full p-2 bg-stone-100 border rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600">Région</label>
                    <select
                      value={parcelRegion}
                      onChange={(e) => setParcelRegion(e.target.value)}
                      className="w-full p-2 bg-stone-100 border rounded-lg text-xs"
                    >
                      <option value="Soubré">Soubré</option>
                      <option value="San-Pédro">San-Pédro</option>
                      <option value="Daloa">Daloa</option>
                      <option value="Abengourou">Abengourou</option>
                      <option value="Gagnoa">Gagnoa</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600">Superficie (Ha)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="20"
                      value={parcelSize}
                      onChange={(e) => setParcelSize(parseFloat(e.target.value))}
                      className="w-full p-2 bg-stone-100 border rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600">Âge cacaoyers (ans)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={cocoaAge}
                      onChange={(e) => setCocoaAge(parseInt(e.target.value))}
                      className="w-full p-2 bg-stone-100 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600">Ombrage</label>
                    <select
                      value={shadeLevel}
                      onChange={(e) => setShadeLevel(e.target.value as any)}
                      className="w-full p-2 bg-stone-100 border rounded-lg text-xs"
                    >
                      <option value="Faible">Faible</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Important">Important</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2E7D32] hover:bg-[#256628] text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer transition-colors"
                >
                  Générer les recommandations
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Bottom App Navigation Tabs */}
        <div className="bg-white border-t border-stone-200 py-1.5 px-1 rounded-b-2xl grid grid-cols-5 text-center text-[9px]">
          <button
            onClick={() => {
              setActiveTab('home');
              setCurrentStep('home');
            }}
            className={`flex flex-col items-center py-1 font-bold cursor-pointer ${
              activeTab === 'home' ? 'text-[#2E7D32]' : 'text-stone-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Accueil</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('parcels');
              setCurrentStep('home');
            }}
            className={`flex flex-col items-center py-1 font-bold cursor-pointer ${
              activeTab === 'parcels' ? 'text-[#2E7D32]' : 'text-stone-400'
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>Champs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('card');
              setCurrentStep('home');
            }}
            className={`flex flex-col items-center py-1 font-bold cursor-pointer ${
              activeTab === 'card' ? 'text-[#2E7D32]' : 'text-stone-400'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Ma Carte</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analysis');
              setCurrentStep('home');
            }}
            className={`flex flex-col items-center py-1 font-bold cursor-pointer ${
              activeTab === 'analysis' ? 'text-[#2E7D32]' : 'text-stone-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyse</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('advices');
              setCurrentStep('home');
            }}
            className={`flex flex-col items-center py-1 font-bold cursor-pointer ${
              activeTab === 'advices' ? 'text-[#2E7D32]' : 'text-stone-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Conseils</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#F5F7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au site AgroPlan CI</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUsePhoneFrame(!usePhoneFrame)}
              className="bg-white border border-stone-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:border-[#2E7D32] transition-colors cursor-pointer"
            >
              {usePhoneFrame ? 'Vue Plein Écran Mobile' : 'Vue Cadre Smartphone'}
            </button>

            <button
              onClick={() => setCurrentStep('splash')}
              className="bg-stone-200 hover:bg-stone-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser (Splash)</span>
            </button>
          </div>
        </div>

        {/* Title & Context */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full inline-block">
            Simulateur Interactif Android
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C2C1E]">
            Application AgroPlan CI
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">
            Testez en direct l'expérience utilisateur mobile pensée pour les producteurs de cacao en Côte d'Ivoire, identifiés par leur code unique de carte de planteur.
          </p>
        </div>

        {/* Simulator Frame Container */}
        <div className="flex justify-center">
          {usePhoneFrame ? (
            /* Framed Smartphone View */
            <div className="w-full max-w-[340px] bg-stone-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-stone-800 relative">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-stone-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-stone-700 rounded-full" />
              </div>

              {/* Screen Canvas */}
              <div className="bg-[#F5F7F2] rounded-[32px] h-[580px] overflow-hidden border border-stone-200 shadow-inner">
                {renderAppScreen()}
              </div>
            </div>
          ) : (
            /* Expanded Mobile Screen View */
            <div className="w-full max-w-md bg-white rounded-3xl p-4 shadow-xl border border-stone-200 min-h-[560px]">
              {renderAppScreen()}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
