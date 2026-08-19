import React, { useState } from 'react';
import { PageRoute, PartnerAccount, OrgType, LocalLanguage } from '../types';
import { useToast } from '../context/ToastContext';
import { NgoDashboardApp } from './NgoDashboardApp';
import { AgroPlanLogo } from './AgroPlanLogo';
import { DEMO_PARTNER_ACCOUNTS } from '../data/partnersData';

interface NgoPortalPageProps {
  onNavigate: (route: PageRoute, sectionId?: string) => void;
  onDashboardActiveChange?: (active: boolean) => void;
  initialAccount?: PartnerAccount | null;
}

export const NgoPortalPage: React.FC<NgoPortalPageProps> = ({
  onNavigate,
  onDashboardActiveChange,
}) => {
  const toast = useToast();
  const [currentAccount, setCurrentAccount] = useState<PartnerAccount | null>(null);

  // Registration Form State
  const [registerForm, setRegisterForm] = useState({
    orgName: '',
    orgType: 'ONG Environnementale' as OrgType,
    contactPerson: '',
    roleTitle: 'Coordinateur Projets Durabilité',
    email: '',
    phone: '',
    region: 'Soubré (Région de la Nawa)',
    producerCount: '350',
    targetObjective: 'Conformité RDUE et Reboisement',
    description: '',
  });

  // Login existing partner modal / toggle
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Handle setting active account
  const handleActivateAccount = (account: PartnerAccount) => {
    setCurrentAccount(account);
    if (onDashboardActiveChange) {
      onDashboardActiveChange(true);
    }
    toast.success(
      'Console Institutionnelle Activée !',
      `Bienvenue à ${account.orgName}. Redirection immédiate vers votre espace de supervision dédié.`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentAccount(null);
    if (onDashboardActiveChange) {
      onDashboardActiveChange(false);
    }
    toast.info('Session Clôturée', 'Vous êtes déconnecté de la console de supervision.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Registration Form
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.orgName.trim() || !registerForm.email.trim()) {
      toast.error(
        'Champs obligatoires manquants',
        'Veuillez renseigner le nom de l\'organisation et l\'email professionnel.'
      );
      return;
    }

    const newAccount: PartnerAccount = {
      id: `ngo-${Date.now()}`,
      orgName: registerForm.orgName,
      orgType: registerForm.orgType,
      contactPerson: `${registerForm.contactPerson || 'Responsable Projets'} (${registerForm.roleTitle || 'Superviseur'})`,
      email: registerForm.email,
      phone: registerForm.phone || '+225 07 00 00 00 00',
      region: registerForm.region,
      producerCount: Number(registerForm.producerCount) || 200,
      registrationDate: 'Aujourd\'hui',
      badgeColor:
        registerForm.orgType === 'ONG Environnementale'
          ? 'bg-emerald-100 text-[#2E7D32] border-emerald-300'
          : registerForm.orgType === 'Institution Publique / ANADER'
          ? 'bg-amber-100 text-amber-900 border-amber-300'
          : 'bg-[#1E2D24] text-white border-stone-800',
      logoEmoji:
        registerForm.orgType === 'ONG Environnementale'
          ? '🌱'
          : registerForm.orgType === 'Institution Publique / ANADER'
          ? '🏛️'
          : '🤝',
      description:
        registerForm.description ||
        'Supervision agroécologique, suivi des taux d\'ombrage et conformité RDUE des parcelles en Côte d\'Ivoire.',
    };

    handleActivateAccount(newAccount);
  };

  // =========================================================================
  // VUE 1 : DASHBOARD DÉDIÉ (HORS DU SITE PUBLIC)
  // =========================================================================
  if (currentAccount) {
    return (
      <NgoDashboardApp
        account={currentAccount}
        onLogout={handleLogout}
        onNavigateToPublicSite={(route) => {
          handleLogout();
          onNavigate(route || 'landing');
        }}
      />
    );
  }

  // =========================================================================
  // VUE 2 : PAGE PUBLIQUE DE PRÉSENTATION & FORMULAIRE D'INSCRIPTION
  // =========================================================================
  return (
    <div className="pt-24 pb-24 bg-[#F9F8F6] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* En-tête & Proposition de Valeur pour les ONG & Institutions */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#EFEBE9] text-[#5D4037] border border-[#D7CCC8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-building text-xs text-[#2E7D32]"></i>
            <span>Plateforme Partenaire • ONG & Institutions</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3E2723] tracking-tight leading-tight">
            Pilotez la transition agroécologique et la conformité de vos filières
          </h1>
          
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            AgroPlan CI met à la disposition des ONG, institutions publiques (ANADER, MINADER) et coopératives faitières une console de supervision agronomique complète : suivi du couvert d'ombrage, conformité RDUE, traçabilité et diffusion de conseils audio multilingues.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#registration-form"
              className="bg-[#2E7D32] hover:bg-[#236327] text-white px-6 py-3 rounded-full font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-user-plus text-xs"></i>
              <span>Inscrire mon Organisation</span>
            </a>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 px-5 py-3 rounded-full font-bold text-xs transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-right-to-bracket text-xs text-[#2E7D32]"></i>
              <span>Accéder aux Comptes Partenaires Démo</span>
            </button>
          </div>
        </div>

        {/* 4 Piliers institutionnels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-lg">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="font-bold text-sm text-stone-900">Conformité RDUE & Zéro Déforestation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cartographie géoréférencée des vergers, vérification des parcelles contre la déforestation et rapports d'audit prêts pour l'exportation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFEBE9] text-[#5D4037] flex items-center justify-center text-lg">
              <i className="fa-solid fa-tree"></i>
            </div>
            <h3 className="font-bold text-sm text-stone-900">Agroforesterie de Précision</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Surveillance du taux d'ombrage effectif (Akpi, Framiré, Iroko) et conseils sur-mesure pour préserver les sols et le microclimat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
              <i className="fa-solid fa-volume-high"></i>
            </div>
            <h3 className="font-bold text-sm text-stone-900">Conseils Vocaux Multilingues</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Diffusez directement des alertes en Français, Baoulé, Dioula et Bété directement accessibles hors-ligne par les planteurs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg">
              <i className="fa-solid fa-wheat-awn"></i>
            </div>
            <h3 className="font-bold text-sm text-stone-900">Résilience Vivrière</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Modélisation de l'association cacaoyer + banane plantain, manioc et taro pour accroître l'autonomie financière des ménages.
            </p>
          </div>
        </div>

        {/* Accès Rapide Démo pour les évaluateurs et partenaires */}
        <div className="bg-gradient-to-r from-[#1E2D24] to-[#2E4234] text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                Espace Démo Rapide • 1 Clic
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Tester immédiatement la Console Institutionnelle
              </h3>
              <p className="text-xs text-stone-300">
                Sélectionnez une organisation partenaire pré-configurée pour visualiser le tableau de bord en direct.
              </p>
            </div>

            <button
              onClick={() => window.open('/dashboard', '_blank')}
              className="self-start sm:self-auto bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              title="Ouvrir le dashboard directement dans un nouvel onglet"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              <span>Ouvrir sur une Autre Page</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {DEMO_PARTNER_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                className="bg-white/10 hover:bg-white/15 border border-white/15 p-4 rounded-2xl transition-all group space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{acc.logoEmoji}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      {acc.producerCount} Planteurs
                    </span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {acc.orgName}
                    </h4>
                    <p className="text-[10px] text-stone-300 mt-0.5">{acc.region}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => window.open('/dashboard', '_blank')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Ouvrir ce compte dans un nouvel onglet"
                  >
                    <span>Autre Page</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                  </button>

                  <button
                    onClick={() => handleActivateAccount(acc)}
                    className="bg-white/10 hover:bg-white/25 text-stone-200 hover:text-white text-[11px] font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                    title="Ouvrir dans cette fenêtre"
                  >
                    <span>Ici</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire d'Adhésion & Inscription Officielle */}
        <div id="registration-form" className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-md space-y-8">
          <div className="border-b border-stone-100 pb-5">
            <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2.5">
              <i className="fa-solid fa-circle-plus text-[#2E7D32]"></i>
              <span>Formulaire d'Inscription & Déploiement Partenaire</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              Renseignez votre organisation pour recevoir une convention d'accès et être redirigé vers votre espace de gestion dédié hors du site vitrine.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            
            {/* Ligne 1 : Organisation & Type */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Dénomination de l'Organisation *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.orgName}
                  onChange={(e) => setRegisterForm({ ...registerForm, orgName: e.target.value })}
                  placeholder="Ex: ONG Solidarité Forêt & Cacao"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Typologie Institutionnelle *
                </label>
                <select
                  value={registerForm.orgType}
                  onChange={(e) => setRegisterForm({ ...registerForm, orgType: e.target.value as OrgType })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all bg-white"
                >
                  <option value="ONG Environnementale">ONG Environnementale & Développement</option>
                  <option value="Coopérative Faitière">Coopérative Faitière / Union de Coopératives</option>
                  <option value="Institution Publique / ANADER">Institution Publique / Agence de Développement (ANADER, MINADER)</option>
                  <option value="Bailleur & Centre de Recherche">Bailleur International / Centre de Recherche Agronomique</option>
                </select>
              </div>
            </div>

            {/* Ligne 2 : Contact & Fonction */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nom & Prénoms du Référent *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.contactPerson}
                  onChange={(e) => setRegisterForm({ ...registerForm, contactPerson: e.target.value })}
                  placeholder="Ex: Dr. Kouassi Koffi Sylvain"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Fonction / Responsabilité au sein du projet *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.roleTitle}
                  onChange={(e) => setRegisterForm({ ...registerForm, roleTitle: e.target.value })}
                  placeholder="Ex: Responsable Durabilité & Traçabilité RSE"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Ligne 3 : Coordonnées */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Professionnel / Institutionnel *
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="direction.projets@organisation-ci.org"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Téléphone Professionnel / Ligne WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  placeholder="+225 07 01 02 03 04"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Ligne 4 : Région & Taille de cohorte */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Bassin Cacaoyer d'Intervention Principal *
                </label>
                <select
                  value={registerForm.region}
                  onChange={(e) => setRegisterForm({ ...registerForm, region: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all bg-white"
                >
                  <option>Soubré & Région de la Nawa</option>
                  <option>San-Pédro, Sassandra & Bas-Sassandra</option>
                  <option>Daloa, Issia & Haut-Sassandra</option>
                  <option>Abengourou & Indénié-Djuablin</option>
                  <option>Gagnoa & Région du Gôh</option>
                  <option>Man, Duekoué & Région du Tonkpi</option>
                  <option>Couverture Nationale (Multi-régions)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Volume Estimé de Producteurs à Encadrer
                </label>
                <input
                  type="number"
                  value={registerForm.producerCount}
                  onChange={(e) => setRegisterForm({ ...registerForm, producerCount: e.target.value })}
                  placeholder="Ex: 500"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Ligne 5 : Description du Projet */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Objectifs Spécifiques du Programme de Durabilité
              </label>
              <textarea
                rows={3}
                value={registerForm.description}
                onChange={(e) => setRegisterForm({ ...registerForm, description: e.target.value })}
                placeholder="Ex: Distribution de 15 000 plants agroforestiers, conformité aux exigences RDUE, diffusion de conseils audio en Baoulé et autonomisation des femmes par la culture du manioc."
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] text-sm outline-none transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#5D4037] hover:bg-[#4E342E] text-white py-4 px-6 rounded-full font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <i className="fa-solid fa-shield-halved text-lg text-[#81C784]"></i>
                <span>Valider l'Inscription et Accéder au Dashboard Dédié</span>
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Modal Accès Partenaires Démo */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#2E7D32]">Accès Partenaire</span>
                <h3 className="font-extrabold text-base text-stone-900">Comptes Démo Pré-configurés</h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Sélectionnez un compte pour accéder immédiatement au tableau de bord sans remplir le formulaire :
            </p>

            <div className="space-y-3">
              {DEMO_PARTNER_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-2xl border border-stone-200 hover:border-[#2E7D32] hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{acc.logoEmoji}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {acc.orgName}
                      </h4>
                      <p className="text-[11px] text-stone-500">{acc.region} • {acc.producerCount} planteurs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        window.open('/dashboard', '_blank');
                      }}
                      className="bg-[#2E7D32] hover:bg-[#236327] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Ouvrir dans une nouvelle page"
                    >
                      <span>Autre page</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    </button>

                    <button
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        handleActivateAccount(acc);
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                      title="Ouvrir ici"
                    >
                      Ici
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NgoPortalPage;
