// Confere o simulador contra a régua da Plus (20% de R$ 300 a 400, 25% acima),
// sempre sobre a energia compensada. Rodar: node --experimental-strip-types scripts/simulador-regua.test.ts
import assert from "node:assert/strict";
import { calculateSavings } from "../lib/constants.ts";

const casos: Array<[number, number]> = [
  [300, 20],
  [400, 20],
  [401, 25],
  [500, 25],
  [5000, 25],
];

for (const [conta, pct] of casos) {
  const s = calculateSavings(conta);
  assert.equal(s.ratePercent, pct, `conta ${conta}: régua`);
  assert.ok(s.compensated < conta, `conta ${conta}: compensada menor que a fatura`);
  assert.equal(s.monthly, Math.round(s.compensated * (pct / 100)), `conta ${conta}: desconto sobre a compensada`);
  assert.ok(s.monthly < conta * (pct / 100), `conta ${conta}: nunca ${pct}% da fatura inteira`);
  console.log(`R$ ${conta}: ${pct}% sobre ~R$ ${s.compensated} = ~R$ ${s.monthly}/mês`);
}
console.log("ok");
