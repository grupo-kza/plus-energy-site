/* Páginas de venda da Plus Energy (sprint F9): simulador, formulário e rastreio.
 * Régua igual a lib/constants.ts: 20% de R$ 300 a 400, 25% acima, só sobre a energia compensada.
 * Teste: npm run test:simulador (confere esta conta e a do site). */
(function (root) {
  "use strict";

  // Destino do formulário: entrada do site na conta 13 do SiteUP CRM.
  // Vazio = o formulário só abre o WhatsApp com a mensagem pronta (nada se perde).
  var CRM_ENDPOINT = "";
  var WHATSAPP = "5554997150494";
  var MIN_BILL = 300;
  var TIER_LIMIT = 400;
  var SHARE = [[300, 0.54], [800, 0.55], [1500, 0.6], [2600, 0.65], [5000, 0.68]];

  function rateFor(bill) { return bill > TIER_LIMIT ? 0.25 : 0.2; }
  function share(bill) {
    if (bill <= SHARE[0][0]) return SHARE[0][1];
    for (var i = 1; i < SHARE.length; i++) {
      var x0 = SHARE[i - 1][0], y0 = SHARE[i - 1][1], x1 = SHARE[i][0], y1 = SHARE[i][1];
      if (bill <= x1) return y0 + ((bill - x0) / (x1 - x0)) * (y1 - y0);
    }
    return SHARE[SHARE.length - 1][1];
  }
  function calc(bill) {
    var rate = rateFor(bill);
    var compensated = bill * share(bill);
    var monthly = Math.round(compensated * rate);
    return {
      rate: rate, ratePercent: Math.round(rate * 100),
      compensated: Math.round(compensated), stayWithRge: Math.round(bill - compensated),
      monthly: monthly, yearly: monthly * 12
    };
  }

  root.PlusCalc = { calc: calc, MIN_BILL: MIN_BILL, TIER_LIMIT: TIER_LIMIT };
  if (typeof document === "undefined") return; // node (teste)

  var brl = function (n) { return "R$ " + Math.round(n).toLocaleString("pt-BR"); };
  var page = document.body.getAttribute("data-lp") || "lp";
  var variant = "plus-" + page;

  // UTM e fbclid da chegada, guardados na sessão
  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
  var track = {};
  try {
    var saved = JSON.parse(sessionStorage.getItem("pe_lp_utm") || "{}");
    var q = new URLSearchParams(location.search);
    KEYS.forEach(function (k) { track[k] = q.get(k) || saved[k] || ""; });
    sessionStorage.setItem("pe_lp_utm", JSON.stringify(track));
  } catch (e) { KEYS.forEach(function (k) { track[k] = track[k] || ""; }); }

  window.dataLayer = window.dataLayer || [];
  function push(ev, data) { var o = { event: ev, lp: page }; for (var k in data) o[k] = data[k]; window.dataLayer.push(o); }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "lp-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);
  }
  var defaultMsg = "Oi! Vi a página da Plus Energy e quero simular o desconto na minha conta de luz. (ref: lp_" + page + ")";

  // Botões de WhatsApp diretos
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", waLink(defaultMsg));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    a.addEventListener("click", function () { push("whatsapp_click", { cta_location: a.getAttribute("data-wa") || "lp" }); });
  });
  document.querySelectorAll("[data-cta]").forEach(function (a) {
    a.addEventListener("click", function () { push("cta_click", { cta_text: (a.textContent || "").trim(), cta_location: a.getAttribute("data-cta") }); });
  });

  // Simulador
  var simInput = document.querySelector("[data-sim-input]");
  var bill = simInput ? Number(simInput.value) || 500 : 500;
  function paint() {
    var r = calc(bill);
    document.querySelectorAll("[data-out]").forEach(function (el) {
      var k = el.getAttribute("data-out");
      if (k === "bill") el.textContent = brl(bill);
      else if (k === "rate") el.textContent = r.ratePercent + "%";
      else if (k === "monthly") el.textContent = Math.round(r.monthly).toLocaleString("pt-BR");
      else if (k === "yearly") el.textContent = brl(r.yearly);
      else if (k === "compensated") el.textContent = "~" + brl(r.compensated);
      else if (k === "rge") el.textContent = "~" + brl(r.stayWithRge);
    });
    var billField = document.querySelector("[name=valor_conta]");
    if (billField && !billField.dataset.touched) billField.value = String(bill);
  }
  if (simInput) {
    var simTimer = null;
    simInput.addEventListener("input", function () {
      bill = Number(simInput.value) || 500;
      paint();
      clearTimeout(simTimer);
      simTimer = setTimeout(function () { push("simulator_interaction", { bill_value: bill }); }, 600);
    });
  }
  paint();

  // Formulário curto
  var form = document.querySelector("form.lead-form");
  if (form) {
    var msg = form.querySelector(".form-msg");
    var billField = form.querySelector("[name=valor_conta]");
    if (billField) billField.addEventListener("input", function () { billField.dataset.touched = "1"; });
    var phone = form.querySelector("[name=whatsapp]");
    if (phone) phone.addEventListener("input", function () {
      var d = phone.value.replace(/\D/g, "").slice(0, 11);
      phone.value = d.length > 6 ? "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4)
        : d.length > 2 ? "(" + d.slice(0, 2) + ") " + d.slice(2) : d;
    });
    var started = false;
    form.addEventListener("focusin", function () { if (!started) { started = true; push("lead_step_view", { step: "form" }); } });

    function fail(text) { msg.hidden = false; msg.className = "form-msg err"; msg.textContent = text; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.hidden = true;
      var nome = form.nome.value.trim();
      var digits = form.whatsapp.value.replace(/\D/g, "");
      var conta = Number(String(form.valor_conta.value).replace(/\./g, "").replace(",", "."));
      var dist = form.distribuidora.value;
      if (nome.length < 2) return fail("Escreve teu nome para a gente te chamar.");
      if (digits.length < 10) return fail("Confere o WhatsApp com DDD.");
      if (!conta) return fail("Coloca o valor médio da tua conta de luz.");
      if (dist !== "RGE") {
        return fail("Hoje a Plus atende só quem tem conta da RGE (grupo CPFL), no RS. Com outra distribuidora, o desconto ainda não chega até ti.");
      }
      if (conta < MIN_BILL) {
        return fail("Por enquanto a Plus atende contas a partir de R$ 300. Abaixo disso, o desconto não compensa para ti.");
      }
      var r = calc(conta);
      var eventId = uuid();
      var payload = {
        nome: nome, whatsapp: "55" + digits, valor_conta: conta, distribuidora: dist,
        estimativa_desconto: r.monthly, event_id: eventId, event_source_url: location.href.split("#")[0]
      };
      KEYS.forEach(function (k) { payload[k] = track[k]; });
      payload.utm_content = track.utm_content || variant;

      push("generate_lead", { event_id: eventId, lead_phone: "55" + digits, bill_value: conta, distributor: dist, value: r.monthly, currency: "BRL" });

      var done = function () {
        var text = "Oi! Sou " + nome + ". Minha conta de luz fica em torno de " + brl(conta) + " (" + dist + "). Quero a simulação da Plus Energy. (ref: lp_" + page + ")";
        var box = document.querySelector("[data-done]");
        box.querySelector("[data-done-wa]").setAttribute("href", waLink(text));
        box.querySelector("[data-done-wa]").addEventListener("click", function () { push("whatsapp_click", { cta_location: "lp_form_done" }); });
        form.hidden = true;
        box.hidden = false;
        push("lead_conversion", { event_id: eventId });
      };

      if (!CRM_ENDPOINT) return done();
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      fetch(CRM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true })
        .catch(function () { /* o WhatsApp segue como caminho */ })
        .then(function () { btn.disabled = false; done(); });
    });
  }

  // Barra fixa no celular depois do hero
  var bar = document.querySelector(".mbar");
  var hero = document.querySelector(".hero");
  if (bar && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { bar.classList.toggle("on", !es[0].isIntersecting); }).observe(hero);
  }
})(typeof window !== "undefined" ? window : globalThis);
