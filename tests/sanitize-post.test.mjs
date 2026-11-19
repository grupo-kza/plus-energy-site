// Teste do PUB-01 (#994), sem rede: node --experimental-strip-types --test tests/sanitize-post.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizePostHtml, jsonLdSeguro } from "../lib/sanitize-post.ts";

test("tira script, evento, iframe e javascript:", () => {
  const sujo =
    '<p>oi</p><script>alert(1)</script><img src=x onerror="alert(1)"><iframe src="https://x"></iframe>' +
    '<a href="javascript:alert(1)">a</a><p style="x" onclick="y">b</p><svg><script>1</script></svg>';
  const limpo = sanitizePostHtml(sujo);
  for (const ruim of ["<script", "onerror", "<iframe", "javascript:", "onclick", "style=", "<svg"]) {
    assert.ok(!limpo.toLowerCase().includes(ruim), `sobrou ${ruim}: ${limpo}`);
  }
});

test("mantém o que o artigo usa", () => {
  const html =
    '<h2 id="economia">Economia</h2><p>Texto <strong>forte</strong> e <a href="https://plusenergy.net.br/simulacao" title="t" class="text-pe-green-600">link</a>.</p>' +
    '<ul><li>um</li></ul><table><tr><td colspan="2">x</td></tr></table><img src="https://cdn.exemplo/a.png" alt="a" loading="lazy">' +
    '<div data-mid-cta="true"></div>';
  const limpo = sanitizePostHtml(html);
  for (const bom of ['id="economia"', 'href="https://plusenergy.net.br/simulacao"', 'class="text-pe-green-600"', "<strong>forte</strong>", 'colspan="2"', 'src="https://cdn.exemplo/a.png"', 'data-mid-cta="true"']) {
    assert.ok(limpo.includes(bom), `perdeu ${bom}: ${limpo}`);
  }
});

test("link que abre em outra aba ganha rel noopener", () => {
  assert.match(sanitizePostHtml('<a href="https://x.com" target="_blank">x</a>'), /rel="noopener noreferrer"/);
});

test("vazio vira texto vazio", () => {
  assert.equal(sanitizePostHtml(null), "");
});

test("JSON-LD não fecha a tag script", () => {
  const out = jsonLdSeguro({ headline: '</script><script>alert(1)</script>' });
  assert.ok(!out.includes("</script"), out);
  assert.deepEqual(JSON.parse(out), { headline: '</script><script>alert(1)</script>' });
});
