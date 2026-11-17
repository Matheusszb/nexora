import assert from "node:assert/strict";
import test from "node:test";
import { productSchema, formPrice } from "../src/lib/validation";

const base = {
  name: "Guia de estudos", slug: "guia-de-estudos", categoryId: "category-1",
  shortDescription: "Material digital para organizar seus estudos.", description: "",
  included: "", audience: "", requirements: "", delivery: "", refundPolicy: "",
  productType: "E-book", imageUrl: "", socialImageUrl: "", priceCents: 4900,
  checkoutUrl: "https://pay.kiwify.com.br/abc123", seoTitle: "", metaDescription: "",
  status: "PUBLISHED" as const, featured: false
};

test("aceita apenas checkout HTTPS no domínio oficial", () => {
  assert.equal(productSchema.safeParse(base).success, true);
  for (const url of ["http://pay.kiwify.com.br/abc", "https://pay.kiwify.com.br.evil.test/abc", "https://evil.test/abc", "javascript:alert(1)"]) {
    assert.equal(productSchema.safeParse({ ...base, checkoutUrl: url }).success, false, url);
  }
});

test("recusa preço anterior menor que o atual", () => {
  assert.equal(productSchema.safeParse({ ...base, compareAtPriceCents: 4000 }).success, false);
  assert.equal(productSchema.safeParse({ ...base, compareAtPriceCents: 5900 }).success, true);
});

test("converte preços brasileiros sem perder centavos", () => {
  const form = new FormData(); form.set("price", "1.234,56");
  assert.equal(formPrice(form, "price"), 123456);
  form.set("price", "1234.56");
  assert.equal(formPrice(form, "price"), 123456);
});
