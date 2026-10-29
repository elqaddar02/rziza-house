# Rziza House

Website for **Rziza House** (دار رزيزة), a homemade Moroccan bread shop in Salé — orders are sent through WhatsApp.

## Files

- `public/products.js` — **shop settings**: WhatsApp number, social links (placeholders for now), products, prices. Edit this to add a product or change a price.
- `public/translations.js` — all French and Arabic texts.
- `public/app.js` — site logic: product cards, language, basket, WhatsApp order message.
- `public/index.html` — page structure.
- `public/theme.css` — styling and responsive layout.
- `public/images/` — product photos named after the product id (`khobz.jpg`, ...), plus `hero.jpg`, `story.jpg` and `og.jpg` (the 1200×630 image shown when the link is shared, in Arabic; bump `?v=` on its URL in `index.html` when replacing it so WhatsApp refreshes the preview).
- `public/favicon.svg` — the logo mark (arch + coiled spiral), also drawn inline in `index.html`.

Plain HTML/CSS/JS, no build step: the `public/` folder can be served by any static host.

### Adding a product

Copy a block in `PRODUCTS` in `public/products.js`, give it a new `id`, price, French and Arabic name and description, and put its photo in `public/images/<id>.jpg`.

Orders are sent to WhatsApp +212 654 489 425.

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

Placeholder photos from Wikimedia Commons are in `public/images/` (`khobz.jpg`, `msemen.jpg`, `harcha.jpg`, `batbout.jpg`). Replace them with your own photos using the same file names. If a file is missing, the card shows a drawn placeholder with the bread name.

The site prefers lighter WebP copies when they exist: `<id>.webp` (640 px wide) for products, and `hero.webp` / `story.webp` (1024 px) plus `hero-640.webp` / `story-640.webp` for phones. **When you replace a photo, delete or regenerate its `.webp` copies**, otherwise the old photo keeps showing. A product with only a `.jpg` works fine, just heavier. Product and story photos load only when they come close to the screen.

Current credits (required by the licences while these photos are used):

- khobz.jpg — "The Moroccan bread" by Bidiyoutchi, CC BY-SA 4.0
- msemen.jpg — "Msemmen" by Juan Emilio Prades Bel, CC BY-SA 4.0
- harcha.jpg — "Harcha (Homemade)" by Tamorlan, CC BY-SA 3.0
- batbout.jpg — "Batbout" by مصطفى ملو, CC BY-SA 4.0
- hero.jpg — "Moroccan breakfast" by Wimmiden, CC BY-SA 4.0
- story.jpg — "Khobz" by Meriemou, CC BY-SA 4.0

All from https://commons.wikimedia.org. The same credits are shown in the site footer.

## Prices and delivery

Prices are placeholders, set in `public/products.js` (dirhams). Delivery is offered only in Salé and Rabat. Opening hours (8h–20h) are placeholders in `public/translations.js` (`topline2`, `hoursText`).
