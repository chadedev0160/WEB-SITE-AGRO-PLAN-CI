import React, { useState } from 'react';
import { PartnerAccount, LocalLanguage, PageRoute, SupervisedProducer } from '../types';
import { AgroPlanLogo } from './AgroPlanLogo';
import { speakText, stopSpeaking } from '../utils/speechUtils';
import { useToast } from '../context/ToastContext';
import { INITIAL_PRODUCERS_WITH_CARTOGRAPHY } from '../data/producersData';
import { ParcelCartographyViewer } from './ParcelCartographyViewer';

interface NgoDashboardAppProps {
  account: PartnerAccount;
  onLogout: () => void;
  onNavigateToPublicSite: (route?: PageRoute) => void;
}

type DashboardTab = 'overview' | 'producers' | 'cartography' | 'compliance' | 'voice-studio' | 'reports' | 'settings';

export const NgoDashboardApp: React.FC<NgoDashboardAppProps> = ({
  account,
  onLogout,
  onNavigateToPublicSite,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Producers state
  const [producers, setProducers] = useState<SupervisedProducer[]>(INITIAL_PRODUCERS_WITH_CARTOGRAPHY);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProducer, setSelectedProducer] = useState<SupervisedProducer | null>(null);
  const [modalTab, setModalTab] = useState<'card' | 'cartography' | 'agronomy'>('card');
  const [activeCartoProducerId, setActiveCartoProducerId] = useState<string>(INITIAL_PRODUCERS_WITH_CARTOGRAPHY[0].id);

  // Add Producer Modal
  const [isAddFarmerOpen, setIsAddFarmerOpen] = useState(false);
  const [isNgoCodeModalOpen, setIsNgoCodeModalOpen] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    farmerCardCode: `CI-CCC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    name: '',
    cooperative: account.orgName || 'Coopérative Locale',
    village: 'Soubré',
    size: '3.0 Ha',
    treesAge: '12 ans',
    shade: '22% (Optimal)',
    shadeLevel: 'optimal' as const,
    crops: 'Cacao, Banane Plantain, Akpi, Framiré',
    phone: '+225 07 00 00 00 00',
  });

  // Voice Broadcast Studio
  const [broadcastLang, setBroadcastLang] = useState<LocalLanguage>('fr');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Alerte saisonnière AgroPlan : La période actuelle est propice à l\'élagage léger des arbres d\'ombrage et à l\'introduction de rejets de bananiers pour préserver l\'humidité des cacaoyers.'
  );
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Toggle Voice Preview
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopSpeaking();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      speakText(
        broadcastMessage,
        broadcastLang,
        () => setIsPlayingVoice(true),
        () => setIsPlayingVoice(false),
        () => setIsPlayingVoice(false)
      );
    }
  };

  // Trigger Live Broadcast
  const handleSendLiveBroadcast = () => {
    setIsBroadcasting(true);
    toast.success(
      'Campagne Audio Envoyée !',
      `Le conseil vocal (${broadcastLang === 'fr' ? 'Français' : broadcastLang.toUpperCase()}) a été transmis aux ${account.producerCount} planteurs de votre réseau.`
    );
    setTimeout(() => {
      setIsBroadcasting(false);
    }, 1500);
  };

  // Add Farmer Handler
  const isDuplicateCardCode = producers.some(
    (p) => p.farmerCardCode.trim().toLowerCase() === newFarmer.farmerCardCode.trim().toLowerCase()
  );

  const existingDuplicateProducer = producers.find(
    (p) => p.farmerCardCode.trim().toLowerCase() === newFarmer.farmerCardCode.trim().toLowerCase()
  );

  const handleAddFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmer.name.trim()) {
      toast.error('Nom requis', 'Veuillez saisir le nom complet de l\'exploitant.');
      return;
    }

    const cardCode = newFarmer.farmerCardCode.trim();
    if (!cardCode) {
      toast.error('Code requis', 'Veuillez saisir ou générer un code de carte planteur.');
      return;
    }

    // Check duplicate
    if (isDuplicateCardCode) {
      toast.error(
        'Code carte existant',
        `Le code ${cardCode} est déjà assigné à ${existingDuplicateProducer?.name || 'un autre planteur'}.`
      );
      return;
    }

    const created = {
      id: `p-${Date.now()}`,
      farmerCardCode: cardCode,
      name: newFarmer.name,
      cooperative: newFarmer.cooperative || account.orgName,
      village: newFarmer.village,
      size: newFarmer.size.includes('Ha') ? newFarmer.size : `${newFarmer.size} Ha`,
      treesAge: newFarmer.treesAge,
      shade: newFarmer.shade,
      shadeLevel: (newFarmer.shade.includes('Optimal') ? 'optimal' : newFarmer.shade.includes('Déficitaire') ? 'warning' : 'intermediate') as 'optimal' | 'intermediate' | 'warning',
      status: 'Inscrit & Supervisé',
      cardStatus: 'Active & Vérifiée' as const,
      crops: newFarmer.crops.split(',').map((c) => c.trim()),
      lastAudit: 'Aujourd\'hui',
      phone: newFarmer.phone,
    };

    setProducers([created, ...producers]);
    setIsAddFarmerOpen(false);
    toast.success(
      'Exploitant Enregistré avec Carte',
      `${created.name} (${created.farmerCardCode}) a été ajouté avec succès à votre portefeuille de supervision.`
    );
    setNewFarmer({
      farmerCardCode: `CI-CCC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      name: '',
      cooperative: account.orgName || 'Coopérative Locale',
      village: 'Soubré',
      size: '3.0 Ha',
      treesAge: '12 ans',
      shade: '22% (Optimal)',
      shadeLevel: 'optimal',
      crops: 'Cacao, Banane Plantain, Akpi, Framiré',
      phone: '+225 07 00 00 00 00',
    });
  };

  // Filtered Producers
  const filteredProducers = producers.filter((p) => {
    const query = searchFilter.toLowerCase().trim();
    const match =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.farmerCardCode.toLowerCase().includes(query) ||
      (p.cooperative && p.cooperative.toLowerCase().includes(query)) ||
      p.village.toLowerCase().includes(query) ||
      p.crops.some((c) => c.toLowerCase().includes(query));

    if (statusFilter === 'optimal') return match && p.shadeLevel === 'optimal';
    if (statusFilter === 'warning') return match && p.shadeLevel === 'warning';
    return match;
  });

  return (
    <div className="min-h-screen bg-[#F0F2ED] text-stone-900 flex flex-col font-poppins selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* ===================================================================== */}
      {/* 1. TOP SAAS APPLICATION HEADER (DÉDIÉ & HORS DU SITE PUBLIC)          */}
      {/* ===================================================================== */}
      <header className="bg-[#1E2D24] text-white border-b border-[#2D3E33] sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group"
              title="Console AgroPlan Enterprise"
            >
              <AgroPlanLogo size="sm" theme="light" variant="full" />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#2E7D32] text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                Console Pro
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg bg-stone-800/40 cursor-pointer"
            >
              <i className="fa-solid fa-bars text-sm"></i>
            </button>
          </div>

          {/* Center: Live Organization Session Info & NGO Code */}
          <div className="hidden md:flex items-center gap-3 bg-[#15221A] px-4 py-1.5 rounded-full border border-emerald-900/50">
            <span className="text-base">{account.logoEmoji}</span>
            <div className="text-left leading-none">
              <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                {account.orgName}
              </span>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium">
                <i className="fa-solid fa-location-dot text-[9px]"></i>
                <span>{account.region}</span>
              </span>
            </div>
            
            {/* NGO ID Code Pill with Copy Action */}
            <div
              onClick={() => {
                navigator.clipboard?.writeText(account.ngoCode || 'ONG-ANADER-NAWA');
                toast.success('Code ONG Copié !', `ID de connexion : ${account.ngoCode || 'ONG-ANADER-NAWA'}`);
              }}
              className="ml-1 bg-emerald-950/90 hover:bg-emerald-900 border border-amber-400/50 px-2 py-0.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Cliquer pour copier l'ID unique de connexion pour les planteurs"
            >
              <span className="text-[8px] uppercase text-emerald-300 font-bold">ID ONG :</span>
              <span className="font-mono text-[10px] font-extrabold text-amber-300">
                {account.ngoCode || 'ONG-ANADER-NAWA'}
              </span>
              <i className="fa-regular fa-copy text-[9px] text-amber-300/80"></i>
            </div>

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          </div>

          {/* Right Controls : Quick Actions & Exit to Site */}
          <div className="flex items-center gap-2.5">
            {/* Quick Broadcast Button */}
            <button
              onClick={() => setActiveTab('voice-studio')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-tower-broadcast text-xs"></i>
              <span>Studio Vocal</span>
            </button>

            {/* Print / Export Report */}
            <button
              onClick={() => window.print()}
              className="hidden lg:inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-700 transition-colors cursor-pointer"
              title="Imprimer ou exporter en PDF"
            >
              <i className="fa-solid fa-print text-xs"></i>
              <span>Bilan</span>
            </button>

            {/* Exit to Public Site */}
            <button
              onClick={() => onNavigateToPublicSite('landing')}
              className="inline-flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-700 transition-colors cursor-pointer"
              title="Revenir sur le site vitrine public AgroPlan CI"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs text-emerald-400"></i>
              <span className="hidden sm:inline">Retour au Site</span>
            </button>

            {/* Logout Session */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-100 hover:bg-red-950/60 p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Fermer la session superviseur"
            >
              <i className="fa-solid fa-right-from-bracket text-xs"></i>
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. BODY LAYOUT : SIDEBAR + MAIN WORKSPACE VIEWPORT                    */}
      {/* ===================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =================================================================== */}
        {/* DESKTOP & MOBILE SIDEBAR NAVIGATION                                 */}
        {/* =================================================================== */}
        <aside
          className={`bg-white border-r border-stone-200/80 flex flex-col justify-between transition-all duration-300 shrink-0 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } ${
            isMobileMenuOpen
              ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block w-72'
              : 'hidden lg:flex'
          }`}
        >
          {/* Top of Sidebar */}
          <div className="p-4 space-y-4">
            
            {/* Mobile close button */}
            <div className="flex lg:hidden items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-extrabold text-sm text-stone-800">Menu Superviseur</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            {/* Account Card in Sidebar */}
            {!sidebarCollapsed && (
              <div className="bg-[#F8F9F5] p-3.5 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${account.badgeColor}`}>
                    {account.orgType}
                  </span>
                  <span className="text-xs">{account.logoEmoji}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 truncate leading-snug">
                    {account.orgName}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    {account.contactPerson}
                  </p>
                </div>

                {/* NGO Code Box */}
                <div
                  onClick={() => {
                    navigator.clipboard?.writeText(account.ngoCode || 'ONG-ANADER-NAWA');
                    toast.success('Code ONG Copié !', `ID de connexion : ${account.ngoCode || 'ONG-ANADER-NAWA'}`);
                  }}
                  className="bg-emerald-950 text-white p-2 rounded-xl border border-amber-400/40 space-y-0.5 cursor-pointer hover:bg-emerald-900 transition-colors"
                  title="Code ID à communiquer aux planteurs de votre zone pour se connecter sur l'application mobile"
                >
                  <div className="flex items-center justify-between text-[8px] text-emerald-300 font-bold uppercase">
                    <span>ID Unique Connexion</span>
                    <i className="fa-regular fa-copy text-amber-300"></i>
                  </div>
                  <p className="font-mono text-xs font-black text-amber-300 tracking-wide">
                    {account.ngoCode || 'ONG-ANADER-NAWA'}
                  </p>
                </div>
              </div>
            )}

            {/* Main Navigation Items */}
            <nav className="space-y-1 text-xs font-semibold">
              
              {/* 1. Overview */}
              <button
                onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Tableau de bord & Indicateurs"
              >
                <i className={`fa-solid fa-chart-pie text-sm ${activeTab === 'overview' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Indicateurs & KPIs</span>}
              </button>

              {/* 2. Producers Directory */}
              <button
                onClick={() => { setActiveTab('producers'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'producers'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Registre des Planteurs"
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid fa-users text-sm ${activeTab === 'producers' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                  {!sidebarCollapsed && <span>Registre Planteurs</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'producers' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {producers.length}
                  </span>
                )}
              </button>

              {/* 3. Cartography & Shade */}
              <button
                onClick={() => { setActiveTab('cartography'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'cartography'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Cartographie des parcelles"
              >
                <i className={`fa-solid fa-map-location-dot text-sm ${activeTab === 'cartography' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Cartographie & Ombrage</span>}
              </button>

              {/* 4. RDUE Compliance */}
              <button
                onClick={() => { setActiveTab('compliance'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'compliance'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Conformité RDUE & Forêts"
              >
                <i className={`fa-solid fa-shield-halved text-sm ${activeTab === 'compliance' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Conformité RDUE</span>}
              </button>

              {/* 5. Voice Broadcast Studio */}
              <button
                onClick={() => { setActiveTab('voice-studio'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'voice-studio'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Studio d'Émission Vocale"
              >
                <i className={`fa-solid fa-tower-broadcast text-sm ${activeTab === 'voice-studio' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Studio Audio Multilingue</span>}
              </button>

              {/* 6. Reports & Audits */}
              <button
                onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Rapports d'impact & Audits"
              >
                <i className={`fa-solid fa-file-contract text-sm ${activeTab === 'reports' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Rapports & Audits</span>}
              </button>

              {/* 7. Settings */}
              <button
                onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#1E2D24] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="Paramètres de l'organisation"
              >
                <i className={`fa-solid fa-gear text-sm ${activeTab === 'settings' ? 'text-emerald-400' : 'text-stone-400'}`}></i>
                {!sidebarCollapsed && <span>Paramètres Mandat</span>}
              </button>

            </nav>
          </div>

          {/* Bottom of Sidebar */}
          <div className="p-4 border-t border-stone-100 space-y-2">
            {!sidebarCollapsed && (
              <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl">
                <p className="font-bold text-stone-800">Assistance Pro</p>
                <p className="mt-0.5">Ligne directe ANADER / AgroPlan :</p>
                <p className="font-mono text-stone-700 font-bold mt-1">+225 27 20 00 00</p>
              </div>
            )}

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-full items-center justify-center p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title={sidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
            >
              <i className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
            </button>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MAIN WORKSPACE CANVAS                                               */}
        {/* =================================================================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ================================================================= */}
          {/* BREADCRUMB & CONTEXT BANNER                                       */}
          {/* ================================================================= */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                <span>Espace Institutionnel</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
                <span className="text-stone-800 font-bold capitalize">
                  {activeTab === 'overview' && 'Indicateurs & KPIs'}
                  {activeTab === 'producers' && 'Registre des Exploitants'}
                  {activeTab === 'cartography' && 'Cartographie & Ombrage'}
                  {activeTab === 'compliance' && 'Conformité RDUE & Forêts'}
                  {activeTab === 'voice-studio' && 'Studio d\'Alertes Vocales'}
                  {activeTab === 'reports' && 'Rapports & Certifications'}
                  {activeTab === 'settings' && 'Paramètres de l\'Organisation'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {activeTab === 'overview' && 'Supervision de la Durabilité Cacaoyère'}
                {activeTab === 'producers' && `Portefeuille Planteurs (${producers.length})`}
                {activeTab === 'cartography' && `Couverture Agroforestière - ${account.region}`}
                {activeTab === 'compliance' && 'Dossier de Conformité Règlementaire (RDUE)'}
                {activeTab === 'voice-studio' && 'Centre de Diffusion des Conseils Vocaux'}
                {activeTab === 'reports' && 'Centre d\'Exportation & Audits d\'Impact'}
                {activeTab === 'settings' && 'Fiche & Paramètres de l\'Organisation'}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setIsNgoCodeModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#1E2D24] hover:bg-stone-900 text-amber-300 border border-amber-400/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Afficher le Code ONG unique pour connecter les planteurs à la plateforme"
              >
                <i className="fa-solid fa-key text-xs text-amber-400"></i>
                <span>Code Planteurs</span>
                <span className="hidden sm:inline-block font-mono bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded text-[10px] ml-1">
                  {account.ngoCode || 'ONG-ANADER-NAWA'}
                </span>
              </button>

              <button
                onClick={() => setIsAddFarmerOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#256628] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-user-plus text-xs"></i>
                <span>Ajouter un Planteur</span>
              </button>

              <button
                onClick={() => setActiveTab('voice-studio')}
                className="inline-flex items-center gap-1.5 bg-[#5D4037] hover:bg-[#4E342E] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-volume-high text-xs"></i>
                <span>Alerte Vocale</span>
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1 : VUE D'ENSEMBLE & INDICATEURS STRATÉGIQUES                 */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Dedicated Connection Code Banner for Farmers */}
              <div className="bg-gradient-to-r from-[#1E2D24] via-[#1B3828] to-[#152B1E] text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 rounded-full bg-emerald-500/10 pointer-events-none blur-xl"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <i className="fa-solid fa-shield-halved text-[9px]"></i>
                        <span>ID Unique d'Affiliation Planteur</span>
                      </span>
                      <span className="text-[10px] text-emerald-300 font-medium hidden sm:inline">
                        Connexion Application Mobile & Cartographie
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                      Transmettez votre Code ONG à vos Planteurs pour les synchroniser
                    </h2>
                    
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Chaque planteur de votre zone ({account.region}) doit saisir ou scanner cet identifiant unique dans son application mobile <strong className="text-emerald-300">AgroPlan CI</strong> pour que ses parcelles, ses bilans d'ombrage et ses données RDUE remontent automatiquement dans votre tableau de bord.
                    </p>
                  </div>

                  {/* Code Card with Copy & Share */}
                  <div className="bg-[#0F1B14]/90 border border-amber-400/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 shrink-0 shadow-lg">
                    <div className="text-center sm:text-left space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold block">
                        Code d'Accès ONG :
                      </span>
                      <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider block">
                        {account.ngoCode || 'ONG-ANADER-NAWA'}
                      </span>
                      <span className="text-[9px] text-stone-400">Valide pour tous vos planteurs</span>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(account.ngoCode || 'ONG-ANADER-NAWA');
                          toast.success(
                            'Code ONG Copié !',
                            `L'identifiant ${account.ngoCode || 'ONG-ANADER-NAWA'} est copié dans le presse-papier.`
                          );
                        }}
                        className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                        title="Copier le code"
                      >
                        <i className="fa-regular fa-copy text-xs"></i>
                        <span>Copier</span>
                      </button>

                      <button
                        onClick={() => setIsNgoCodeModalOpen(true)}
                        className="flex-1 sm:flex-initial bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-600 transition-colors"
                        title="Afficher le QR code et la fiche planteur"
                      >
                        <i className="fa-solid fa-qrcode text-xs text-amber-300"></i>
                        <span>QR Code & Fiche</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 4 KPIs Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1 */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Planteurs Supervisés</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                      <i className="fa-solid fa-users text-sm"></i>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900">{account.producerCount}</span>
                    <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-md">+14% ce mois</span>
                  </div>
                  <p className="text-[11px] text-stone-500">12 villages couverts dans la zone {account.region}</p>
                </div>

                {/* KPI 2 */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Taux Moyen d'Ombrage</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                      <i className="fa-solid fa-tree text-sm"></i>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900">23.8%</span>
                    <span className="text-[11px] font-bold text-[#2E7D32]">Cible &gt; 20%</span>
                  </div>
                  <p className="text-[11px] text-stone-500">88% des parcelles conformes aux normes d'ombrage</p>
                </div>

                {/* KPI 3 */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Taux de Diversification</span>
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-[#5D4037] flex items-center justify-center">
                      <i className="fa-solid fa-wheat-awn text-sm"></i>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900">79.2%</span>
                    <span className="text-[11px] font-bold text-[#5D4037] bg-stone-100 px-2 py-0.5 rounded-md">Vivriers actifs</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Banane plantain, manioc, taro & akpi</p>
                </div>

                {/* KPI 4 */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Conseils Vocaux Diffusés</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                      <i className="fa-solid fa-volume-high text-sm"></i>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-stone-900">2,410</span>
                    <span className="text-[11px] font-bold text-stone-600">Écoutes directes</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Français, Baoulé, Dioula et Bété</p>
                </div>

              </div>

              {/* Grid 2 Columns : Forest canopy & Strategy */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Left: Canopy Distribution */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-stone-900">
                        Stratification des Essences d'Ombrage
                      </h3>
                      <p className="text-xs text-stone-500">Répartition moyenne observée sur les parcelles</p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-[#2E7D32] rounded-full border border-emerald-200">
                      Audit Fév 2026
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-800">
                        <span>Framiré & Akpi (Arbres forestiers fertilitaires)</span>
                        <span className="text-[#2E7D32]">44% du couvert</span>
                      </div>
                      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="bg-[#2E7D32] h-full w-[44%] rounded-full" />
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-800">
                        <span>Bananiers Plantains (Ombrage nourricier rapide)</span>
                        <span className="text-[#5D4037]">32% du couvert</span>
                      </div>
                      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="bg-[#5D4037] h-full w-[32%] rounded-full" />
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-stone-800">
                        <span>Iroko, Kina & Bété (Essences nobles durables)</span>
                        <span className="text-[#8D6E63]">24% du couvert</span>
                      </div>
                      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="bg-[#8D6E63] h-full w-[24%] rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Densité moyenne : <strong>22 arbres/ha</strong></span>
                    <button
                      onClick={() => setActiveTab('producers')}
                      className="text-[#2E7D32] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voir le détail par producteur</span>
                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                  </div>
                </div>

                {/* Right: Quick Action Cards */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Voice Broadcast Action Card */}
                  <div className="bg-[#5D4037] text-white p-5 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <i className="fa-solid fa-tower-broadcast text-[#81C784]"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Conseil Vocal Terrain</h4>
                        <p className="text-[11px] text-stone-300">Diffusion instantanée par synthèse vocale</p>
                      </div>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      Envoyez une consigne agronomique ou une alerte météo dans la langue locale de vos producteurs.
                    </p>
                    <button
                      onClick={() => setActiveTab('voice-studio')}
                      className="w-full bg-white text-[#5D4037] hover:bg-stone-100 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Ouvrir le Studio Vocal
                    </button>
                  </div>

                  {/* Compliance Quick Status */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-award text-[#2E7D32] text-base"></i>
                        <h4 className="font-bold text-sm text-stone-900">Statut Conformité RDUE</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200">
                        100% Géoréférencé
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Toutes les parcelles supervisées sont exemptes de déforestation post-2020.
                    </p>
                    <button
                      onClick={() => setActiveTab('compliance')}
                      className="w-full bg-[#1E2D24] hover:bg-stone-900 text-white py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    >
                      Télécharger l'Attestation Officielle
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2 : REGISTRE DES PRODUCTEURS                                  */}
          {/* ================================================================= */}
          {activeTab === 'producers' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-5">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    Registre des Exploitants Supervisés
                  </h3>
                  <p className="text-xs text-stone-500">
                    Gestion des données parcellaires, taux d'ombrage et audits agronomiques
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddFarmerOpen(true)}
                    className="bg-[#2E7D32] hover:bg-[#256628] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Nouveau Producteur</span>
                  </button>

                  <button
                    onClick={() => toast.info('Export CSV', 'Fichier d\'audit généré avec succès.')}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-file-excel text-xs text-[#2E7D32]"></i>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F9F8F6] p-3 rounded-xl border border-stone-200/60">
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Rechercher par nom, village ou culture..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-800 outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 font-medium outline-none focus:border-[#2E7D32]"
                >
                  <option value="all">Tous les statuts d'ombrage</option>
                  <option value="optimal">Ombrage Optimal (≥ 20%)</option>
                  <option value="warning">À réajuster (&lt; 20%)</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-600 uppercase font-bold border-b border-stone-200">
                      <th className="py-3 px-3">Photo & Code Carte</th>
                      <th className="py-3 px-3">Producteur & Contact</th>
                      <th className="py-3 px-3">Village / Zone</th>
                      <th className="py-3 px-3">Superficie</th>
                      <th className="py-3 px-3">Taux d'Ombrage</th>
                      <th className="py-3 px-3">Statut & RDUE</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducers.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => {
                          setSelectedProducer(p);
                          setModalTab('card');
                        }}
                        className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow-2xs shrink-0 bg-stone-100">
                              {p.photoUrl ? (
                                <img
                                  src={p.photoUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-800 text-white font-bold text-xs">
                                  {p.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#1B5E20] border border-emerald-300 px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
                                <i className="fa-solid fa-id-card text-[9px] text-[#2E7D32]"></i>
                                <span>{p.farmerCardCode}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-stone-900">
                          <div className="text-xs group-hover:text-[#2E7D32] transition-colors">{p.name}</div>
                          <div className="text-[10px] font-normal text-stone-500 flex items-center gap-1 mt-0.5">
                            <span>{p.cooperative || 'Coopérative Locale'}</span>
                            <span>•</span>
                            <span>{p.phone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-600 font-medium">{p.village}</td>
                        <td className="py-3 px-3 font-bold text-stone-800">{p.size}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              p.shadeLevel === 'optimal'
                                ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                                : p.shadeLevel === 'warning'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{p.shade}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200 inline-block">
                              {p.status}
                            </span>
                            <span className="block text-[9px] text-emerald-800 font-medium">
                              <i className="fa-solid fa-circle-check text-[8px] text-emerald-600 mr-1"></i>
                              Carte {p.cardStatus || 'Active & Vérifiée'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setSelectedProducer(p);
                                setModalTab('card');
                              }}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Voir la carte officielle et photo"
                            >
                              <i className="fa-solid fa-id-card text-emerald-700"></i>
                              <span>Carte</span>
                            </button>
                            {p.cartography && (
                              <button
                                onClick={() => {
                                  setActiveCartoProducerId(p.id);
                                  setActiveTab('cartography');
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#2E7D32] border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                title="Voir la cartographie GPS du champ"
                              >
                                <i className="fa-solid fa-map-location-dot"></i>
                                <span>GPS</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducers.length === 0 && (
                <div className="text-center py-8 text-stone-500 text-xs">
                  Aucun exploitant ne correspond à votre filtre.
                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3 : CARTOGRAPHIE & OMBRAGE DES CHAMPS                         */}
          {/* ================================================================= */}
          {activeTab === 'cartography' && (
            <div className="space-y-6">
              
              {/* Top Banner with Producer Selector */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                      <i className="fa-solid fa-map-location-dot text-[#2E7D32]"></i>
                      <span>Cartographie GPS & Essences d'Ombrage par Producteur</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Visualisation interactive des parcelles, polygones GPS bornés, densité des arbres et conformité RDUE.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-[#2E7D32] rounded-full border border-emerald-200">
                      SIG Conseil Café-Cacao 2026
                    </span>
                  </div>
                </div>

                {/* Producer Quick Selector Cards */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Sélectionner un producteur pour explorer sa parcelle :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {producers.map((prod) => {
                      const isSelected = prod.id === activeCartoProducerId;
                      return (
                        <button
                          key={prod.id}
                          onClick={() => setActiveCartoProducerId(prod.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/90 border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs'
                              : 'bg-[#F9F8F6] border-stone-200/80 hover:bg-stone-100'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0 bg-stone-200 shadow-xs">
                            {prod.photoUrl ? (
                              <img
                                src={prod.photoUrl}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-emerald-800 text-white">
                                {prod.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-stone-900 truncate">{prod.name}</p>
                            <p className="text-[10px] text-stone-500 font-mono truncate">{prod.farmerCardCode}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] font-bold text-[#2E7D32] bg-emerald-100/80 px-1.5 py-0.2 rounded">
                                {prod.size}
                              </span>
                              <span className="text-[9px] text-stone-500 truncate">{prod.village}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Producer Cartography View */}
              {(() => {
                const currentProd = producers.find((p) => p.id === activeCartoProducerId) || producers[0];
                return (
                  <div className="space-y-4">
                    {/* Farmer Header Info Banner */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0">
                          {currentProd.photoUrl ? (
                            <img
                              src={currentProd.photoUrl}
                              alt={currentProd.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-800 text-white flex items-center justify-center font-bold text-base">
                              {currentProd.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-stone-900">{currentProd.name}</h3>
                            <span className="text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#1B5E20] border border-emerald-300 px-2 py-0.5 rounded">
                              {currentProd.farmerCardCode}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                            <span><i className="fa-solid fa-location-dot text-emerald-600 mr-1"></i>{currentProd.village} ({currentProd.region})</span>
                            <span>•</span>
                            <span><i className="fa-solid fa-building text-stone-400 mr-1"></i>{currentProd.cooperative}</span>
                            <span>•</span>
                            <span><i className="fa-solid fa-phone text-stone-400 mr-1"></i>{currentProd.phone}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setSelectedProducer(currentProd);
                            setModalTab('card');
                          }}
                          className="flex-1 sm:flex-initial px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-id-card text-emerald-700"></i>
                          <span>Carte Planteur</span>
                        </button>
                        <button
                          onClick={() =>
                            toast.success(
                              'Données SIG Exportées',
                              `Le fichier GeoJSON et SHP de la parcelle de ${currentProd.name} a été préparé.`
                            )
                          }
                          className="flex-1 sm:flex-initial px-3 py-2 bg-[#2E7D32] hover:bg-[#256628] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-download"></i>
                          <span>Export GeoJSON</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Map Component */}
                    {currentProd.cartography ? (
                      <ParcelCartographyViewer cartography={currentProd.cartography} />
                    ) : (
                      <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500">
                        Cartographie en cours de numérisation pour ce producteur.
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4 : CONFORMITÉ RDUE & AUDITS                                  */}
          {/* ================================================================= */}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-[#2E7D32]"></i>
                  <span>Dossier de Conformité Règlement Européen Déforestation (RDUE)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Garantie de non-déforestation post-31 décembre 2020 et traçabilité de bout en bout des fèves.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32]">Parcelles Délimitées GPS</span>
                  <p className="text-2xl font-black text-stone-900">100%</p>
                  <p className="text-xs text-stone-600">Polygones certifiés et vérifiés sur le SIG national.</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32]">Risque de Déforestation</span>
                  <p className="text-2xl font-black text-stone-900">0.0% NUL</p>
                  <p className="text-xs text-stone-600">Aucune parcelle située en forêt classée ou parc national.</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32]">Traçabilité des Lots</span>
                  <p className="text-2xl font-black text-stone-900">Certifiée</p>
                  <p className="text-xs text-stone-600">Codes producteurs adossés aux bordereaux de pesée.</p>
                </div>
              </div>

              {/* Official Attestation Card */}
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center text-xl">
                      <i className="fa-solid fa-stamp"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Attestation d'Audit Officiel AgroPlan CI</h4>
                      <p className="text-xs text-stone-500">Délivrée pour le compte de : {account.orgName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-stone-200">
                    N° CI-RDUE-2026-0841
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  L'application AgroPlan CI atteste que les {account.producerCount} producteurs audités sous la convention de {account.orgName} respectent les exigences de durabilité, d'ombrage forestier et de non-déforestation conformément aux normes ivoiriennes et européennes.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-[#2E7D32] hover:bg-[#256628] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <i className="fa-solid fa-download text-xs"></i>
                    <span>Télécharger l'Attestation (PDF)</span>
                  </button>

                  <button
                    onClick={() => toast.success('Lien copié', 'Le lien public d\'audit a été copié dans votre presse-papier.')}
                    className="bg-white hover:bg-stone-100 text-stone-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-link text-xs"></i>
                    <span>Partager l'Audit</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5 : STUDIO D'ALERTES VOCALES                                  */}
          {/* ================================================================= */}
          {activeTab === 'voice-studio' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                  <i className="fa-solid fa-tower-broadcast text-[#2E7D32]"></i>
                  <span>Studio de Diffusion des Conseils Vocaux Multilingues</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Transmettez des messages audios clairs et compréhensibles directement sur le téléphone des producteurs ruraux.
                </p>
              </div>

              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Left: Message Editor */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Langue Locale de Diffusion
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'fr', name: 'Français Facile' },
                        { id: 'baoule', name: 'Baoulé' },
                        { id: 'dioula', name: 'Dioula' },
                        { id: 'bete', name: 'Bété' },
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setBroadcastLang(lang.id as LocalLanguage)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            broadcastLang === lang.id
                              ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Texte de la consigne agronomique
                    </label>
                    <textarea
                      rows={4}
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="w-full p-3 bg-[#F9F8F6] rounded-xl border border-stone-200 text-xs text-stone-800 outline-none focus:border-[#2E7D32]"
                      placeholder="Saisissez la recommandation de terrain..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border ${
                        isPlayingVoice
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      <i className={`fa-solid ${isPlayingVoice ? 'fa-stop' : 'fa-play'} text-xs text-[#2E7D32]`}></i>
                      <span>{isPlayingVoice ? 'Arrêter l\'écoute' : 'Écouter la Synthèse Vocale'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBroadcasting}
                      onClick={handleSendLiveBroadcast}
                      className="bg-[#2E7D32] hover:bg-[#256628] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>{isBroadcasting ? 'Envoi en cours...' : `Diffuser aux ${account.producerCount} Planteurs`}</span>
                    </button>
                  </div>
                </div>

                {/* Right: Broadcast History */}
                <div className="lg:col-span-5 bg-[#F9F8F6] p-5 rounded-2xl border border-stone-200/80 space-y-3">
                  <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                    Dernières Campagnes Audios Diffusées
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between text-stone-500 text-[10px]">
                        <span className="font-bold text-[#2E7D32]">Baoulé & Français</span>
                        <span>Il y a 2 jours</span>
                      </div>
                      <p className="font-medium text-stone-800">Élagage léger et paillage au pied des cacaoyers</p>
                      <span className="text-[10px] text-stone-500">480 planteurs récepteurs (98% écoute)</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between text-stone-500 text-[10px]">
                        <span className="font-bold text-[#2E7D32]">Dioula & Bété</span>
                        <span>02 Fév 2026</span>
                      </div>
                      <p className="font-medium text-stone-800">Sensibilisation au repiquage de bananiers plantains</p>
                      <span className="text-[10px] text-stone-500">520 planteurs récepteurs (94% écoute)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6 : RAPPORTS & BILANS                                         */}
          {/* ================================================================= */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-bold text-lg text-stone-900">
                  Centre de Rapports & Bilans d'Impact
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Téléchargez les bilans d'audit agronomique pour vos bailleurs de fonds et rapports RSE.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-stone-200 bg-[#F9F8F6] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center">
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Rapport Annuel Agroforesterie 2026</h4>
                      <p className="text-xs text-stone-500">Synthèse d'impact, taux d'ombrage et vivriers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-[#1E2D24] text-white hover:bg-stone-900 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Exporter le Bilan PDF
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200 bg-[#F9F8F6] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5D4037] text-white flex items-center justify-center">
                      <i className="fa-solid fa-file-excel"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">Données Brutes & Fiches GPS (CSV)</h4>
                      <p className="text-xs text-stone-500">Coordonnées géographiques et essences par parcelle</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info('Export CSV', 'Données brutes exportées.')}
                    className="w-full bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Télécharger le Fichier CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7 : PARAMÈTRES MANDAT                                         */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-bold text-lg text-stone-900">
                  Paramètres du Compte Organisation
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Gestion des contacts référents et de la convention de supervision.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1B5E20] font-bold flex items-center gap-1.5 text-xs">
                      <i className="fa-solid fa-key text-[#2E7D32]"></i>
                      <span>Identifiant Unique d'Affiliation Planteur (Code ONG)</span>
                    </span>
                    <span className="bg-[#2E7D32] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Clé d'Accès Réseau
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-emerald-300">
                    <div>
                      <span className="font-mono text-base font-black text-stone-900 tracking-wider">
                        {account.ngoCode || 'ONG-ANADER-NAWA'}
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Code à fournir à tous les planteurs supervisés par votre entité pour la synchronisation de leurs parcelles.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(account.ngoCode || 'ONG-ANADER-NAWA');
                          toast.success('Code Copié !', `Le code ${account.ngoCode || 'ONG-ANADER-NAWA'} est copié.`);
                        }}
                        className="bg-[#2E7D32] hover:bg-[#256628] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <i className="fa-regular fa-copy text-xs"></i>
                        <span>Copier</span>
                      </button>
                      <button
                        onClick={() => setIsNgoCodeModalOpen(true)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <i className="fa-solid fa-qrcode text-xs text-[#2E7D32]"></i>
                        <span>Fiche Planteur</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Nom de l'Organisation</span>
                  <p className="font-bold text-stone-900 text-sm">{account.orgName}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Type d'Entité</span>
                  <p className="font-bold text-stone-900 text-sm">{account.orgType}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Référent Technique</span>
                  <p className="font-bold text-stone-900 text-sm">{account.contactPerson}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Email Officiel</span>
                  <p className="font-bold text-stone-900 text-sm">{account.email}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Bassin Régional</span>
                  <p className="font-bold text-stone-900 text-sm">{account.region}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-stone-500 font-medium">Convention AgroPlan</span>
                  <p className="font-bold text-[#2E7D32] text-sm">Convention Active (2026-2029)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Pour modifier les signataires officiels, contactez le support.</span>
                <button
                  onClick={() => onNavigateToPublicSite('contact')}
                  className="text-xs font-bold text-[#2E7D32] hover:underline"
                >
                  Contacter le support institutionnel
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL : FICHE & CODE D'AFFILIATION ONG POUR LES PLANTEURS             */}
      {/* ===================================================================== */}
      {isNgoCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200 border border-stone-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-lg">
                  🔑
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32] tracking-wider">
                    Accès & Synchronisation Terrain
                  </span>
                  <h3 className="font-extrabold text-base text-stone-900">
                    Code Unique ONG pour les Planteurs
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsNgoCodeModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Main Code Presentation Card */}
            <div className="bg-gradient-to-br from-[#1E2D24] to-[#15231B] text-white p-6 rounded-2xl border-2 border-amber-400 shadow-lg text-center space-y-3 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/10 rounded-full blur-lg pointer-events-none"></div>

              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block">
                {account.orgName}
              </span>

              <div className="py-2">
                <span className="text-[10px] text-stone-300 uppercase font-semibold block mb-1">
                  Code Unique de Connexion Planteur :
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-wider bg-black/40 px-4 py-2 rounded-xl inline-block border border-amber-400/60 shadow-inner">
                  {account.ngoCode || 'ONG-ANADER-NAWA'}
                </span>
              </div>

              <p className="text-xs text-stone-300">
                Zone de couverture : <strong>{account.region}</strong>
              </p>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(account.ngoCode || 'ONG-ANADER-NAWA');
                    toast.success(
                      'Code Copié !',
                      `L'identifiant ${account.ngoCode || 'ONG-ANADER-NAWA'} est copié dans le presse-papier.`
                    );
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <i className="fa-regular fa-copy text-xs"></i>
                  <span>Copier le Code</span>
                </button>

                <button
                  onClick={() => {
                    toast.info('QR Code Planteur', 'QR Code de connexion prêt pour impression et affichage dans les coopératives.');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-white/20 transition-all"
                >
                  <i className="fa-solid fa-print text-xs text-amber-300"></i>
                  <span>Imprimer l'Affiche</span>
                </button>
              </div>
            </div>

            {/* Step by step guide for NGO agents & farmers */}
            <div className="bg-[#F9F8F6] p-4 rounded-2xl border border-stone-200/80 space-y-3">
              <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                <i className="fa-solid fa-circle-info text-[#2E7D32]"></i>
                <span>Comment vos planteurs utilisent ce code ?</span>
              </h4>

              <ol className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Le planteur ouvre l'application mobile <strong>AgroPlan CI</strong> ou l'agent terrain l'assiste.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Lors de l'inscription ou de la connexion, il saisit le <strong>Code ONG : {account.ngoCode || 'ONG-ANADER-NAWA'}</strong>.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Ses parcelles de cacao, son taux d'ombrage et sa carte officielle sont instantanément rattachés à votre espace de supervision.
                  </span>
                </li>
              </ol>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-500 text-[11px]">
                Support technique : +225 27 20 00 00
              </span>
              <button
                onClick={() => setIsNgoCodeModalOpen(false)}
                className="bg-stone-900 hover:bg-black text-white px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL : AJOUT PRODUCTEUR                                              */}
      {/* ===================================================================== */}
      {isAddFarmerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2E7D32] tracking-wider">Supervision & Identification</span>
                <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                  <i className="fa-solid fa-id-card text-[#2E7D32]"></i>
                  <span>Enregistrer un Nouvel Exploitant</span>
                </h3>
              </div>
              <button
                onClick={() => setIsAddFarmerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddFarmerSubmit} className="space-y-4 text-xs">
              {/* Code Carte Planteur */}
              <div
                className={`p-3 rounded-2xl space-y-1.5 transition-colors border ${
                  isDuplicateCardCode
                    ? 'bg-red-50/90 border-red-300'
                    : 'bg-[#E8F5E9]/60 border-emerald-300/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label
                    className={`font-bold flex items-center gap-1.5 ${
                      isDuplicateCardCode ? 'text-red-800' : 'text-[#1B5E20]'
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isDuplicateCardCode ? 'fa-triangle-exclamation text-red-600' : 'fa-credit-card text-[#2E7D32]'
                      }`}
                    ></i>
                    <span>Code Carte de Planteur (Identifiant Unique) *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewFarmer({
                        ...newFarmer,
                        farmerCardCode: `CI-CCC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                      })
                    }
                    className="text-[10px] font-bold text-[#2E7D32] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <i className="fa-solid fa-arrows-rotate text-[9px]"></i>
                    <span>Générer un Nouveau Code</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newFarmer.farmerCardCode}
                    onChange={(e) => setNewFarmer({ ...newFarmer, farmerCardCode: e.target.value })}
                    placeholder="Ex : CI-CCC-2026-08491"
                    className={`w-full p-2.5 pr-8 bg-white rounded-xl border font-mono font-bold text-stone-900 outline-none transition-colors ${
                      isDuplicateCardCode
                        ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-300'
                        : 'border-emerald-300 focus:border-[#2E7D32]'
                    }`}
                  />
                  {isDuplicateCardCode ? (
                    <i className="fa-solid fa-circle-xmark text-red-500 absolute right-3 top-1/2 -translate-y-1/2 text-sm"></i>
                  ) : newFarmer.farmerCardCode.trim() ? (
                    <i className="fa-solid fa-circle-check text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 text-sm"></i>
                  ) : null}
                </div>

                {/* Real-time feedback message */}
                {isDuplicateCardCode ? (
                  <div className="bg-white/80 p-2 rounded-lg border border-red-200 text-[11px] text-red-700 flex items-start gap-1.5 animate-in fade-in duration-150">
                    <i className="fa-solid fa-circle-exclamation text-xs mt-0.5 text-red-600 shrink-0"></i>
                    <div>
                      <p className="font-bold">Code déjà attribué à un autre planteur !</p>
                      <p className="text-[10px] text-red-600">
                        Ce code appartient déjà à <strong>{existingDuplicateProducer?.name}</strong> ({existingDuplicateProducer?.village} • {existingDuplicateProducer?.cooperative}). Veuillez générer ou saisir un autre code unique.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-emerald-800">
                    Format standard Conseil du Café-Cacao. Utilisé pour la traçabilité RDUE et les paiements.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom Complet du Planteur *</label>
                <input
                  type="text"
                  required
                  value={newFarmer.name}
                  onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                  placeholder="Ex : Kouadio Konan Charles"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Coopérative / Section</label>
                  <input
                    type="text"
                    value={newFarmer.cooperative}
                    onChange={(e) => setNewFarmer({ ...newFarmer, cooperative: e.target.value })}
                    placeholder="Ex : Coop-CA Nawa"
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Village / Localité</label>
                  <input
                    type="text"
                    value={newFarmer.village}
                    onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Téléphone Mobile</label>
                  <input
                    type="text"
                    value={newFarmer.phone}
                    onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Superficie (Ha)</label>
                  <input
                    type="text"
                    value={newFarmer.size}
                    onChange={(e) => setNewFarmer({ ...newFarmer, size: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Âge Moyen du Verger</label>
                  <input
                    type="text"
                    value={newFarmer.treesAge}
                    onChange={(e) => setNewFarmer({ ...newFarmer, treesAge: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Taux d'Ombrage</label>
                  <select
                    value={newFarmer.shade}
                    onChange={(e) => setNewFarmer({ ...newFarmer, shade: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                  >
                    <option value="25% (Optimal)">25% (Optimal)</option>
                    <option value="20% (Optimal)">20% (Optimal)</option>
                    <option value="15% (Intermédiaire)">15% (Intermédiaire)</option>
                    <option value="10% (Déficitaire)">10% (Déficitaire)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Cultures & Essences Associées</label>
                <input
                  type="text"
                  value={newFarmer.crops}
                  onChange={(e) => setNewFarmer({ ...newFarmer, crops: e.target.value })}
                  placeholder="Ex : Cacao, Banane Plantain, Akpi, Framiré"
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddFarmerOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isDuplicateCardCode}
                  className={`px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    isDuplicateCardCode
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-70'
                      : 'bg-[#2E7D32] hover:bg-[#256628] text-white cursor-pointer shadow-xs'
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      isDuplicateCardCode ? 'fa-ban' : 'fa-check'
                    } text-xs`}
                  ></i>
                  <span>
                    {isDuplicateCardCode
                      ? 'Code en doublon (Bloqué)'
                      : 'Créer la Carte & Enregistrer'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL : CARTE DE PLANTEUR DIGITALE & CARTOGRAPHIE DU CHAMP            */}
      {/* ===================================================================== */}
      {selectedProducer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200 border border-stone-200">
            
            {/* Modal Header with Farmer Photo Avatar */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0 bg-stone-100">
                  {selectedProducer.photoUrl ? (
                    <img
                      src={selectedProducer.photoUrl}
                      alt={selectedProducer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                      {selectedProducer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32] tracking-wider block">
                    Fiche Planteur & Cartographie Certifiée
                  </span>
                  <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                    <span>{selectedProducer.name}</span>
                    <span className="text-[10px] font-mono font-bold bg-[#E8F5E9] text-[#1B5E20] border border-emerald-300 px-2 py-0.2 rounded">
                      {selectedProducer.farmerCardCode}
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProducer(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Sub-tabs within modal */}
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold gap-1">
              <button
                onClick={() => setModalTab('card')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  modalTab === 'card'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <i className="fa-solid fa-id-card text-emerald-600"></i>
                <span>Carte Planteur & Photo</span>
              </button>

              <button
                onClick={() => setModalTab('cartography')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  modalTab === 'cartography'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <i className="fa-solid fa-map-location-dot text-emerald-600"></i>
                <span>Cartographie GPS du Champ</span>
              </button>

              <button
                onClick={() => setModalTab('agronomy')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  modalTab === 'agronomy'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <i className="fa-solid fa-tree text-emerald-600"></i>
                <span>Données Agronomiques</span>
              </button>
            </div>

            {/* TAB 1: Digital Farmer ID Card */}
            {modalTab === 'card' && (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A2B] via-[#2D5A3F] to-[#172D21] text-white p-5 shadow-lg border border-emerald-600/40">
                  {/* Background watermark badge */}
                  <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-emerald-500/10 flex items-center justify-center pointer-events-none">
                    <i className="fa-solid fa-tree text-7xl text-emerald-400/15"></i>
                  </div>

                  {/* Top Bar with National Emblem & Chip */}
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-400/40 flex items-center justify-center text-amber-300 font-bold text-xs shadow-inner">
                        CI
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                          République de Côte d'Ivoire
                        </p>
                        <p className="text-[10px] font-extrabold text-white">
                          Carte de Planteur Conseil Café-Cacao
                        </p>
                      </div>
                    </div>

                    {/* Golden Electronic Chip */}
                    <div className="w-9 h-7 rounded bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-300 shadow-xs flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-800/30 rounded-xs grid grid-cols-2 gap-0.5 opacity-60">
                        <div className="border-r border-amber-800/30"></div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="grid grid-cols-3 gap-3 items-center">
                    {/* Farmer Photo */}
                    <div className="col-span-1 flex flex-col items-center">
                      <div className="w-20 h-24 bg-emerald-950/80 rounded-xl border-2 border-emerald-400/80 overflow-hidden shadow-md flex items-center justify-center relative">
                        {selectedProducer.photoUrl ? (
                          <img
                            src={selectedProducer.photoUrl}
                            alt={selectedProducer.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-emerald-200 p-2 text-center">
                            <i className="fa-solid fa-user text-2xl text-emerald-300 mb-1"></i>
                            <span className="text-[8px] font-bold uppercase text-stone-300">Photo Identifiée</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-center py-0.5 text-emerald-300">
                          CERTIFIÉ CCC
                        </div>
                      </div>
                      <span className="mt-1.5 text-[8px] font-bold bg-emerald-400 text-stone-900 px-2 py-0.5 rounded-full">
                        {selectedProducer.cardStatus || 'Vérifiée'}
                      </span>
                    </div>

                    {/* Farmer Details */}
                    <div className="col-span-2 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-emerald-300/80 font-bold block">
                          Code Unique de Carte
                        </span>
                        <span className="font-mono font-extrabold text-sm tracking-wider text-amber-300 bg-black/30 px-2 py-0.5 rounded-md border border-amber-400/30 inline-block">
                          {selectedProducer.farmerCardCode}
                        </span>
                      </div>

                      <div>
                        <span className="text-[8px] uppercase text-emerald-300/80 font-bold block">Titulaire</span>
                        <span className="font-bold text-white text-xs">{selectedProducer.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <span className="text-[8px] text-emerald-300/80 block">Village :</span>
                          <span className="font-semibold text-stone-200">{selectedProducer.village}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-emerald-300/80 block">Superficie :</span>
                          <span className="font-bold text-emerald-300">{selectedProducer.size}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] text-emerald-300/80 block">Coopérative :</span>
                        <span className="font-semibold text-stone-200 text-[10px]">
                          {selectedProducer.cooperative || account.orgName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Card Footer with Barcode / QR Info */}
                  <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[9px] text-emerald-200/90">
                    <span className="flex items-center gap-1 font-mono">
                      <i className="fa-solid fa-qrcode text-xs text-amber-300"></i>
                      <span>ID-NFC : {selectedProducer.farmerCardCode.replace('CI-CCC-', 'NFC-')}</span>
                    </span>
                    <span className="text-emerald-300 font-bold">Conforme Norme RDUE 2026</span>
                  </div>
                </div>

                {/* Supplementary Data Cards */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <span className="text-stone-500 text-[10px] block">Téléphone direct</span>
                    <span className="font-bold text-stone-900">{selectedProducer.phone}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                    <span className="text-stone-500 text-[10px] block">Taux d'Ombrage</span>
                    <span className="font-bold text-[#2E7D32]">{selectedProducer.shade}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Cartography GPS of Field */}
            {modalTab === 'cartography' && (
              <div className="space-y-3">
                {selectedProducer.cartography ? (
                  <ParcelCartographyViewer cartography={selectedProducer.cartography} />
                ) : (
                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
                    Cartographie en cours de synchronisation avec le cadastre national.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Agronomic details */}
            {modalTab === 'agronomy' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Âge Moyen des Arbres</span>
                    <strong className="text-stone-900 text-sm">{selectedProducer.treesAge}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Dernier Audit Réalisé</span>
                    <strong className="text-stone-900 text-sm">{selectedProducer.lastAudit}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Statut Réglementaire</span>
                    <strong className="text-emerald-700 text-sm">{selectedProducer.status}</strong>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <span className="text-stone-600 text-[10px] font-bold uppercase block">
                    Cultures & Essences d'Ombrage Recensées :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProducer.crops.map((c, i) => (
                      <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-stone-800 font-medium text-xs">
                        🌿 {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <i className="fa-solid fa-lightbulb text-amber-500"></i>
                    <span>Recommandation Agroforestière AgroPlan :</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Maintenir au minimum 18 à 25 arbres d'ombrage forestiers (Akpi, Framiré) par hectare et introduire des bananiers plantains pour renforcer la couverture végétale du sol.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() =>
                  toast.success(
                    'Carte Planteur Prête',
                    `La carte avec photo de ${selectedProducer.name} (${selectedProducer.farmerCardCode}) a été préparée pour l'impression.`
                  )
                }
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-print text-stone-600"></i>
                <span>Imprimer Carte Planteur</span>
              </button>
              <button
                onClick={() => setSelectedProducer(null)}
                className="bg-[#1E2D24] hover:bg-stone-900 text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Fermer la Fiche
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
