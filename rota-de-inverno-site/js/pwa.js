/* Registro do service worker, aviso de atualização e de modo offline. */
(function () {
  function toast(msg, actionLabel, onAction) {
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.innerHTML = "";
    const span = document.createElement("span"); span.textContent = msg; el.appendChild(span);
    if (actionLabel) {
      const b = document.createElement("button"); b.type = "button"; b.textContent = actionLabel;
      b.addEventListener("click", () => { onAction(); el.classList.remove("show"); });
      el.appendChild(b);
    }
    el.classList.add("show");
    return el;
  }
  window._toast = toast;

  window.addEventListener("offline", () => toast("Sem internet — o roteiro e seus dados continuam disponíveis."));
  window.addEventListener("online", () => { const el = document.getElementById("toast"); if (el) el.classList.remove("show"); });

  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;

  // Em desenvolvimento local o cache atrapalha: remove o service worker (use ?sw=1 para testá-lo).
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !/[?&]sw=1/.test(location.search)) {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    if (window.caches) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            toast("Nova versão do site disponível.", "Atualizar", () => nw.postMessage("SKIP_WAITING"));
          }
        });
      });
    }).catch(() => {});
    // Só recarrega quando uma versão nova assume o lugar de uma anterior (não na primeira instalação).
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || reloaded) return;
      reloaded = true; location.reload();
    });
  });
})();