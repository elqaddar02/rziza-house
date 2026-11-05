// Contact card served at /rziza-house.vcf: "Save contact" on the /carte page opens it,
// and the phone offers to add دار رزيزة with the number from public/products.js.
import shop from "../public/products.js";

// vCard lines longer than 75 characters are folded: CRLF then a space.
function fold(line) {
  const parts = [];
  for (let i = 0; i < line.length; i += 74) parts.push(line.slice(i, i + 74));
  return parts.join("\r\n ");
}

function base64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export async function onRequestGet({ request, env }) {
  const site = new URL(request.url).origin;
  const phone = "+" + shop.WHATSAPP_NUMBER;

  // The logo shown on the contact; the card still works without it.
  let photo = "";
  const image = await env.ASSETS.fetch(new URL("/images/contact.jpg", site));
  if (image.ok) photo = fold("PHOTO;ENCODING=b;TYPE=JPEG:" + base64(new Uint8Array(await image.arrayBuffer())));

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;دار رزيزة;;;",
    "FN:دار رزيزة · Rziza House",
    "ORG:Rziza House",
    `TEL;TYPE=CELL,VOICE:${phone}`,
    `URL:${site}/`,
    "ADR;TYPE=WORK:;;;Salé;;;Maroc",
    "NOTE:رزيزة، مسمن، حرشة وبغرير · الطلب عبر واتساب",
    photo,
    "END:VCARD",
  ].filter(Boolean);

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="rziza-house.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
