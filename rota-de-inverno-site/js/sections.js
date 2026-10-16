/* =========================================================================
   SECTIONS.JS — hospedagem, transporte, orçamento, reservas, utilidades.
   Depende de data.js e app.js (store, fmt*, escapeHtml, mapsLink, animateNumber).
   ========================================================================= */

const $ = (sel, root = document) => root.querySelector(sel);

/* ---------------- Reservas: estado compartilhado ---------------- */
function statusMeta(id) { return RESERVA_STATUS.find((s) => s.id === id) || RESERVA_STATUS[0]; }
function getReservaStatus(id, fallback) { return (store.reservas || {})[id] || fallback; }
function setReservaStatus(id, status) {
  store.reservas = store.reservas || {};
  store.reservas[id] = status;
  saveStore(store);
}
function statusPill(id) {
  const r = RESERVAS.find((x) => x.id === id);
  const s = statusMeta(getReservaStatus(id, r ? r.status : "pendente"));
  return `<span class="pill-status" style="--st:${s.color}">${s.label}</span>`;
}
function whenStr(data, hora) { return fmtDate(data) + (hora ? " às " + hora : ""); }
function alertBlock(a) {
  const icon = a.level === "danger" ? "⚠" : a.level === "warning" ? "!" : "i";
  return `<div class="alert alert-${a.level}"><span class="alert-icon">${icon}</span><span>${escapeHtml(a.text)}</span></div>`;
}
function codeCell(code) {
  if (!code) return `<span class="muted">—</span>`;
  return `<code class="code">${escapeHtml(code)}</code> <button type="button" class="link-btn" data-copy="${escapeHtml(code)}">Copiar</button>`;
}
function kv(label, valueHtml) { return `<div class="card-kv"><span>${label}</span><span>${valueHtml}</span></div>`; }

/* ---------------- Hospedagem ---------------- */
function renderHospedagem() {
  const rate = getRate();
  $("#hospedagemGrid").innerHTML = HOSPEDAGEM.map((h) => {
    const actions = h.endereco
      ? `<div class="card-actions">
           <a class="link-btn" href="${mapsLink(h.nome + ", " + h.endereco)}" target="_blank" rel="noopener">Abrir no mapa</a>
           <button type="button" class="link-btn" data-copy="${escapeHtml(h.endereco)}">Copiar endereço</button>
         </div>`
      : `<div class="card-actions"><span class="pill-tbc">Endereço a confirmar</span></div>`;
    const perNight = h.valorBRL ? h.valorBRL / h.nights : null;
    return `
    <article class="card">
      <div class="card-head"><h4>${escapeHtml(cityName(h.city))}</h4>${statusPill(h.id)}</div>
      <p class="card-title">${escapeHtml(h.nome)}</p>
      <p class="card-sub">${h.endereco ? escapeHtml(h.endereco) : "Endereço ainda não informado"}</p>
      ${actions}
      ${kv("Check-in", whenStr(h.checkin, h.checkinHora))}
      ${kv("Check-out", whenStr(h.checkout, h.checkoutHora))}
      ${kv("Noites", String(h.nights))}
      ${kv("Quartos", h.id === "hotel_paris" ? "A confirmar" : `${TRIP_META.rooms} × Duplo`)}
      ${kv("Canal", escapeHtml(h.canal))}
      ${kv("Valor total", h.valorBRL ? `${fmtBRL(h.valorBRL)} <small class="muted">≈ ${fmtEUR(h.valorBRL / rate)}</small>` : "A confirmar")}
      ${perNight ? kv("Por noite", `${fmtBRL(perNight)}`) : ""}
      ${h.nota ? alertBlock({ level: "warning", text: h.nota }) : ""}
    </article>`;
  }).join("");
}

/* ---------------- Transporte ---------------- */
function renderTransporte() {
  const rate = getRate();
  $("#voosGrid").innerHTML = TRANSPORTE.voos.map((v) => {
    const total = v.passageiros.reduce((s, p) => s + p.valorBRL, 0);
    const pax = v.passageiros.map((p) => `<li><span>${escapeHtml(p.nome)}</span><b>${fmtBRL(p.valorBRL)}</b></li>`).join("");
    return `
    <article class="card">
      <div class="card-head"><h4>${escapeHtml(v.titulo)}</h4>${statusPill(v.id)}</div>
      <p class="card-title">${escapeHtml(v.cia)} · ${escapeHtml(v.voo)}</p>
      ${kv("Reserva", codeCell(v.reserva))}
      ${kv("Rota", escapeHtml(v.rota))}
      ${kv("Saída", whenStr(v.saida.data, v.saida.hora))}
      ${kv("Chegada", whenStr(v.chegada.data, v.chegada.hora))}
      ${kv("Canal", escapeHtml(v.canal))}
      <ul class="pax">${pax}</ul>
      ${kv("Total", `${fmtBRL(total)} <small class="muted">≈ ${fmtEUR(total / rate)}</small>`)}
      ${v.alerts.map(alertBlock).join("")}
    </article>`;
  }).join("");

  $("#carrosGrid").innerHTML = TRANSPORTE.carros.map((c) => {
    const place = (p) => `${escapeHtml(p.local)} <a class="link-btn" href="${mapsLink(p.local)}" target="_blank" rel="noopener">Mapa</a>`;
    return `
    <article class="card">
      <div class="card-head"><h4>${escapeHtml(c.nome)}</h4>${statusPill(c.id)}</div>
      <p class="card-title">${escapeHtml(c.locadora)} · ${escapeHtml(c.veiculo)}</p>
      ${kv("Reserva", codeCell(c.reserva))}
      ${kv("Canal", escapeHtml(c.canal))}
      ${kv("Retirada", `${whenStr(c.retirada.data, c.retirada.hora)}<br>${place(c.retirada)}`)}
      ${kv("Devolução", `${whenStr(c.devolucao.data, c.devolucao.hora)}<br>${place(c.devolucao)}`)}
      ${kv("Trechos", c.trechos.map(escapeHtml).join(" · "))}
      ${kv("Valor", `${fmtBRL(c.valorBRL)} <small class="muted">≈ ${fmtEUR(c.valorBRL / rate)}</small>`)}
      ${c.alerts.map(alertBlock).join("")}
    </article>`;
  }).join("");

  $("#docAlerts").innerHTML =
    `<h3>Documentação e fronteiras</h3>` +
    `<p class="muted small">A confirmar com as locadoras: ${TRANSPORTE.pendencias.map(escapeHtml).join(" · ")}.</p>` +
    TRANSPORTE.alertasDocumentacao.map((t) => alertBlock({ level: "warning", text: t })).join("");
}

/* ---------------- Orçamento ---------------- */
const rateInput = $("#rateInput");
rateInput.value = getRate();

function getBudgetValues() {
  const o = store.budget || {};
  return ORCAMENTO_CATEGORIAS.map((c) => ({ ...c, ...(o[c.id] || {}) }));
}
function setBudgetValue(id, patch) {
  store.budget = store.budget || {};
  store.budget[id] = { ...(store.budget[id] || {}), ...patch };
  saveStore(store);
}
const eurOf = (c, rate) => (c.moeda === "EUR" ? c.valor : c.valor / rate);
const brlOf = (c, rate) => (c.moeda === "BRL" ? c.valor : c.valor * rate);
function grupoOf(id) {
  if (id === "voos") return "Voos";
  if (id.startsWith("hotel_")) return "Hospedagem";
  if (id.startsWith("carro")) return "Carros";
  return "Na viagem";
}
function cleanNumber(raw) {
  const n = Number(String(raw).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, 100000000);
}

function renderBudgetRows() {
  $("#budgetBody").innerHTML = getBudgetValues().map((c) => `
    <tr data-id="${c.id}">
      <td><strong>${escapeHtml(c.nome)}</strong></td>
      <td class="obs">${escapeHtml(c.obs || "")}</td>
      <td class="val-cell">
        <input type="number" min="0" step="0.01" inputmode="decimal" data-val="${c.id}" value="${c.valor}" aria-label="Valor — ${escapeHtml(c.nome)}">
        <select data-moeda="${c.id}" aria-label="Moeda — ${escapeHtml(c.nome)}">
          <option value="BRL" ${c.moeda === "BRL" ? "selected" : ""}>R$</option>
          <option value="EUR" ${c.moeda === "EUR" ? "selected" : ""}>€</option>
        </select>
      </td>
      <td><label class="est-toggle"><input type="checkbox" data-est="${c.id}" ${c.estimativa ? "checked" : ""}> Estimativa</label></td>
      <td class="brl-cell" data-label="Em R$" data-brl="${c.id}"></td>
      <td class="eur-cell" data-label="Em €" data-eur="${c.id}"></td>
    </tr>`).join("");
}

function updateBudget() {
  const rate = getRate();
  const values = getBudgetValues();
  let totalEUR = 0, totalBRL = 0, hasEstimate = false;
  const grupos = {};

  values.forEach((c) => {
    const eur = eurOf(c, rate), brl = brlOf(c, rate);
    totalEUR += eur; totalBRL += brl;
    if (c.estimativa && c.valor > 0) hasEstimate = true;
    grupos[grupoOf(c.id)] = (grupos[grupoOf(c.id)] || 0) + brl;
    const brlCell = $(`[data-brl="${c.id}"]`), eurCell = $(`[data-eur="${c.id}"]`);
    if (brlCell) brlCell.textContent = fmtBRL(brl) + (c.estimativa && c.valor > 0 ? " *" : "");
    if (eurCell) eurCell.textContent = fmtEUR(eur);
  });

  animateNumber($("#totalBRL"), totalBRL, fmtBRL);
  animateNumber($("#totalEUR"), totalEUR, fmtEUR);
  animateNumber($("#perPersonBRL"), totalBRL / TRIP_META.travelers, fmtBRL);
  animateNumber($("#perPersonEUR"), totalEUR / TRIP_META.travelers, fmtEUR);
  animateNumber($("#rateDisplay"), rate, (v) => v.toFixed(2));
  $("#totalEstNote").textContent = hasEstimate ? " · inclui estimativas *" : "";
  $("#rateNote").textContent = `1 € = R$ ${rate.toFixed(2)} (editável acima)`;

  $("#budgetGroups").innerHTML = Object.entries(grupos).filter(([, v]) => v > 0)
    .map(([g, v]) => `<span class="chip"><b>${g}</b> ${fmtBRL(v)}</span>`).join("");

  const max = Math.max(1, ...values.map((c) => brlOf(c, rate)));
  const bars = values.filter((c) => c.valor > 0).sort((a, b) => brlOf(b, rate) - brlOf(a, rate));
  $("#budgetBars").innerHTML = bars.length ? bars.map((c) => {
    const brl = brlOf(c, rate);
    return `<div class="bar-row">
      <span>${escapeHtml(c.nome)}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${(brl / max) * 100}%"></span></span>
      <span class="mono">${fmtBRL(brl)}</span>
    </div>`;
  }).join("") : `<p class="muted small">Nenhum valor lançado ainda — preencha o orçamento acima para ver o gráfico.</p>`;

  updateConverter();
}

$("#budgetBody").addEventListener("input", (e) => {
  const t = e.target;
  if (t.matches("[data-val]")) {
    const v = cleanNumber(t.value);
    t.classList.toggle("invalid", t.value !== "" && String(Number(String(t.value).replace(",", "."))) === "NaN");
    setBudgetValue(t.dataset.val, { valor: v });
    updateBudget();
  }
});
$("#budgetBody").addEventListener("change", (e) => {
  const t = e.target;
  if (t.matches("[data-moeda]")) { setBudgetValue(t.dataset.moeda, { moeda: t.value }); updateBudget(); }
  if (t.matches("[data-est]")) { setBudgetValue(t.dataset.est, { estimativa: t.checked }); updateBudget(); }
});
rateInput.addEventListener("input", () => {
  const v = Number(String(rateInput.value).replace(",", "."));
  rateInput.classList.toggle("invalid", !(v > 0));
  if (v > 0 && v < 1000) { store.rate = v; saveStore(store); updateBudget(); renderHospedagem(); renderTransporte(); }
});
$("#budgetReset").addEventListener("click", () => {
  if (!confirm("Restaurar os valores do orçamento para os da planilha? Suas edições serão perdidas.")) return;
  delete store.budget; saveStore(store);
  renderBudgetRows(); updateBudget();
});

/* ---------------- Conversor rápido ---------------- */
const convEur = $("#convEur"), convBrl = $("#convBrl");
function updateConverter() {
  const rate = getRate();
  $("#convRate").textContent = `1 € = R$ ${rate.toFixed(2)}`;
  if (document.activeElement !== convBrl && convEur.value !== "") convBrl.value = (cleanNumber(convEur.value) * rate).toFixed(2);
}
convEur.addEventListener("input", () => { convBrl.value = convEur.value === "" ? "" : (cleanNumber(convEur.value) * getRate()).toFixed(2); });
convBrl.addEventListener("input", () => { convEur.value = convBrl.value === "" ? "" : (cleanNumber(convBrl.value) / getRate()).toFixed(2); });

/* ---------------- Reservas ---------------- */
let reservaFilter = "todos";
function renderReservas() {
  const counts = {};
  RESERVAS.forEach((r) => { const s = getReservaStatus(r.id, r.status); counts[s] = (counts[s] || 0) + 1; });
  $("#reservasSummary").innerHTML = RESERVA_STATUS.filter((s) => counts[s.id])
    .map((s) => `<span class="chip" style="--st:${s.color}"><i class="dot"></i><b>${counts[s.id]}</b> ${s.label}</span>`).join("");

  $("#reservasFilters").innerHTML = [["todos", "Todas"], ["pendentes", "Pendentes"], ["feitas", "Reservadas/pagas"]]
    .map(([id, label]) => `<button type="button" class="filter-btn ${reservaFilter === id ? "active" : ""}" data-filter="${id}" aria-pressed="${reservaFilter === id}">${label}</button>`).join("");

  const rows = RESERVAS.filter((r) => {
    const s = getReservaStatus(r.id, r.status);
    if (reservaFilter === "pendentes") return s === "pendente" || s === "pesquisando";
    if (reservaFilter === "feitas") return s === "reservado" || s === "pago";
    return true;
  });
  $("#reservasBody").innerHTML = rows.map((r) => {
    const status = getReservaStatus(r.id, r.status);
    const meta = statusMeta(status);
    const opts = RESERVA_STATUS.map((s) => `<option value="${s.id}" ${s.id === status ? "selected" : ""}>${s.label}</option>`).join("");
    return `<tr class="${status === "pendente" ? "row-pending" : ""}">
      <td><strong>${escapeHtml(r.nome)}</strong><div class="muted small">${escapeHtml(r.categoria)}</div></td>
      <td>${codeCell(r.codigo)}</td>
      <td class="muted">${r.canal ? escapeHtml(r.canal) : "—"}</td>
      <td><select class="status-select" data-reserva-id="${r.id}" aria-label="Status — ${escapeHtml(r.nome)}"
        style="background-color:${meta.color}22; color:${meta.color}; border-color:${meta.color}66;">${opts}</select></td>
    </tr>`;
  }).join("") || `<tr><td colspan="4" class="muted">Nada nesta lista.</td></tr>`;
}
$("#reservasBody").addEventListener("change", (e) => {
  if (e.target.matches("[data-reserva-id]")) {
    setReservaStatus(e.target.dataset.reservaId, e.target.value);
    renderReservas(); renderHospedagem(); renderTransporte();
  }
});
$("#reservasFilters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]");
  if (b) { reservaFilter = b.dataset.filter; renderReservas(); }
});

/* ---------------- Checklist ---------------- */
function renderChecklist() {
  const done = store.checklist || {};
  let total = 0, ok = 0;
  $("#checklistGroups").innerHTML = CHECKLIST.map((g) => `
    <fieldset class="ck-group">
      <legend>${escapeHtml(g.grupo)}</legend>
      ${g.itens.map((i) => { total++; if (done[i.id]) ok++; return `
        <label class="ck-item ${done[i.id] ? "done" : ""}">
          <input type="checkbox" data-ck="${i.id}" ${done[i.id] ? "checked" : ""}> <span>${escapeHtml(i.texto)}</span>
        </label>`; }).join("")}
    </fieldset>`).join("");
  $("#ckProgressBar").style.width = (total ? (ok / total) * 100 : 0) + "%";
  $("#ckProgressText").textContent = `${ok} de ${total} itens`;
}
$("#checklistGroups").addEventListener("change", (e) => {
  if (!e.target.matches("[data-ck]")) return;
  store.checklist = store.checklist || {};
  store.checklist[e.target.dataset.ck] = e.target.checked;
  saveStore(store);
  renderChecklist();
});

/* ---------------- Emergência ---------------- */
$("#emergenciaList").innerHTML = EMERGENCIA.map((e) => `
  <div class="emerg">
    <div><b>${escapeHtml(e.valor)}</b><span>${escapeHtml(e.titulo)}</span></div>
    <a class="btn-solid" href="tel:${e.tel}">Ligar</a>
  </div>`).join("");

/* ---------------- Backup, impressão e limpeza ---------------- */
function backupMsg(text, ok) {
  const el = $("#backupMsg");
  el.textContent = text;
  el.className = "backup-msg " + (ok ? "ok" : "err");
}
$("#btnExport").addEventListener("click", () => {
  const payload = { app: "rota-de-inverno", dataVersion: DATA_VERSION, exportedAt: new Date().toISOString(), store };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rota-de-inverno-backup-${todayISO()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  backupMsg("Backup gerado. Guarde o arquivo em local seguro.", true);
});
$("#btnImport").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.app !== "rota-de-inverno" || typeof data.store !== "object" || data.store === null) throw new Error("formato");
      if (!confirm("Importar este backup substitui os dados atuais deste aparelho. Continuar?")) return;
      localStorage.setItem(STORE_KEY, JSON.stringify(data.store));
      backupMsg("Backup importado. Recarregando...", true);
      setTimeout(() => location.reload(), 600);
    } catch (err) {
      backupMsg("Arquivo inválido: use um backup gerado por este site.", false);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});
$("#btnPrint").addEventListener("click", () => window.print());

// Baixa todas as fotos para o cache do service worker (uso sem internet).
$("#btnOffline").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
    backupMsg("Disponível depois da primeira visita completa: recarregue a página e tente de novo.", false);
    return;
  }
  const urls = [...new Set([
    ...Object.values(PLACE_IMAGES).map((i) => i.imageUrl),
    ...Object.values(PLACE_IMAGES_EXTRA).flat().map((i) => i.imageUrl),
  ])];
  btn.disabled = true;
  let done = 0, fail = 0, next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const u = urls[next++];
      try { const r = await fetch(u, { mode: "cors" }); if (!r.ok) throw new Error(r.status); await r.blob(); }
      catch (err) { fail++; }
      done++;
      backupMsg(`Baixando fotos: ${done} de ${urls.length}...`, true);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  btn.disabled = false;
  backupMsg(fail ? `Concluído, mas ${fail} foto(s) falharam. Tente de novo com internet melhor.` : `Pronto: ${urls.length} fotos salvas para uso offline.`, !fail);
});
$("#btnClear").addEventListener("click", () => {
  if (!confirm("Apagar cotação, orçamento, status das reservas e checklist deste aparelho?")) return;
  localStorage.removeItem(STORE_KEY);
  location.reload();
});

/* Versão para impressão: roteiro completo sem fotos */
function buildPrintView() {
  const rate = getRate();
  const flights = TRANSPORTE.voos.map((v) => `<li><b>${escapeHtml(v.titulo)}</b> — ${escapeHtml(v.cia)} ${escapeHtml(v.voo)}, reserva ${escapeHtml(v.reserva)}, ${whenStr(v.saida.data, v.saida.hora)} → ${whenStr(v.chegada.data, v.chegada.hora)} (${v.passageiros.map((p) => p.nome).join(", ")})</li>`).join("");
  const cars = TRANSPORTE.carros.map((c) => `<li><b>${escapeHtml(c.nome)}</b> — ${escapeHtml(c.locadora)} ${escapeHtml(c.veiculo)}, reserva ${escapeHtml(c.reserva)}. Retirada ${whenStr(c.retirada.data, c.retirada.hora)} (${escapeHtml(c.retirada.local)}). Devolução ${whenStr(c.devolucao.data, c.devolucao.hora)} (${escapeHtml(c.devolucao.local)}).</li>`).join("");
  const hotels = HOSPEDAGEM.map((h) => `<li><b>${escapeHtml(h.nome)}</b> (${escapeHtml(cityName(h.city))}) — ${h.endereco ? escapeHtml(h.endereco) : "endereço a confirmar"}. ${whenStr(h.checkin, h.checkinHora)} → ${whenStr(h.checkout, h.checkoutHora)}.</li>`).join("");
  const days = DAYS.map((d) => `
    <section class="pv-day">
      <h3>Dia ${d.n} · ${capitalize(d.weekday)}, ${fmtDate(d.date)} — ${escapeHtml(d.title)}</h3>
      ${d.alerts.map((a) => `<p class="pv-alert pv-${a.level}">${escapeHtml(a.text)}</p>`).join("")}
      <ul>${d.activities.map((a) => `<li><b>${escapeHtml(a.time)}</b> ${escapeHtml(a.text)}</li>`).join("")}</ul>
    </section>`).join("");
  $("#printView").innerHTML = `
    <h1>Rota de Inverno — Lisboa a Paris</h1>
    <p>19/12/2026 a 03/01/2027 · 4 adultos · cotação usada: 1 € = R$ ${rate.toFixed(2).replace(".", ",")}</p>
    <h2>Voos</h2><ul>${flights}</ul>
    <h2>Carros</h2><ul>${cars}</ul>
    <h2>Hospedagem</h2><ul>${hotels}</ul>
    <h2>Roteiro</h2>${days}`;
}
window.addEventListener("beforeprint", buildPrintView);

/* ---------------- Fontes ---------------- */
$("#fontesList").innerHTML = FONTES.map((f) => `
  <li>${escapeHtml(f.texto)}${f.url ? ` — <a href="${f.url}" target="_blank" rel="noopener">fonte ↗</a>` : ""}</li>`).join("");

/* ---------------- Inicialização ---------------- */
renderHospedagem();
renderTransporte();
renderBudgetRows();
updateBudget();
renderReservas();
renderChecklist();

/* ---------------- Revelação suave ao rolar ---------------- */
(function initScrollReveal() {
  if (PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  const stagger = (sel) => document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
    io.observe(el);
  });
  stagger("#hospedagemGrid .card");
  stagger("#voosGrid .card");
  stagger("#carrosGrid .card");
  stagger(".totals-row .total-card");
  stagger(".tool-card");
})();
