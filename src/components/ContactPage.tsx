import React, { useState } from 'react';
import { PageRoute, ContactFormState } from '../types';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from './ScrollReveal';
import { motion } from 'motion/react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const toast = useToast();
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    phone: '',
    email: '',
    organization: '',
    organizationType: 'cooperative',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(
      'Message transmis avec succès !',
      `Merci ${form.name || 'cher partenaire'}, votre message a été envoyé à l'équipe AgroPlan CI.`
    );
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F9F8F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:underline mb-6 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>Retour à l'accueil</span>
        </button>

        {/* Page Header */}
        <ScrollReveal className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider bg-[#E8F5E9] border border-[#C8E6C9] px-3.5 py-1 rounded-full inline-block">
            Contact & Partenariats
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3E2723] tracking-tight">
            Parlons d'agriculture durable.
          </h1>
          <p className="text-stone-600 text-base max-w-xl mx-auto">
            Vous êtes producteur, responsable de coopérative, ONG ou acteur institutionnel ? Écrivez-nous pour échanger avec l'équipe AgroPlan CI.
          </p>
        </ScrollReveal>

        {/* Form or Confirmation */}
        <ScrollReveal delay={0.15} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto text-3xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                Message transmis avec succès !
              </h2>
              <p className="text-stone-600 max-w-md mx-auto text-sm">
                Merci {form.name || 'cher partenaire'} pour votre intérêt envers AgroPlan CI. Notre équipe prendra contact avec vous rapidement.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: '',
                    phone: '',
                    email: '',
                    organization: '',
                    organizationType: 'cooperative',
                    message: ''
                  });
                }}
                className="mt-4 bg-[#2E7D32] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-[#236327] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-left text-xs"></i>
                <span>Envoyer un autre message</span>
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-user text-stone-400 absolute left-3.5 top-3.5 text-xs"></i>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouamé N'Guessan"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Téléphone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-phone text-stone-400 absolute left-3.5 top-3.5 text-xs"></i>
                    <input
                      type="tel"
                      required
                      placeholder="+225 07 08 09 10 11"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope text-stone-400 absolute left-3.5 top-3.5 text-xs"></i>
                    <input
                      type="email"
                      placeholder="exemple@coop-cacao.ci"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Organization & Type */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Vous représentez :
                  </label>
                  <select
                    value={form.organizationType}
                    onChange={(e) => setForm({ ...form, organizationType: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] outline-none transition-all"
                  >
                    <option value="cooperative">Coopérative agricole</option>
                    <option value="producteur">Producteur individuel</option>
                    <option value="ong">ONG / Association environnementale</option>
                    <option value="institution">Institution / Programme agricole</option>
                    <option value="autre">Autre structure</option>
                  </select>
                </div>
              </div>

              {/* Organization Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Nom de l'organisation / Coopérative
                </label>
                <div className="relative">
                  <i className="fa-solid fa-building text-stone-400 absolute left-3.5 top-3.5 text-xs"></i>
                  <input
                    type="text"
                    placeholder="Ex: Coopérative COOP-CA Soubré"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                  Votre Message / Projet *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez brièvement votre besoin ou votre souhait de partenariat avec AgroPlan CI..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#5D4037] hover:bg-[#4E342E] text-white py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane text-xs text-[#81C784]"></i>
                <span>Envoyer le message</span>
              </button>
            </form>
          )}
        </ScrollReveal>

        {/* Informational Callout */}
        <ScrollReveal delay={0.25} className="mt-8 bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-6 text-center space-y-2">
          <h3 className="text-base font-bold text-[#1B5E20] flex items-center justify-center gap-2">
            <i className="fa-solid fa-handshake-angle text-[#2E7D32]"></i>
            <span>Vous êtes producteur, coopérative, ONG ou partenaire ?</span>
          </h3>
          <p className="text-xs text-stone-700 max-w-xl mx-auto leading-relaxed">
            AgroPlan CI co-construit ses modules de recommandation sur le terrain. Contactez-nous pour organiser des sessions de sensibilisation ou des tests sur vos parcelles.
          </p>
        </ScrollReveal>

      </div>
    </div>
  );
};

