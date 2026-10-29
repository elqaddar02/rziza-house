// Product feed for the WhatsApp catalogue, served at /catalogue.csv.
// Meta Commerce Manager reads it every day, so the WhatsApp catalogue follows
// public/products.js without retyping anything in the app.
// Columns: https://www.facebook.com/business/help/120325381656392
import shop from "../public/products.js";

const COLUMNS = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "google_product_category"];

// Quotes a value when it contains a comma, a quote or a line break.
function csvField(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export function onRequestGet({ request }) {
  const site = new URL(request.url).origin;
  const rows = shop.PRODUCTS.map((p) => ({
    id: p.id,
    title: `${p.name.ar} · ${p.name.fr}`,
    description: `${p.description.ar} — ${p.description.fr}`,
    availability: "in stock",
    condition: "new",
    price: p.price.toFixed(2) + " MAD",
    link: site + "/#produits",
    image_link: `${site}/images/${p.id}.jpg`,
    brand: "Rziza House",
    google_product_category: "Food, Beverages & Tobacco > Food Items > Bakery > Breads & Buns",
  }));

  const csv = [COLUMNS, ...rows.map((row) => COLUMNS.map((c) => row[c]))]
    .map((line) => line.map(csvField).join(","))
    .join("\n");

  return new Response(csv + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
