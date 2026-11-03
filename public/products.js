// Réglages de la boutique : c'est le seul fichier à modifier pour changer
// le numéro WhatsApp, les produits ou les prix.

// Numéro qui reçoit les commandes : indicatif pays inclus, sans + ni espaces.
const WHATSAPP_NUMBER = "212618244620";

// Frais de livraison en dirhams, par ville (0 = gratuite).
const DELIVERY_FEES = { sale: 0, rabat: 10 };

// Réseaux sociaux : liens provisoires ("#") à remplacer par les vrais comptes.
const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
};

// Un bloc = un produit, affiché dans cet ordre sur le site.
// Pour ajouter un produit : copiez un bloc, donnez-lui un nouvel id,
// et mettez sa photo dans images/<id>.jpg (sinon une illustration s'affiche).
// price : prix en dirhams (provisoires pour l'instant).
// tag : petite étiquette sur la photo (facultatif).
const PRODUCTS = [
  {
    id: "rziza",
    price: 6,
    name: { fr: "Rziza", ar: "رزيزة" },
    description: {
      fr: "Notre spécialité, filée à la main, fine et dorée",
      ar: "الاختصاص ديالنا، مخدومة باليد، رقيقة ومحمرة",
    },
    tag: { fr: "NOTRE SPÉCIALITÉ", ar: "الاختصاص ديال الدار" },
  },
  {
    id: "msemen",
    price: 3,
    name: { fr: "Msemen", ar: "مسمن" },
    description: { fr: "Feuilleté, doré et généreux", ar: "مورق ومحمر مزيان" },
  },
  {
    id: "harcha",
    price: 3,
    name: { fr: "Harcha", ar: "حرشة" },
    description: { fr: "La douceur de la semoule", ar: "بالسميدة، رطبة وبنينة" },
  },
  {
    id: "baghrir",
    price: 3,
    name: { fr: "Baghrir", ar: "بغرير" },
    description: { fr: "La crêpe aux mille trous, légère et moelleuse", ar: "خفيف ورطب، بألف ثقبة" },
  },
];

// Also read by the WhatsApp catalogue feed (functions/catalogue.csv.js); ignored by the browser.
if (typeof module !== "undefined") module.exports = { PRODUCTS, WHATSAPP_NUMBER };
