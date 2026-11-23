import assert from "node:assert/strict";
import test from "node:test";
import { isCaktoCheckoutUrl } from "../src/lib/checkout";
import { curatedProducts, isLegacyGcmProduct, isLegacyIbgeProduct, isLegacyPcpeProduct, isLegacyPmspProduct, isLegacyPrfProduct } from "../src/lib/curated-products";

test("preços das apostilas prioritárias seguem os valores informados para a loja", () => {
  const prices = Object.fromEntries(curatedProducts.map(product => [product.slug, product.priceCents]));
  assert.equal(prices["prf-2026"], 1990);
  assert.equal(prices["gcm-2026"], 1900);
  assert.equal(prices["banestes-tecnico-bancario"], 3400);
  assert.equal(prices["tjsp-escrevente"], 3400);
});

test("checkout da página própria aceita apenas Cakto HTTPS", () => {
  assert.equal(isCaktoCheckoutUrl("https://pay.cakto.com.br/abc123"), true);
  for (const url of [
    "http://pay.cakto.com.br/abc123",
    "https://pay.cakto.com.br.evil.test/abc123",
    "https://cakto.com.br/abc123",
    "https://pay.kiwify.com.br/abc123",
    "https://usuario:senha@pay.cakto.com.br/abc123"
  ]) assert.equal(isCaktoCheckoutUrl(url), false, url);
});

test("produtos antigos das apostilas são substituídos pelas páginas próprias", () => {
  assert.equal(isLegacyPmspProduct({ name: "Apostila PMSP 2026 — Soldado PM", slug: "apostila-pmsp-2026" }), true);
  assert.equal(isLegacyPmspProduct({ name: "Apostila PM-SP 2026 — Soldado PM", slug: "apostila-pm-sp" }), true);
  assert.equal(isLegacyPmspProduct({ name: "Curso PM-SP 2026 — Soldado PM", slug: "curso-pm-sp" }), false);
  assert.equal(isLegacyPcpeProduct({ name: "Apostila PC-PE 2026 — Agente de Polícia", slug: "apostila-pcpe-agente" }), true);
  assert.equal(isLegacyPcpeProduct({ name: "Curso PC-PE — Agente de Polícia", slug: "curso-pcpe" }), false);
  assert.equal(isLegacyIbgeProduct({ name: "Apostila IBGE 2026/2027 — Recenseador", slug: "apostila-ibge-recenseador" }), true);
  assert.equal(isLegacyIbgeProduct({ name: "Curso IBGE — Recenseador", slug: "curso-ibge-recenseador" }), false);
  assert.equal(isLegacyGcmProduct({ name: "Apostila GCM 2026 — Guarda Civil Municipal", slug: "apostila-gcm" }), true);
  assert.equal(isLegacyGcmProduct({ name: "Curso GCM 2026", slug: "curso-gcm" }), false);
  assert.equal(isLegacyPrfProduct({ name: "Apostila PRF 2026", slug: "apostila-prf" }), true);
  assert.equal(isLegacyPrfProduct({ name: "Curso PRF 2026", slug: "curso-prf" }), false);
});
