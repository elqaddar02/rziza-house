// Réglages de la boutique : c'est le seul fichier à modifier pour changer
// le numéro WhatsApp, les produits ou les prix.

// Numéro qui reçoit les commandes : indicatif pays inclus, sans + ni espaces.
const WHATSAPP_NUMBER = "212654489425";

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
    id: "khobz",
    price: 2,
    name: { fr: "Khobz beldi", ar: "الخبز البلدي" },
    description: { fr: "Le pain marocain du quotidien", ar: "الخبز ديال كل نهار" },
    tag: { fr: "L'INCONTOURNABLE", ar: "الأكثر مطلوب" },
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
    id: "batbout",
    price: 2,
    name: { fr: "Batbout", ar: "بطبوط" },
    description: { fr: "Moelleux, parfait à partager", ar: "رطب، مزيان للحشو" },
  },
];

// Also read by the WhatsApp catalogue feed (functions/catalogue.csv.js); ignored by the browser.
if (typeof module !== "undefined") module.exports = { PRODUCTS, WHATSAPP_NUMBER };
