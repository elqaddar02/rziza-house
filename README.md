# Rziza House

Website source exported from the existing Hatchable project **Rziza House** (slug: `khobz-darna`).

## Files

- `public/products.js` — **shop settings**: WhatsApp number, products, prices. Edit this to add a product or change a price.
- `public/translations.js` — all French and Arabic texts.
- `public/app.js` — site logic: product cards, language, basket, WhatsApp order message.
- `public/index.html` — page structure.
- `public/theme.css` — styling and responsive layout.
- `public/images/` — product photos, named after the product id (`khobz.jpg`, ...).

Plain HTML/CSS/JS, no build step: upload the `public/` folder to any static host.

### Adding a product

Copy a block in `PRODUCTS` in `public/products.js`, give it a new `id`, price, French and Arabic name and description, and put its photo in `public/images/<id>.jpg`.

The live Hatchable project remains the deployment source. This repository is a copy of the site files as exported on 2026-10-27; it does not include Hatchable credentials, deployment history, or database data. Orders are sent to WhatsApp +212 654 489 425.

## Product photos

Placeholder photos from Wikimedia Commons are in `public/images/` (`khobz.jpg`, `msemen.jpg`, `harcha.jpg`, `batbout.jpg`). Replace them with your own photos using the same file names. If a file is missing, the card shows a drawn placeholder with the bread name.

Current credits (required by the licences while these photos are used):

- khobz.jpg — "The Moroccan bread" by Bidiyoutchi, CC BY-SA 4.0
- msemen.jpg — "Msemmen" by Juan Emilio Prades Bel, CC BY-SA 4.0
- harcha.jpg — "Harcha (Homemade)" by Tamorlan, CC BY-SA 3.0
- batbout.jpg — "Batbout" by مصطفى ملو, CC BY-SA 4.0

All from https://commons.wikimedia.org.

## Prices and delivery

Prices are placeholders, set in `public/products.js` (dirhams). Delivery is offered only in Salé and Rabat.
