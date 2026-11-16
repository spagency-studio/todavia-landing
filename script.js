/* Todavía · Agenda 2027 */
(function () {
  'use strict';

  // ====== CONFIGURACIÓN: edita solo estas líneas ======
  var CHECKOUT_URL = 'https://pay.hotmart.com/E108516743S?off=3mddami5';  // link de pago de Hotmart (oferta 3mddami5)
  var HOTMART_OVERLAY = true;  // true: el pago se abre en una ventana sobre la página (widget de Hotmart); false: lleva a la página de Hotmart
  var LAUNCH_PRICE = 5;
  var REGULAR_PRICE = 10;
  // El lanzamiento termina al final del 31/12/2026 (hora de Ciudad de México, la más occidental de las grandes ciudades de la región).
  var LAUNCH_ENDS = new Date('2027-01-01T06:00:00Z');
  // =====================================================

  var hasCheckout = /^https?:\/\//.test(CHECKOUT_URL);
  var launchActive = Date.now() < LAUNCH_ENDS.getTime();
  var price = launchActive ? LAUNCH_PRICE : REGULAR_PRICE;
  var fmt = new Intl.NumberFormat('es', { minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2 });
  var label = 'USD ' + fmt.format(price);

  // Precio real según la fecha (sin contadores falsos)
  if (!launchActive) {
    document.querySelectorAll('[data-price], [data-price-big]').forEach(function (el) { el.textContent = label; });
    document.querySelectorAll('[data-launch], [data-after]').forEach(function (el) { el.hidden = true; });
  }

  // Todos los botones de compra apuntan al checkout y envían InitiateCheckout al Píxel de Meta
  var buttons = document.querySelectorAll('.js-buy');
  var overlayReady = false;

  function checkoutUrl(overlay) {
    var url = new URL(CHECKOUT_URL);
    // Pasa los parámetros de la campaña (utm_*, fbclid…) a Hotmart para no perder la atribución
    new URLSearchParams(location.search).forEach(function (v, k) { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
    if (overlay) url.searchParams.set('checkoutMode', '2');
    return url.toString();
  }

  buttons.forEach(function (a) {
    if (hasCheckout) {
      a.href = checkoutUrl(false); // destino seguro: la página de pago normal
      a.rel = 'noopener';
    }
    a.addEventListener('click', function (e) {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          value: price,
          currency: 'USD',
          content_name: 'Todavía · Agenda 2027',
          content_type: 'product',
          content_ids: ['todavia-2027']
        });
      }
      if (window.dataLayer) window.dataLayer.push({ event: 'begin_checkout', cta: a.dataset.cta });
      // Con el widget cargado, Hotmart abre el pago en una ventana sobre la página
      if (overlayReady) e.preventDefault();
    });
  });

  // Widget de Hotmart: se carga cuando la página ya está lista (no frena la carga inicial).
  // Si no carga, los botones siguen llevando a la página de pago normal.
  function loadHotmart() {
    if (!hasCheckout || !HOTMART_OVERLAY || loadHotmart.done) return;
    loadHotmart.done = true;
    buttons.forEach(function (a) { a.classList.add('hotmart-fb'); a.href = checkoutUrl(true); });
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
    document.head.appendChild(css);
    var s = document.createElement('script');
    s.src = 'https://static.hotmart.com/checkout/widget.min.js';
    s.async = true;
    s.onload = function () { overlayReady = true; };
    s.onerror = function () {
      buttons.forEach(function (a) { a.classList.remove('hotmart-fb'); a.href = checkoutUrl(false); });
    };
    document.head.appendChild(s);
  }
  if (hasCheckout && HOTMART_OVERLAY) {
    var kick = function () { setTimeout(loadHotmart, 0); };
    if (document.readyState === 'complete') kick(); else window.addEventListener('load', function () {
      ('requestIdleCallback' in window) ? requestIdleCallback(loadHotmart, { timeout: 2500 }) : setTimeout(loadHotmart, 1200);
    });
    ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, loadHotmart, { once: true, passive: true });
    });
  }

  // Botón fijo en móvil: aparece al salir del hero, se oculta cuando hay otro CTA de venta a la vista
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.hero');
  var offer = document.getElementById('oferta');
  var closing = document.querySelector('.closing');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, saleVisible = false;
    var stickyLink = sticky.querySelector('a');
    var update = function () {
      var show = !heroVisible && !saleVisible;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      stickyLink.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }, { rootMargin: '0px 0px -40% 0px' }).observe(hero.querySelector('.hero-cta'));
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen.set(en.target, en.isIntersecting); });
      saleVisible = Array.from(seen.values()).some(Boolean);
      update();
    }, { threshold: 0.15 });
    [offer, closing].forEach(function (el) { if (el) io.observe(el); });
  }

  // FAQ: solo una respuesta abierta a la vez
  var items = document.querySelectorAll('.faq details');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
