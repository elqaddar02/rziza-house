# Rziza House

Website for **Rziza House** (دار رزيزة), a homemade Moroccan bread shop in Salé — orders are sent through WhatsApp.

## Files

- `public/products.js` — **shop settings**: WhatsApp number, social links (placeholders for now), products, prices. Edit this to add a product or change a price.
- `public/translations.js` — all French and Arabic texts.
- `public/app.js` — site logic: product cards, language, basket, WhatsApp order message.
- `public/index.html` — page structure.
- `public/theme.css` — styling and responsive layout.
- `public/images/` — product photos named after the product id (`khobz.jpg`, ...), plus `hero.jpg` and `story.jpg`.
- `public/favicon.svg` — the logo mark (arch + coiled spiral), also drawn inline in `index.html`.

Plain HTML/CSS/JS, no build step: the `public/` folder can be served by any static host.

### Adding a product

Copy a block in `PRODUCTS` in `public/products.js`, give it a new `id`, price, French and Arabic name and description, and put its photo in `public/images/<id>.jpg`.

Orders are sent to WhatsApp +212 654 489 425.

## Deployment

The site will be deployed on Vercel (not live yet). `vercel.json` sets the output directory to `public/` with no build or install step, so in Vercel: **Add New → Project → import `elqaddar02/rziza-house`** and deploy with the defaults. Every push to `main` then redeploys the site.

The site was originally exported from a Hatchable project (slug `khobz-darna`) on 2026-10-27; that copy is no longer the source of truth.

## Product photos

Placeholder photos from Wikimedia Commons are in `public/images/` (`khobz.jpg`, `msemen.jpg`, `harcha.jpg`, `batbout.jpg`). Replace them with your own photos using the same file names. If a file is missing, the card shows a drawn placeholder with the bread name.

Current credits (required by the licences while these photos are used):

- khobz.jpg — "The Moroccan bread" by Bidiyoutchi, CC BY-SA 4.0
- msemen.jpg — "Msemmen" by Juan Emilio Prades Bel, CC BY-SA 4.0
- harcha.jpg — "Harcha (Homemade)" by Tamorlan, CC BY-SA 3.0
- batbout.jpg — "Batbout" by مصطفى ملو, CC BY-SA 4.0
- hero.jpg — "Bread Tafrnaout Morocco" by رشيدة رقي, CC BY-SA 4.0
- story.jpg — "Khobz" by Meriemou, CC BY-SA 4.0

All from https://commons.wikimedia.org. The same credits are shown in the site footer.

## Prices and delivery

Prices are placeholders, set in `public/products.js` (dirhams). Delivery is offered only in Salé and Rabat. Opening hours (8h–20h) are placeholders in `public/translations.js` (`topline2`, `hoursText`).
