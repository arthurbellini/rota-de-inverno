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

/* ---------------- Tema claro/escuro ---------------- */
(function initTheme() {
  const saved = store.theme || null;
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  const applyIcon = () => {
    const current = document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    btn.textContent = current === "dark" ? "☀" : "◐";
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
function fmtDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function cityName(id) { const c = CITIES.find((c) => c.id === id); return c ? c.name : id; }

/* ---------------- Lightbox ---------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");
function openLightbox(img) {
  lightboxImg.src = img.imageUrl;
  lightboxImg.alt = img.caption || "";
  let capHtml = `<strong>${img.caption || ""}</strong>`;
  if (img.author || img.license) {
    capHtml += `<br>Foto: ${img.author || "Wikimedia Commons"} · ${img.license || ""}`;
    if (img.commonsPageUrl) capHtml += ` · <a href="${img.commonsPageUrl}" target="_blank" rel="noopener">ver fonte</a>`;
  }
  lightboxCap.innerHTML = capHtml;
  lightbox.classList.add("open");
}
document.getElementById("lightboxClose").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.classList.remove("open"); });

function galleryItemHTML(placeId, fallbackLabel) {
  const img = PLACE_IMAGES[placeId];
  if (img && img.imageUrl) {
    return `<div class="gallery-item" data-place="${placeId}">
      <img src="${img.imageUrl}" alt="${img.caption || fallbackLabel}">
      <div class="gallery-cap">${img.caption || fallbackLabel}</div>
    </div>`;
  }
  return `<div class="gallery-item" style="cursor:default;">
    <div class="gallery-placeholder">❄ ${fallbackLabel}<br><span style="opacity:.7">foto a confirmar</span></div>
  </div>`;
}

/* ---------------- Roteiro: rail + painel ---------------- */
const dayRail = document.getElementById("dayRail");
const dayPanel = document.getElementById("dayPanel");
let activeDay = 1;

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
    return `<button class="day-pill ${day.n === activeDay ? "active" : ""}" data-day="${day.n}">
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
    });
  });
}

function renderDayPanel() {
  const day = DAYS.find((d) => d.n === activeDay);
  const alertsHtml = day.alerts.map((a) => `
    <div class="alert alert-${a.level}">
      <span class="alert-icon">${a.level === "danger" ? "⚠" : a.level === "warning" ? "!" : "i"}</span>
      <span>${a.text}</span>
    </div>`).join("");

  const timelineHtml = day.activities.map((act) => `
    <div class="timeline-item ${act.highlight ? "highlight" : ""}">
      <div class="timeline-time">${act.time}</div>
      <div class="timeline-text">${act.text}</div>
    </div>`).join("");

  const placesSeen = [...new Set(day.activities.map((a) => a.place).filter(Boolean))];
  const galleryHtml = placesSeen.map((p) => galleryItemHTML(p, day.title)).join("");

  const cityBadges = day.cities.map((c) => `<span class="badge badge-city">${cityName(c)}</span>`).join(" ");
  const hotelBadge = day.hotelCity ? `<span class="badge">🛏 Dorme em ${cityName(day.hotelCity)}</span>` : `<span class="badge">Voo de retorno</span>`;

  dayPanel.innerHTML = `
    <div class="day-panel-head">
      <h3>Dia ${day.n} · ${day.title}</h3>
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

  dayPanel.querySelectorAll(".gallery-item[data-place]").forEach((el) => {
    el.addEventListener("click", () => {
      const img = PLACE_IMAGES[el.dataset.place];
      if (img && img.imageUrl) openLightbox(img);
    });
  });
}

renderDayRail();
renderDayPanel();

/* ---------------- Mapa de rota (Leaflet) ---------------- */
(function initMap() {
  const map = L.map("route-map", { scrollWheelZoom: false, zoomControl: true });
  window._routeMap = map;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  const coords = ROUTE_ORDER.map((id) => {
    const c = CITIES.find((c) => c.id === id);
    return [c.lat, c.lng];
  });
  const line = L.polyline(coords, { color: "#b8862f", weight: 3, dashArray: "1 8", lineCap: "round" }).addTo(map);

  CITIES.forEach((c) => {
    const marker = L.circleMarker([c.lat, c.lng], {
      radius: 7, color: "#16233a", weight: 2, fillColor: "#b8862f", fillOpacity: 1,
    }).addTo(map);
    marker.bindPopup(`<strong>${c.name}</strong><br>${c.country}`);
  });

  map.fitBounds(line.getBounds(), { padding: [24, 24] });
  document.getElementById("statCities").textContent = CITIES.length;
})();

/* ---------------- Hospedagem ---------------- */
(function renderHospedagem() {
  const grid = document.getElementById("hospedagemGrid");
  grid.innerHTML = HOSPEDAGEM.map((h) => `
    <div class="card">
      <div class="card-head"><h4>${cityName(h.city)}</h4><span class="pill-tbc">${h.status}</span></div>
      <div class="card-kv"><span>Check-in</span><span>${fmtDate(h.checkin)}</span></div>
      <div class="card-kv"><span>Check-out</span><span>${fmtDate(h.checkout)}</span></div>
      <div class="card-kv"><span>Noites</span><span>${h.nights}</span></div>
      <div class="card-kv"><span>Quartos</span><span>${h.rooms} × ${h.roomType}</span></div>
      <div class="card-kv"><span>Hotel</span><span>${h.hotel || "A confirmar"}</span></div>
      <div class="card-kv"><span>Preço/noite</span><span>${h.pricePerNight !== null ? fmtEUR(h.pricePerNight) : "A confirmar"}</span></div>
    </div>
  `).join("");
})();

/* ---------------- Transporte ---------------- */
(function renderTransporte() {
  const grid = document.getElementById("transporteGrid");
  const c1 = TRANSPORTE.carro1, voo = TRANSPORTE.voo, c2 = TRANSPORTE.carro2;

  grid.innerHTML = `
    <div class="card">
      <div class="card-head"><h4>${c1.nome}</h4><span class="pill-tbc">A confirmar</span></div>
      <div class="card-kv"><span>Retirada</span><span>${c1.retirada.local}, ${fmtDate(c1.retirada.data)}</span></div>
      <div class="card-kv"><span>Devolução</span><span>${c1.devolucao.local}, ${fmtDate(c1.devolucao.data)}</span></div>
      <div class="card-kv"><span>Trechos</span><span style="text-align:right; max-width:60%;">${c1.trechos.join(" · ")}</span></div>
      <div class="card-kv"><span>Locadora</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Categoria</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Seguro / franquia</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Total</span><span>A confirmar</span></div>
    </div>
    <div class="card">
      <div class="card-head"><h4>${voo.nome}</h4><span class="pill-tbc">A confirmar</span></div>
      <div class="card-kv"><span>Data</span><span>${fmtDate(voo.data)}</span></div>
      <div class="card-kv"><span>Passageiros</span><span>${voo.passageiros} adultos</span></div>
      <div class="card-kv"><span>Prioridade</span><span style="text-align:right; max-width:60%;">${voo.prioridade}</span></div>
      <div class="card-kv"><span>Companhia / nº voo</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Bagagem</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Preço por pessoa</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Total (4 pax)</span><span>A confirmar</span></div>
      <div class="alert alert-warning" style="margin-top:12px;"><span class="alert-icon">!</span><span>${voo.alerta}</span></div>
    </div>
    <div class="card">
      <div class="card-head"><h4>${c2.nome}</h4><span class="pill-tbc">A confirmar</span></div>
      <div class="card-kv"><span>Retirada</span><span>${c2.retirada.local}, ${fmtDate(c2.retirada.data)}</span></div>
      <div class="card-kv"><span>Devolução</span><span>${c2.devolucao.local}, ${fmtDate(c2.devolucao.data)}</span></div>
      <div class="card-kv"><span>Trechos</span><span style="text-align:right; max-width:60%;">${c2.trechos.join(" · ")}</span></div>
      <div class="card-kv"><span>Taxa one-way</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Seguro</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Vinhetas</span><span>A confirmar</span></div>
      <div class="card-kv"><span>Total</span><span>A confirmar</span></div>
    </div>
  `;

  const docAlerts = document.getElementById("docAlerts");
  docAlerts.innerHTML = `<h3 style="margin-bottom:6px;">Documentação e fronteiras</h3>` +
    TRANSPORTE.alertasDocumentacao.map((t) => `<div class="alert alert-warning"><span class="alert-icon">!</span><span>${t}</span></div>`).join("");
})();

/* ---------------- Orçamento ---------------- */
const rateInput = document.getElementById("rateInput");
rateInput.value = getRate();

function getBudgetValues() {
  const overrides = store.budget || {};
  return ORCAMENTO_CATEGORIAS.map((cat) => {
    const o = overrides[cat.id];
    return {
      ...cat,
      valor: o && o.valor !== undefined ? o.valor : cat.valor,
      estimativa: o && o.estimativa !== undefined ? o.estimativa : cat.estimativa,
    };
  });
}
function setBudgetValue(id, patch) {
  store.budget = store.budget || {};
  store.budget[id] = { ...(store.budget[id] || {}), ...patch };
  saveStore(store);
}

function renderBudget() {
  const rate = getRate();
  const values = getBudgetValues();
  const body = document.getElementById("budgetBody");

  body.innerHTML = values.map((cat) => `
    <tr>
      <td><strong>${cat.nome}</strong></td>
      <td style="color:var(--ink-faint); font-size:0.8rem;">${cat.obs || ""}</td>
      <td><input type="number" min="0" step="1" data-budget-id="${cat.id}" value="${cat.valor}"></td>
      <td>
        <label class="est-toggle">
          <input type="checkbox" data-est-id="${cat.id}" ${cat.estimativa ? "checked" : ""}>
          Estimativa
        </label>
      </td>
      <td class="brl-cell">${fmtBRL(cat.valor * rate)}${cat.estimativa && cat.valor > 0 ? " *" : ""}</td>
    </tr>
  `).join("");

  const total = values.reduce((s, c) => s + Number(c.valor || 0), 0);
  const totalBRL = total * rate;
  const perPerson = total / TRIP_META.travelers;
  const perPersonBRL = totalBRL / TRIP_META.travelers;
  const hasEstimate = values.some((c) => c.estimativa && c.valor > 0);

  document.getElementById("budgetTotals").innerHTML = `
    <div class="total-card"><span>Total da viagem</span><b>${fmtEUR(total)}</b><small>${fmtBRL(totalBRL)}${hasEstimate ? " · inclui estimativas *" : ""}</small></div>
    <div class="total-card"><span>Por pessoa (4 adultos)</span><b>${fmtEUR(perPerson)}</b><small>${fmtBRL(perPersonBRL)}</small></div>
    <div class="total-card"><span>Cotação usada</span><b>${rate.toFixed(2)}</b><small>1 € = R$ ${rate.toFixed(2)} (editável acima)</small></div>
  `;

  const max = Math.max(1, ...values.map((c) => Number(c.valor || 0)));
  document.getElementById("budgetBars").innerHTML = values
    .filter((c) => c.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .map((c) => `
      <div class="bar-row">
        <span>${c.nome}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${(c.valor / max) * 100}%"></span></span>
        <span class="mono">${fmtEUR(c.valor)}</span>
      </div>
    `).join("") || `<p style="color:var(--ink-faint); font-size:0.88rem;">Nenhum valor lançado ainda — preencha o orçamento acima para ver o gráfico.</p>`;

  body.querySelectorAll("[data-budget-id]").forEach((input) => {
    input.addEventListener("input", () => {
      setBudgetValue(input.dataset.budgetId, { valor: Number(input.value || 0) });
      renderBudget();
    });
  });
  body.querySelectorAll("[data-est-id]").forEach((input) => {
    input.addEventListener("change", () => {
      setBudgetValue(input.dataset.estId, { estimativa: input.checked });
      renderBudget();
    });
  });
}
renderBudget();

rateInput.addEventListener("input", () => {
  const v = Number(rateInput.value);
  if (v > 0) {
    store.rate = v;
    saveStore(store);
    renderBudget();
  }
});

/* ---------------- Reservas ---------------- */
function getReservaStatus(id, fallback) {
  const overrides = store.reservas || {};
  return overrides[id] || fallback;
}
function setReservaStatus(id, status) {
  store.reservas = store.reservas || {};
  store.reservas[id] = status;
  saveStore(store);
}
function renderReservas() {
  const body = document.getElementById("reservasBody");
  body.innerHTML = RESERVAS.map((r) => {
    const status = getReservaStatus(r.id, r.status);
    const opts = RESERVA_STATUS.map((s) => `<option value="${s.id}" ${s.id === status ? "selected" : ""}>${s.label}</option>`).join("");
    const meta = RESERVA_STATUS.find((s) => s.id === status);
    return `
      <tr>
        <td><strong>${r.nome}</strong></td>
        <td style="color:var(--ink-faint);">${r.categoria}</td>
        <td>
          <select class="status-select" data-reserva-id="${r.id}" style="background-color:${meta.color}22; color:${meta.color}; border-color:${meta.color}66;">
            ${opts}
          </select>
        </td>
      </tr>
    `;
  }).join("");

  body.querySelectorAll("[data-reserva-id]").forEach((sel) => {
    sel.addEventListener("change", () => {
      setReservaStatus(sel.dataset.reservaId, sel.value);
      renderReservas();
    });
  });
}
renderReservas();

/* ---------------- Fontes consultadas ---------------- */
(function renderFontes() {
  const list = document.getElementById("fontesList");
  list.innerHTML = FONTES.map((f) => `
    <li style="font-size:0.84rem; color:var(--ink-soft); padding:10px 0; border-bottom:1px dashed var(--line);">
      ${f.texto} — <a href="${f.url}" target="_blank" rel="noopener" style="color:var(--gold); font-weight:600;">fonte ↗</a>
    </li>
  `).join("");
})();

/* As fotos reais já vêm embutidas em js/images-data.js (PLACE_IMAGES),
   carregado antes deste script — funciona offline e ao abrir o arquivo
   diretamente (file://), sem depender de servidor local. */
