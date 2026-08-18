import { FarmParcel, AdviceItem, RecommendedCrop } from '../types';

export const DEFAULT_PARCELS: FarmParcel[] = [
  {
    id: 'p1',
    name: 'Champ Principal (Soubré)',
    region: 'Soubré (Nawa)',
    sizeHectares: 2.5,
    cocoaTreeAgeYears: 18,
    shadeLevel: 'Faible',
    soilType: 'Sablo-argileux',
    hasWaterSource: true,
    healthScore: 78,
    shadeScore: 25,
    recommendedCrops: [
      {
        name: 'Banane Plantain',
        category: 'Vivrier',
        icon: '🍌',
        benefits: 'Protection temporaire des jeunes cacaoyers et apport de revenus réguliers avant la récolte du cacao.',
        densityAdvice: 'Planter tous les 3m entre les rangs de cacaoyers',
        waterNeed: 'Moyen'
      },
      {
        name: 'Manioc (Variété améliorée)',
        category: 'Vivrier',
        icon: '🥔',
        benefits: 'Excellente culture vivrière en bordure de parcelle, sécurité alimentaire du ménage.',
        densityAdvice: 'Planter en bordures et pare-feux autour de la parcelle',
        waterNeed: 'Faible'
      },
      {
        name: 'Akpi / Framiré (Arbres d\'ombrage)',
        category: 'Arbre d\'ombrage',
        icon: '🌳',
        benefits: 'Améliore l\'ombrage durable, régénère l\'azote du sol et protège contre le stress thermique.',
        densityAdvice: '18 à 25 arbres par hectare répartis uniformément',
        waterNeed: 'Faible'
      },
      {
        name: 'Taro / Macabo',
        category: 'Vivrier',
        icon: '🌱',
        benefits: 'Valorise les zones humides et bas-fonds de la parcelle.',
        densityAdvice: 'En bas de pente près du point d\'eau',
        waterNeed: 'Élevé'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Parcelle Régénération (San-Pédro)',
    region: 'San-Pédro',
    sizeHectares: 1.8,
    cocoaTreeAgeYears: 28,
    shadeLevel: 'Moyen',
    soilType: 'Latéritique',
    hasWaterSource: false,
    healthScore: 65,
    shadeScore: 40,
    recommendedCrops: [
      {
        name: 'Cacao Hybride Mercedes',
        category: 'Cacao',
        icon: '🍫',
        benefits: 'Mise à fruit rapide et meilleure tolérance au Swollen Shoot.',
        densityAdvice: '1333 pieds par hectare (3m x 2.5m)',
        waterNeed: 'Moyen'
      },
      {
        name: 'Banane Plantain',
        category: 'Vivrier',
        icon: '🍌',
        benefits: 'Couverture végétale rapide du sol contre l\'érosion.',
        densityAdvice: 'Ombrage provisoire durant les 3 premières années',
        waterNeed: 'Moyen'
      },
      {
        name: 'Iroko / Kinkéliba',
        category: 'Arbre d\'ombrage',
        icon: '🌳',
        benefits: 'Enrichissement du micro-climat et création d\'un patrimoine forestier.',
        densityAdvice: '15 pieds / hectare',
        waterNeed: 'Faible'
      }
    ]
  }
];

export const INITIAL_ADVICES: AdviceItem[] = [
  {
    id: 'a1',
    title: 'Planter des bananiers pour l\'ombrage temporaire',
    category: 'Agroforesterie',
    icon: '🍌',
    dateAdded: 'Aujourd\'hui',
    isCompleted: false,
    audioText: {
      fr: "Pour protéger vos jeunes cacaoyers du soleil direct, plantez des bananiers plantains entre les rangs. Ils apportent de l'ombre rapide et de la nourriture pour la famille.",
      baoule: "N'san bue man kakawo ba fin, tua n'gwaza banan ba man kakawo lie gbo. I man uningue, i man aliɛ n'go.",
      dioula: "Ka cacaodenw lakana tile la, plantain baranw turu cacaoforow cɛla. O bɛ sumo dya ni balo di sow ma.",
      bete: "Kô cocoa gbouo glou, zô banane glou legbe cocoa kô. Ô kpa glou, ô kpa lili."
    }
  },
  {
    id: 'a2',
    title: 'Associé le manioc en bordure de parcelle',
    category: 'Diversification',
    icon: '🥔',
    dateAdded: 'Hier',
    isCompleted: true,
    audioText: {
      fr: "Plantez le manioc sur les bordures de votre champ de cacao. Cela forme une barrière naturelle et garantit la subsistance pendant la saison sèche.",
      baoule: "Fa gbonua sie kakawo fie'n atii wun. I tii barrière, i man aliɛ kpoo.",
      dioula: "Manioc turu forokɛrɛw la. O bɛ gansan lakana nka ni tilema se ra, bama bɛ balo sɔrɔ.",
      bete: "Zô manioc glou cocoa lobi. Ô gue barrière, ô kpa aliɛ."
    }
  },
  {
    id: 'a3',
    title: 'Garder 18 à 25 arbres d\'ombrage par hectare',
    category: 'Agroforesterie',
    icon: '🌳',
    dateAdded: 'Il y a 3 jours',
    isCompleted: false,
    audioText: {
      fr: "Les grands arbres comme l'Akpi, le Framiré ou le Petit Piment filtrent la lumière intense et maintiennent l'humidité du sol pendant les mois chauds.",
      baoule: "Sie waka dan mun kakawo fie'n nun. Akpi ni Framiré man wuwu ba, i man asie'n ka fe.",
      dioula: "Yiri bonomaw to cacaoforo la. Akpi ni Framiré bɛ tile tilen ka dugukolo sumo mara.",
      bete: "Lô yiri mɛ cocoa kô. Akpi ni Framiré kpa sumo kô."
    }
  },
  {
    id: 'a4',
    title: 'Paillage organique au pied des cacaoyers',
    category: 'Fertilité',
    icon: '🍂',
    dateAdded: 'Cette semaine',
    isCompleted: false,
    audioText: {
      fr: "Laissez les cabosses vides et les feuilles mortes étalées autour du tronc des cacaoyers pour conserver l'eau du sol et fertiliser naturellement.",
      baoule: "Fa kakawo pokou ni wunnya mun sie kakawo bo. I ka nsuo lie, i man asie'n ye.",
      dioula: "Cacaowo fɛɛrɛw ni fura kɔrɔw bila cacaobolu kɔrɔ. O bɛ ji mara ka dugukolo nɔɔni.",
      bete: "Lô cabosse kpa cocoa blo. Ô kpa ji kô, ô kpa fɛɛrɛ."
    }
  }
];
