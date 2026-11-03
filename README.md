# Rziza House

Website for **Rziza House** (دار رزيزة), a homemade Moroccan bread shop in Salé — orders are sent through WhatsApp.

## Files

- `public/products.js` — **shop settings**: WhatsApp number, social links (placeholders for now), products, prices. Edit this to add a product or change a price.
- `public/translations.js` — all French and Arabic texts.
- `public/app.js` — site logic: product cards, language, basket, WhatsApp order message.
- `public/index.html` — page structure.
- `public/theme.css` — styling and responsive layout.
- `public/images/` — product photos named after the product id (`rziza.jpg`, ...), plus `hero.jpg` and `og.jpg` (the 1200×630 image shown when the link is shared, in Arabic; bump `?v=` on its URL in `index.html` when replacing it so WhatsApp refreshes the preview).
- `public/images/logo.png` (full logo), `public/images/logo-mark.png` (house and palm emblem, used in the header, footer and signature), `public/favicon-48.png` and `public/apple-touch-icon.png` (the house alone, for browser tabs and phone home screens).

Plain HTML/CSS/JS, no build step: the `public/` folder can be served by any static host.

### Adding a product

Copy a block in `PRODUCTS` in `public/products.js`, give it a new `id`, price, French and Arabic name and description, and put its photo in `public/images/<id>.jpg`.

Orders are sent to WhatsApp +212 618 244 620.

## Deployment

Live on Cloudflare Pages (free plan): https://rziza-house.pages.dev

Cloudflare Pages builds from GitHub on every push to `main` and publishes the `public/` folder, as set by `pages_build_output_dir` in `wrangler.jsonc`. No build step is needed. Files in `functions/` run on Cloudflare (Pages Functions).

To try the site locally with the functions: `npx wrangler pages dev` (then open http://localhost:8788).

## WhatsApp catalogue

`functions/catalogue.csv.js` serves https://rziza-house.pages.dev/catalogue.csv, a product feed built from `public/products.js` (Arabic · French name, description, price in MAD, photo `images/<id>.jpg`). Once Meta reads it, the WhatsApp catalogue follows the website: change a product in `products.js`, push, and the catalogue updates at the next daily fetch.

One-time setup (on Meta's side, menu names can vary slightly):

1. In **Meta Commerce Manager** (business.facebook.com/commerce), create a catalogue of type *E-commerce*.
2. In the catalogue: **Data sources → Add items → Data feed → Scheduled feed**, paste `https://rziza-house.pages.dev/catalogue.csv`, repeat **daily**, currency **MAD**.
3. Connect the catalogue to the WhatsApp Business number (WhatsApp Manager → **Catalogue**, or in the app under *Business tools → Catalogue* once the WhatsApp account is linked to the same Meta Business account).

Product photos in the feed must be JPG and at least 500×500 px (the current ones are).

The site was originally exported from a Hatchable project (slug `khobz-darna`) on 2026-10-27; that copy is no longer the source of truth.

## Product photos

Product photos (`rziza`, `msemen`, `harcha`, `baghrir`) are the shop's. Replace them using the same file names; the `.jpg` must be at least 500×500 px for the WhatsApp catalogue. If a file is missing, the card shows a drawn placeholder with the bread name.

The site prefers lighter WebP copies when they exist: `<id>.webp` (640 px wide) for products, and `hero.webp` (1024 px) plus `hero-640.webp` for phones. **When you replace a photo, delete or regenerate its `.webp` copies**, otherwise the old photo keeps showing. A product with only a `.jpg` works fine, just heavier. Product photos load only when they come close to the screen.

All photos on the site are the shop's own; no third-party credits are needed.

## Prices and delivery

Prices are set in `public/products.js` (dirhams). Delivery is offered only in Salé (free) and Rabat (10 DH), set by `DELIVERY_FEES` in `products.js`; the fee follows the city chosen in the basket and is added to the total and the WhatsApp message. Opening hours (8h–20h) are placeholders in `public/translations.js` (`topline2`, `hoursText`).
