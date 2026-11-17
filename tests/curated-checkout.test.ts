import assert from "node:assert/strict";
import test from "node:test";
import { isCaktoCheckoutUrl } from "../src/lib/checkout";
import { isLegacyPmspProduct } from "../src/lib/curated-products";

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

test("produto antigo da PMSP é substituído pela página própria", () => {
  assert.equal(isLegacyPmspProduct({ name: "Apostila PMSP 2026 — Soldado PM", slug: "apostila-pmsp-2026" }), true);
  assert.equal(isLegacyPmspProduct({ name: "Apostila PM-SP 2026 — Soldado PM", slug: "apostila-pm-sp" }), true);
  assert.equal(isLegacyPmspProduct({ name: "Curso PM-SP 2026 — Soldado PM", slug: "curso-pm-sp" }), false);
});
