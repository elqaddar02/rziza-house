// Logique du site : cartes produits, langue, panier et envoi de la commande sur WhatsApp.
// Les réglages (numéro, produits, prix) sont dans products.js, les textes dans translations.js.

const $ = (selector) => document.querySelector(selector);

// localStorage peut être bloqué (navigation privée) : on ignore alors simplement la sauvegarde.
const store = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  },
};

const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// Panier : { idProduit: quantité }, restauré depuis la dernière visite.
const cart = {};
const savedCart = store.get("rziza-cart") || {};
for (const id in savedCart) {
  const qty = parseInt(savedCart[id], 10);
  if (productById[id] && qty > 0) cart[id] = Math.min(qty, 99);
}

let lang = store.get("rziza-lang") || "ar";
if (!translations[lang]) lang = "ar";

let lastFocus = null;
let toastTimer;

// ---------- Helpers ----------

function t(key) {
  return translations[lang][key];
}

function productName(id) {
  return productById[id].name[lang];
}

function formatPrice(amount) {
  return amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + " " + t("currency");
}

function cartIds() {
  return PRODUCTS.map((p) => p.id).filter((id) => cart[id]);
}

function itemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotal() {
  return cartIds().reduce((sum, id) => sum + cart[id] * productById[id].price, 0);
}

function whatsappLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

// "212654489425" -> "+212 6 54 48 94 25"
function displayPhone(number) {
  const local = number.slice(3);
  return "+" + number.slice(0, 3) + " " + local[0] + " " + local.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ");
}

// Creates an element: el("span", { className: "x" }, "text", childElement)
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  node.append(...children);
  return node;
}

// Drawn illustration shown when images/<id>.jpg is missing.
function placeholderImage(product) {
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="700" height="800" viewBox="0 0 700 800">' +
    '<rect width="700" height="800" fill="#ece2cf"/>' +
    '<circle cx="350" cy="370" r="210" fill="none" stroke="#d7c6a8" stroke-width="2"/>' +
    '<circle cx="350" cy="370" r="190" fill="#e4d6bd"/>' +
    `<text x="350" y="400" text-anchor="middle" font-family="Tahoma,'Segoe UI','Geeza Pro',sans-serif" font-size="96" fill="#b96947">${escape(product.name.ar)}</text>` +
    `<text x="350" y="640" text-anchor="middle" font-family="Georgia,serif" font-size="34" letter-spacing="2" fill="#565b38">${escape(product.name.fr.toUpperCase())}</text>` +
    "</svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// Photos below the fold are only downloaded when they get close to the screen.
const lazyObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              lazyObserver.unobserve(entry.target);
              entry.target.lazyLoad();
            }
          }),
        { rootMargin: "300px" },
      )
    : null;

function whenNearScreen(node, load) {
  if (!lazyObserver) return load();
  node.lazyLoad = load;
  lazyObserver.observe(node);
}

// images/<id>.webp if it exists, else images/<id>.jpg, else the drawn placeholder stays.
const photoSources = {};

function loadProductPhoto(node, id) {
  const show = (src) => (node.style.backgroundImage = `url("${src}")`);
  if (photoSources[id]) return show(photoSources[id]);
  const tryNext = (sources) => {
    if (!sources.length) return;
    const img = new Image();
    img.onload = () => show((photoSources[id] = sources[0]));
    img.onerror = () => tryNext(sources.slice(1));
    img.src = sources[0];
  };
  tryNext([`images/${id}.webp`, `images/${id}.jpg`]);
}

// ---------- Product cards ----------

function renderProducts() {
  if (lazyObserver) document.querySelectorAll(".product-photo").forEach((node) => lazyObserver.unobserve(node));
  const cards = PRODUCTS.map((product) => {
    const photo = el("div", { className: "product-photo" });
    photo.style.backgroundImage = `url("${placeholderImage(product)}")`;
    whenNearScreen(photo, () => loadProductPhoto(photo, product.id));
    const image = el("div", { className: "product-image" }, photo);
    if (product.tag) image.append(el("span", { className: "product-tag" }, product.tag[lang]));
    const actions = el("div", { className: "card-actions" });
    actions.dataset.card = product.id;
    image.append(actions);

    const info = el(
      "div",
      { className: "product-info" },
      el("div", {}, el("h3", {}, product.name[lang]), el("p", {}, product.description[lang])),
      el("span", { className: "product-price" }, formatPrice(product.price)),
    );
    return el("article", { className: "product-card" }, image, info);
  });
  $("#productGrid").replaceChildren(...cards);
  updateCardActions();
}

// Bottom of each photo: "+ Ajouter" when the product is not selected, "− 2 +" once it is.
// Both "+" buttons carry data-add, the "−" carries data-sub (see the grid click handler).
function updateCardActions() {
  document.querySelectorAll(".card-actions").forEach((actions) => {
    const id = actions.dataset.card;
    const name = productName(id);
    if (!cart[id]) {
      const add = el("button", { className: "add-btn", type: "button" }, "+ " + t("addLabel"));
      add.dataset.add = id;
      add.setAttribute("aria-label", t("addLabel") + " " + name);
      actions.replaceChildren(add);
      return;
    }
    const minus = el("button", { type: "button" }, "−");
    minus.dataset.sub = id;
    minus.setAttribute("aria-label", t("decrease") + " " + name);
    const plus = el("button", { type: "button" }, "+");
    plus.dataset.add = id;
    plus.setAttribute("aria-label", t("increase") + " " + name);
    actions.replaceChildren(el("div", { className: "card-stepper" }, minus, el("span", {}, cart[id]), plus));
  });
}

// ---------- Language ----------

function setLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");
  document.querySelectorAll("#langBtn [data-lang]").forEach((option) => {
    option.classList.toggle("active", option.dataset.lang === lang);
  });

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    if (value !== undefined) node.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const value = t(node.dataset.i18nAria);
    if (value !== undefined) node.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((node) => {
    const value = t(node.dataset.i18nPh);
    if (value !== undefined) node.placeholder = value;
  });

  $("#contactWhatsapp").href = whatsappLink(t("contactMsg"));
  $("#heroWhatsapp").href = whatsappLink(t("contactMsg"));
  renderProducts();
  renderCart();
}

// ---------- Cart ----------

function saveCart() {
  store.set("rziza-cart", cart);
}

function updateCount() {
  const count = itemCount();
  $("#cartCount").textContent = count;
  $("#floatCount").textContent = count;
  $("#floatCount").hidden = count === 0;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// Re-rendering replaces the buttons, so focus is put back on the matching one.
function changeQty(id, delta, focusSelector) {
  cart[id] = Math.min((cart[id] || 0) + delta, 99);
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
  if (focusSelector) (document.querySelector(focusSelector) || $("#closeCart")).focus();
}

function addItem(id) {
  changeQty(id, 1);
  showToast(productName(id) + " · " + t("added"));

  const count = $("#cartCount");
  count.classList.remove("bump");
  void count.offsetWidth; // restart the animation
  count.classList.add("bump");
}

function cartRow(id) {
  const name = productName(id);

  const remove = el("button", { type: "button", className: "remove-link" }, t("remove"));
  remove.onclick = () => changeQty(id, -cart[id], "#closeCart");

  const minus = el("button", { type: "button" }, "−");
  minus.dataset.qty = id + "-minus";
  minus.setAttribute("aria-label", t("decrease") + " " + name);
  minus.onclick = () => changeQty(id, -1, `[data-qty="${id}-minus"]`);

  const plus = el("button", { type: "button" }, "+");
  plus.dataset.qty = id + "-plus";
  plus.setAttribute("aria-label", t("increase") + " " + name);
  plus.onclick = () => changeQty(id, 1, `[data-qty="${id}-plus"]`);

  return el(
    "div",
    { className: "cart-row" },
    el(
      "div",
      { className: "cart-row-info" },
      el("strong", {}, name),
      el("small", { className: "row-price" }, formatPrice(productById[id].price) + " " + t("perUnit")),
      remove,
    ),
    el("div", { className: "qty-controls" }, minus, el("span", {}, cart[id]), plus),
  );
}

function renderCart() {
  const ids = cartIds();
  const empty = ids.length === 0;
  $("#cartItems").replaceChildren(...ids.map(cartRow));
  $("#cartEmpty").hidden = !empty;
  $("#cartTotal").hidden = empty;
  $("#orderDetails").hidden = empty;
  $("#cartTotalValue").textContent = formatPrice(cartTotal());
  updateCount();
  updateCardActions();
}

function openCart() {
  lastFocus = document.activeElement;
  $("#cartOverlay").hidden = false;
  document.body.classList.add("locked");
  $("#closeCart").focus();
}

function closeCart() {
  $("#cartOverlay").hidden = true;
  document.body.classList.remove("locked");
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

// Keeps keyboard focus inside the open cart.
function trapFocus(event) {
  const focusable = [...$(".cart-panel").querySelectorAll("button,input,a[href]")].filter(
    (node) => !node.closest("[hidden]"),
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// ---------- Order details ----------

function details() {
  const city = document.querySelector('input[name="city"]:checked');
  return {
    name: $("#custName").value.trim(),
    city: city ? city.value : "sale",
    address: $("#custAddress").value.trim(),
    when: $("#custWhen").value.trim(),
  };
}

function saveDetails() {
  store.set("rziza-details", details());
}

function restoreDetails() {
  const saved = store.get("rziza-details");
  if (!saved) return;
  $("#custName").value = saved.name || "";
  $("#custAddress").value = saved.address || "";
  $("#custWhen").value = saved.when || "";
  const city = saved.city === "rabat" ? "rabat" : "sale";
  document.querySelector(`input[name="city"][value="${city}"]`).checked = true;
}

function orderMessage() {
  const d = details();
  const lines = [t("orderIntro")];
  for (const id of cartIds()) {
    lines.push(`• ${productName(id)} × ${cart[id]} (${formatPrice(cart[id] * productById[id].price)})`);
  }
  lines.push(t("totalLabel") + " : " + formatPrice(cartTotal()), "");

  if (d.name) lines.push(t("msgName") + " : " + d.name);
  lines.push(t("msgCity") + " : " + (d.city === "rabat" ? t("cityRabat") : t("citySale")));
  if (d.address) lines.push(t("msgAddress") + " : " + d.address);
  if (d.when) lines.push(t("msgWhen") + " : " + d.when);

  lines.push("", t("orderOutro"));
  return lines.join("\n");
}

function sendOrder() {
  if (!itemCount()) {
    alert(t("noItems"));
    return;
  }
  saveDetails();
  window.open(whatsappLink(orderMessage()), "_blank", "noopener");
}

// ---------- Menu ----------

function toggleMenu(open) {
  $(".nav").classList.toggle("nav-open", open);
  $("#menuBtn").setAttribute("aria-expanded", String(open));
}

// ---------- Events ----------

// The card buttons are re-created after each change, so focus is put back on the same spot.
$("#productGrid").addEventListener("click", (event) => {
  const add = event.target.closest("[data-add]");
  const sub = event.target.closest("[data-sub]");
  if (!add && !sub) return;
  const id = add ? add.dataset.add : sub.dataset.sub;
  if (add) addItem(id);
  else changeQty(id, -1);
  if (event.detail !== 0) return; // mouse/touch: no need to move focus
  const actions = document.querySelector(`.card-actions[data-card="${id}"]`);
  const target = cart[id] && sub ? actions.querySelector("[data-sub]") : actions.querySelector("[data-add]");
  if (target) target.focus();
});

// Header gets a shadow once the page is scrolled.
const header = $("#siteHeader");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Sections fade in when they come into view (skipped if the browser can't observe them).
if ("IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
}

const storyPhoto = $(".story-image-inner");
whenNearScreen(storyPhoto, () => storyPhoto.classList.add("loaded"));

// Phone number, social links and year
document.querySelectorAll("[data-phone-link]").forEach((link) => {
  link.href = "tel:+" + WHATSAPP_NUMBER;
  if (!link.querySelector("[data-phone]")) link.textContent = displayPhone(WHATSAPP_NUMBER);
});
document.querySelectorAll("[data-phone]").forEach((node) => (node.textContent = displayPhone(WHATSAPP_NUMBER)));
$("#instagramLink").href = SOCIAL_LINKS.instagram;
$("#facebookLink").href = SOCIAL_LINKS.facebook;
$("#year").textContent = new Date().getFullYear();

["#custName", "#custAddress", "#custWhen"].forEach((selector) => $(selector).addEventListener("input", saveDetails));
document.querySelectorAll('input[name="city"]').forEach((radio) => radio.addEventListener("change", saveDetails));

document.addEventListener("keydown", (event) => {
  if (!$("#cartOverlay").hidden) {
    if (event.key === "Escape") closeCart();
    else if (event.key === "Tab") trapFocus(event);
  } else if (event.key === "Escape" && $(".nav").classList.contains("nav-open")) {
    toggleMenu(false);
    $("#menuBtn").focus();
  }
});

$("#langBtn").addEventListener("click", () => {
  setLanguage(lang === "fr" ? "ar" : "fr");
  store.set("rziza-lang", lang);
});
$("#cartBtn").addEventListener("click", openCart);
$("#orderFromProducts").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", (event) => {
  if (event.target === $("#cartOverlay")) closeCart();
});
$("#sendOrder").addEventListener("click", sendOrder);
$("#browseBtn").addEventListener("click", () => {
  closeCart();
  $("#produits").scrollIntoView({ behavior: "smooth" });
});
$("#menuBtn").addEventListener("click", () => toggleMenu(!$(".nav").classList.contains("nav-open")));
document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));
$("#floatOrder").addEventListener("click", () => {
  if (itemCount()) openCart();
  else window.open(whatsappLink(t("contactMsg")), "_blank", "noopener");
});

// ---------- Start ----------

restoreDetails();
setLanguage(lang);
