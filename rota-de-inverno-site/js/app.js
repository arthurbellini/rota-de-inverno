/* =========================================================================
   APP.JS — interatividade do site. Edições do usuário (cotação, valores de
   orçamento, status de reservas) persistem em localStorage do navegador.
   ========================================================================= */

const STORE_KEY = "rota-inverno-2026-v1";

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveStore(store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) {}
}
const store = loadStore();

// Quando os padrões do orçamento/reservas mudam (DATA_VERSION), descarta edições antigas
// desses dois blocos, mantendo tema, cotação e checklist.
if (store.dataVersion !== DATA_VERSION) {
  delete store.budget;
  delete store.reservas;
  store.dataVersion = DATA_VERSION;
  saveStore(store);
}

/* ---------------- Utilidades gerais ---------------- */
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function mapsLink(query) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}
function copyText(text, btn) {
  const done = () => {
    if (!btn) return;
    const old = btn.dataset.label || btn.textContent;
    btn.dataset.label = old;
    btn.textContent = "Copiado";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = old; btn.classList.remove("copied"); }, 1400);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, done);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove(); done();
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-copy]");
  if (b) copyText(b.dataset.copy, b);
});

/* ---------------- Tema claro/escuro ---------------- */
(function initTheme() {
  const saved = store.theme || null;
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  const applyIcon = () => {
    const current = document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    btn.textContent = current === "dark" ? "☀" : "◐";
    btn.setAttribute("aria-label", current === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", current === "dark" ? "#0d1420" : "#f1ede4");
  };
  applyIcon();
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.theme = next;
    saveStore(store);
    applyIcon();
    if (window._routeMap) setTimeout(() => window._routeMap.invalidateSize(), 250);
  });
})();

/* ---------------- Menu mobile ---------------- */
(function initMobileNav() {
  const btn = document.getElementById("mobileMenuBtn");
  const nav = document.getElementById("mobileNav");
  btn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
})();

/* ---------------- Scroll progress + nav ativo ---------------- */
(function initScroll() {
  const bar = document.getElementById("scrollProgress");
  const navLinks = [...document.querySelectorAll("[data-nav]")];

  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
})();

/* ---------------- Utilidades de dinheiro ---------------- */
function getRate() {
  return Number(store.rate || TRIP_META.defaultRate);
}
function fmtEUR(v) {
  if (v === null || v === undefined) return "—";
  return "€ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtBRL(v) {
  if (v === null || v === undefined) return "—";
  return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
/* Anima um número de valor antigo -> novo dentro de um elemento (usado no orçamento) */
function animateNumber(el, targetValue, formatFn) {
  if (!el) return;
  const from = Number(el.dataset.rawValue || 0);
  const to = Number(targetValue) || 0;
  el.dataset.rawValue = to;
  if (PREFERS_REDUCED_MOTION || Math.abs(to - from) < 0.005) {
    el.textContent = formatFn(to);
    return;
  }
  const start = performance.now();
  const dur = 550;
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatFn(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = formatFn(to);
  }
  requestAnimationFrame(tick);
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function cityName(id) { const c = CITIES.find((c) => c.id === id); return c ? c.name : id; }

/* ---------------- Lightbox (navegável quando o local tem várias fotos) ---------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCount = document.getElementById("lightboxCount");
let lightboxSet = [];
let lightboxIndex = 0;

function renderLightboxSlide() {
  const img = lightboxSet[lightboxIndex];
  if (!img) return;
  lightboxImg.src = img.imageUrl;
  lightboxImg.alt = img.caption || "";
  let capHtml = `<strong>${img.caption || ""}</strong>`;
  if (img.author || img.license) {
    capHtml += `<br>Foto: ${img.author || "Wikimedia Commons"} · ${img.license || ""}`;
    if (img.commonsPageUrl) capHtml += ` · <a href="${img.commonsPageUrl}" target="_blank" rel="noopener">ver fonte</a>`;
  }
  lightboxCap.innerHTML = capHtml;
  const multi = lightboxSet.length > 1;
  lightboxPrev.hidden = !multi;
  lightboxNext.hidden = !multi;
  lightboxCount.hidden = !multi;
  if (multi) lightboxCount.textContent = `${lightboxIndex + 1} / ${lightboxSet.length}`;
}
function openLightbox(img, set, index) {
  lightboxSet = set && set.length ? set : [img];
  lightboxIndex = index || Math.max(0, lightboxSet.indexOf(img));
  renderLightboxSlide();
  lightbox.classList.add("open");
}
function lightboxStep(dir) {
  if (!lightboxSet.length) return;
  lightboxIndex = (lightboxIndex + dir + lightboxSet.length) % lightboxSet.length;
  renderLightboxSlide();
}
document.getElementById("lightboxClose").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
lightboxPrev.addEventListener("click", () => lightboxStep(-1));
lightboxNext.addEventListener("click", () => lightboxStep(1));
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowLeft") lightboxStep(-1);
  if (e.key === "ArrowRight") lightboxStep(1);
});

const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getPlaceGallery(placeId) {
  const primary = PLACE_IMAGES[placeId];
  const extras = (typeof PLACE_IMAGES_EXTRA !== "undefined" && PLACE_IMAGES_EXTRA[placeId]) || [];
  const all = [primary, ...extras].filter((i) => i && i.imageUrl);
  return all;
}

const ICON_CHEVRON_LEFT = `<svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_CHEVRON_RIGHT = `<svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function placeCarouselHTML(placeId, fallbackLabel, featured, blockIndex) {
  const images = getPlaceGallery(placeId);
  const blockCls = "place-block" + (featured ? " featured" : "");
  const delayStyle = `style="animation-delay:${Math.min(blockIndex || 0, 5) * 90}ms"`;

  if (!images.length) {
    return `<div class="${blockCls} empty" ${delayStyle}>
      <div class="carousel"><div class="gallery-placeholder">❄ ${fallbackLabel}<br><span style="opacity:.7">foto a confirmar</span></div></div>
    </div>`;
  }

  const slides = images.map((img, i) => `
    <div class="carousel-slide" data-index="${i}">
      <img src="${img.imageUrl}" alt="${img.caption || fallbackLabel}" ${i > 0 ? 'loading="lazy"' : ""}>
      <div class="carousel-cap">${img.caption || fallbackLabel}</div>
    </div>`).join("");

  const dots = images.length > 1
    ? `<div class="carousel-dots">${images.map((_, i) => `<button data-index="${i}" class="${i === 0 ? "active" : ""}" aria-label="Foto ${i + 1}"></button>`).join("")}</div>`
    : "";
  const arrows = images.length > 1
    ? `<button class="carousel-arrow prev" data-dir="-1" aria-label="Foto anterior">${ICON_CHEVRON_LEFT}</button>
       <button class="carousel-arrow next" data-dir="1" aria-label="Próxima foto">${ICON_CHEVRON_RIGHT}</button>`
    : "";
  const count = images.length > 1 ? `<div class="place-count">1 / ${images.length}</div>` : "";

  return `<div class="${blockCls}" data-place="${placeId}" ${delayStyle}>
    <div class="carousel">
      <div class="carousel-track">${slides}</div>
      ${arrows}
      ${dots}
      ${count}
    </div>
  </div>`;
}

function wireCarousels(root) {
  root.querySelectorAll(".place-block[data-place]").forEach((block) => {
    const track = block.querySelector(".carousel-track");
    const slides = [...block.querySelectorAll(".carousel-slide")];
    const dots = [...block.querySelectorAll(".carousel-dots button")];
    const countEl = block.querySelector(".place-count");
    if (slides.length === 0) return;

    function goTo(i) {
      const idx = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
    }
    function updateActive() {
      const idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      if (countEl) countEl.textContent = `${idx + 1} / ${slides.length}`;
    }

    block.querySelectorAll(".carousel-arrow").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        goTo(idx + Number(btn.dataset.dir));
      });
    });
    dots.forEach((d) => d.addEventListener("click", (e) => { e.stopPropagation(); goTo(Number(d.dataset.index)); }));
    track.addEventListener("scroll", () => {
      clearTimeout(track._scrollT);
      track._scrollT = setTimeout(updateActive, 80);
    }, { passive: true });

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        const placeId = block.dataset.place;
        const images = getPlaceGallery(placeId);
        const idx = Number(slide.dataset.index);
        if (images[idx]) openLightbox(images[idx], images, idx);
      });
    });

    if (slides.length > 1 && !PREFERS_REDUCED_MOTION) {
      let timer = setInterval(() => {
        const idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        goTo((idx + 1) % slides.length);
      }, 4800);
      block.addEventListener("mouseenter", () => clearInterval(timer));
      block.addEventListener("touchstart", () => clearInterval(timer), { passive: true });
    }
  });
}

/* ---------------- Status da viagem (antes / durante / depois) ---------------- */
function todayISO() {
  // ?hoje=AAAA-MM-DD simula outra data (para pré-visualizar o modo "hoje")
  const sim = new URLSearchParams(location.search).get("hoje");
  if (/^\d{4}-\d{2}-\d{2}$/.test(sim || "")) return sim;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const TODAY_ISO = todayISO();
const TODAY_DAY = DAYS.find((d) => d.date === TODAY_ISO) || null;

function getNowMinutes() {
  const now = new Date();
  let mins = now.getHours() * 60 + now.getMinutes();
  const sim = /^(\d{1,2}):(\d{2})$/.exec(new URLSearchParams(location.search).get("hora") || "");
  if (sim) mins = Number(sim[1]) * 60 + Number(sim[2]);
  return mins;
}
// Índice da última atividade com horário HH:MM já iniciada (-1 se nenhuma)
function currentActivityIndex(day) {
  const now = getNowMinutes();
  let idx = -1;
  day.activities.forEach((act, i) => {
    const m = /^(\d{1,2}):(\d{2})/.exec(act.time);
    if (m && Number(m[1]) * 60 + Number(m[2]) <= now) idx = i;
  });
  return idx;
}
function nextTimedActivity(day) {
  const idx = currentActivityIndex(day);
  return day.activities.find((a, i) => i > idx && /^\d{1,2}:\d{2}/.test(a.time)) || null;
}
function daysBetween(isoA, isoB) {
  const a = new Date(isoA + "T00:00:00");
  const b = new Date(isoB + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

function updateLiveStatusText() {
  const textEl = document.querySelector("#tripStatus .trip-status-text");
  if (!textEl || !TODAY_DAY) return;
  const next = nextTimedActivity(TODAY_DAY);
  const short = next ? (next.text.length > 70 ? next.text.slice(0, 67) + "…" : next.text) : "";
  textEl.textContent = next
    ? `Dia ${TODAY_DAY.n} · próxima: ${next.time} ${short}`
    : `Hoje é o Dia ${TODAY_DAY.n} da viagem — ${TODAY_DAY.title}`;
}

// Atualiza a cada minuto durante a viagem sem recriar o painel (preserva o carrossel).
function refreshLive() {
  if (!TODAY_DAY) return;
  updateLiveStatusText();
  if (activeDay !== TODAY_DAY.n) return;
  const idx = currentActivityIndex(TODAY_DAY);
  dayPanel.querySelectorAll(".timeline-item").forEach((el, i) => {
    el.classList.remove("past", "now", "upcoming");
    el.classList.add(i < idx ? "past" : i === idx ? "now" : "upcoming");
    const dot = el.querySelector(".timeline-now-dot");
    if (i === idx && !dot) el.insertAdjacentHTML("afterbegin", '<span class="timeline-now-dot"></span>');
    if (i !== idx && dot) dot.remove();
  });
}
if (TODAY_DAY) setInterval(refreshLive, 60000);

function initTripStatus() {
  const el = document.getElementById("tripStatus");
  if (!el) return;
  const textEl = el.querySelector(".trip-status-text");
  const ctaEl = el.querySelector(".trip-status-cta");
  const firstDay = DAYS[0], lastDay = DAYS[DAYS.length - 1];

  if (TODAY_DAY) {
    el.classList.add("is-live");
    updateLiveStatusText();
    ctaEl.textContent = "Ver roteiro de hoje →";
  } else if (TODAY_ISO < firstDay.date) {
    const n = daysBetween(TODAY_ISO, firstDay.date);
    el.classList.add("is-countdown");
    textEl.textContent = n === 1 ? "Falta 1 dia para a viagem começar" : `Faltam ${n} dias para a viagem começar`;
    ctaEl.textContent = "Ver roteiro completo →";
  } else if (TODAY_ISO > lastDay.date) {
    el.classList.add("is-done");
    textEl.textContent = "Viagem concluída — reviva o roteiro completo";
    ctaEl.textContent = "Ver roteiro →";
  } else {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.addEventListener("click", () => {
    if (TODAY_DAY) {
      activeDay = TODAY_DAY.n;
      renderDayRail();
      renderDayPanel();
      if (typeof window.updateMapDay === "function") window.updateMapDay(activeDay);
    }
  });
}

/* ---------------- Roteiro: rail + painel ---------------- */
const dayRail = document.getElementById("dayRail");
const dayPanel = document.getElementById("dayPanel");
let activeDay = TODAY_DAY ? TODAY_DAY.n : 1;

function worstAlertLevel(day) {
  if (day.alerts.some((a) => a.level === "danger")) return "danger";
  if (day.alerts.some((a) => a.level === "warning")) return "warning";
  if (day.alerts.some((a) => a.level === "info")) return "info";
  return null;
}
const levelColor = { danger: "var(--danger)", warning: "var(--warning)", info: "var(--info)" };

function renderDayRail() {
  dayRail.innerHTML = DAYS.map((day) => {
    const level = worstAlertLevel(day);
    const dot = level ? `<span class="day-pill-dot" style="background:${levelColor[level]}"></span>` : "";
    const isToday = TODAY_DAY && day.n === TODAY_DAY.n;
    const cls = ["day-pill", day.n === activeDay ? "active" : "", isToday ? "today" : ""].filter(Boolean).join(" ");
    const todayTag = isToday ? `<span class="day-pill-today-tag">HOJE</span>` : "";
    return `<button class="${cls}" data-day="${day.n}" ${day.n === activeDay ? 'aria-current="true"' : ""} aria-label="Dia ${day.n}, ${day.weekday}, ${fmtDate(day.date)}: ${escapeHtml(day.title)}">
      ${todayTag}
      <div class="day-pill-n">DIA ${String(day.n).padStart(2, "0")}${dot}</div>
      <div class="day-pill-date">${day.weekday.split("-")[0]}, ${fmtDate(day.date)}</div>
      <div class="day-pill-title">${day.title}</div>
    </button>`;
  }).join("");
  dayRail.querySelectorAll(".day-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeDay = Number(btn.dataset.day);
      renderDayRail();
      renderDayPanel();
      if (typeof window.updateMapDay === "function") window.updateMapDay(activeDay);
    });
  });
  const activeBtn = dayRail.querySelector(".day-pill.active");
  if (activeBtn) {
    const left = activeBtn.offsetLeft - (dayRail.clientWidth - activeBtn.offsetWidth) / 2;
    dayRail.scrollTo({ left: Math.max(0, left), behavior: PREFERS_REDUCED_MOTION ? "auto" : "smooth" });
  }
}

function renderDayPanel() {
  const day = DAYS.find((d) => d.n === activeDay);
  const alertsHtml = day.alerts.map((a) => `
    <div class="alert alert-${a.level}">
      <span class="alert-icon">${a.level === "danger" ? "⚠" : a.level === "warning" ? "!" : "i"}</span>
      <span>${a.text}</span>
    </div>`).join("");

  const isTodayPanel = TODAY_DAY && day.n === TODAY_DAY.n;
  const currentIdx = isTodayPanel ? currentActivityIndex(day) : -1;

  const timelineHtml = day.activities.map((act, i) => {
    const timeState = isTodayPanel ? (i < currentIdx ? "past" : i === currentIdx ? "now" : "upcoming") : "";
    return `
    <div class="timeline-item ${act.highlight ? "highlight" : ""} ${timeState}" style="animation-delay:${Math.min(i, 8) * 60}ms">
      ${timeState === "now" ? '<span class="timeline-now-dot"></span>' : ""}
      <div class="timeline-time">${act.time}</div>
      <div class="timeline-text">${act.text}</div>
    </div>`;
  }).join("");

  const placesSeen = [...new Set(day.activities.map((a) => a.place).filter(Boolean))];
  const galleryHtml = placesSeen.map((p, i) => placeCarouselHTML(p, day.title, i === 0, i)).join("");

  const cityBadges = day.cities.map((c) => `<span class="badge badge-city">${cityName(c)}</span>`).join(" ");
  const bedIcon = `<svg viewBox="0 0 24 24" fill="none" class="badge-icon"><path d="M3 18v-7a2 2 0 0 1 2-2h5v5M3 18v2M3 18h18v2M21 18v-4a2 2 0 0 0-2-2h-8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="10.5" r="1.3" fill="currentColor"/></svg>`;
  const planeIcon = `<svg viewBox="0 0 24 24" fill="none" class="badge-icon"><path d="M21 3 2 10l7 3 3 7 3-6 6-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const hotelBadge = day.hotelCity ? `<span class="badge">${bedIcon} Dorme em ${cityName(day.hotelCity)}</span>` : `<span class="badge">${planeIcon} Voo de retorno</span>`;
  const todayBadge = TODAY_DAY && day.n === TODAY_DAY.n ? `<span class="badge badge-today">Hoje</span>` : "";

  dayPanel.innerHTML = `
    <div class="day-panel-head">
      <h3>Dia ${day.n} · ${day.title}</h3>
      ${todayBadge}
      <span class="badge">${capitalize(day.weekday)}, ${fmtDate(day.date)}</span>
      ${cityBadges}
      ${hotelBadge}
    </div>
    <div>
      ${alertsHtml}
      <div class="timeline">${timelineHtml}</div>
    </div>
    <div class="gallery">${galleryHtml}</div>
  `;

  wireCarousels(dayPanel);
}

renderDayRail();
renderDayPanel();
initTripStatus();

document.getElementById("railPrev")?.addEventListener("click", () => dayRail.scrollBy({ left: -260, behavior: "smooth" }));
document.getElementById("railNext")?.addEventListener("click", () => dayRail.scrollBy({ left: 260, behavior: "smooth" }));

/* ---------------- Contagem animada dos números do hero ---------------- */
function runCountUps() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    if (el._counted || !target) return;
    el._counted = true;
    if (PREFERS_REDUCED_MOTION) { el.textContent = target; return; }
    const start = performance.now();
    const dur = 900;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
runCountUps();

/* ---------------- Mapa de rota, dinâmico por dia (Leaflet) ---------------- */
(function initMap() {
  if (typeof L === "undefined") {
    document.getElementById("statCities").dataset.count = CITIES.length;
    runCountUps();
    document.getElementById("route-map").innerHTML = '<p class="map-offline">Mapa indisponível sem internet.</p>';
    return;
  }
  const map = L.map("route-map", { scrollWheelZoom: false, zoomControl: false });
  L.control.zoom({ position: "bottomleft" }).addTo(map);
  window._routeMap = map;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const coords = ROUTE_ORDER.map((id) => {
    const c = CITIES.find((c) => c.id === id);
    return [c.lat, c.lng];
  });
  const fullBounds = L.latLngBounds(coords);
  const goldColor = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#b8862f";

  // Trilha completa (fundo, sempre visível, sutil)
  const ghostLine = L.polyline(coords, {
    color: goldColor, weight: 2, opacity: 0.28, dashArray: "1 9", lineCap: "round",
  }).addTo(map);

  // Trecho já percorrido até o dia ativo (destaque sólido)
  const traveledLine = L.polyline([coords[0]], {
    color: goldColor, weight: 4, opacity: 0.95, lineCap: "round", lineJoin: "round",
    className: "route-traveled",
  }).addTo(map);

  const cityMarkers = {};
  CITIES.forEach((c) => {
    const marker = L.circleMarker([c.lat, c.lng], {
      radius: 6, color: "#16233a", weight: 2, fillColor: "#8a94a6", fillOpacity: 0.55, opacity: 0.55,
    }).addTo(map);
    marker.bindPopup(`<strong>${c.name}</strong><br>${c.country}`);
    cityMarkers[c.id] = marker;
  });

  const hereIcon = L.divIcon({
    className: "here-marker",
    html: '<span class="here-ping"></span><span class="here-dot"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  const hereMarker = L.marker(coords[0], { icon: hereIcon, zIndexOffset: 1000, interactive: false }).addTo(map);

  const dayLabel = document.getElementById("mapDayLabel");

  function cityOf(id) { return CITIES.find((c) => c.id === id); }

  function updateMapDay(dayNumber, opts) {
    const day = DAYS.find((d) => d.n === dayNumber);
    if (!day) return;
    const posId = day.hotelCity || day.cities[day.cities.length - 1];
    const pos = cityOf(posId);
    if (!pos) return;

    // até que índice da rota já foi percorrido nesse dia
    let lastIdx = 0;
    ROUTE_DAY.forEach((d, i) => { if (d <= dayNumber) lastIdx = i; });
    traveledLine.setLatLngs(coords.slice(0, lastIdx + 1));

    const reached = new Set(ROUTE_ORDER.filter((id, i) => ROUTE_DAY[i] <= dayNumber));
    CITIES.forEach((c) => {
      const m = cityMarkers[c.id];
      const isReached = reached.has(c.id);
      const isHere = c.id === posId;
      m.setStyle({
        fillColor: isReached ? goldColor : "#8a94a6",
        fillOpacity: isHere ? 1 : isReached ? 0.9 : 0.45,
        opacity: isReached ? 1 : 0.45,
        radius: isHere ? 8 : 6,
      });
    });

    hereMarker.setLatLng([pos.lat, pos.lng]);
    if (dayLabel) {
      dayLabel.innerHTML = `<span class="map-day-n">DIA ${String(dayNumber).padStart(2, "0")}</span><span>${pos.name}</span>`;
    }

    if (!opts || !opts.silent) {
      map.flyTo([pos.lat, pos.lng], window.innerWidth < 720 ? 6.2 : 6.8, { duration: 1.1, easeLinearity: 0.25 });
    }
  }
  window.updateMapDay = updateMapDay;

  map.fitBounds(fullBounds, { padding: [24, 24] });
  document.getElementById("statCities").dataset.count = CITIES.length;
  runCountUps();

  // posição inicial sem animar a câmera (já enquadramos a rota inteira)
  setTimeout(() => updateMapDay(activeDay, { silent: true }), 300);
})();
