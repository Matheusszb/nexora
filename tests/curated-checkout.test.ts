import assert from "node:assert/strict";
import test from "node:test";
import { isCaktoCheckoutUrl } from "../src/lib/checkout";
import { isLegacyIbgeProduct, isLegacyPcpeProduct, isLegacyPmspProduct } from "../src/lib/curated-products";

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
});
