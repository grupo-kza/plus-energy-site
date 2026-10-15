// Confere a conta das páginas de venda (public/lp/lp.js) contra a régua da Plus (25% fixo sobre a energia compensada).
// Mesmos valores do teste do simulador do site (PR #4). Rodar: npm run test:lp
const assert = require("node:assert");
require("../public/lp/lp.js");
const esperado = { 300: 41, 400: 54, 401: 54, 500: 68, 5000: 850 };
for (const [conta, mensal] of Object.entries(esperado)) {
  const r = globalThis.PlusCalc.calc(Number(conta));
  assert.strictEqual(r.monthly, mensal, `conta R$ ${conta}: esperado ~R$ ${mensal}, veio R$ ${r.monthly}`);
  console.log(`R$ ${conta}: ${r.ratePercent}% sobre ~R$ ${r.compensated} = ~R$ ${r.monthly}/mês`);
}
console.log("ok");
