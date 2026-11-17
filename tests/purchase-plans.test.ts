import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PurchasePlans } from "../src/components/purchase-plans";

test("oferta com dois planos preserva checkouts separados", () => {
  const html = renderToStaticMarkup(createElement(PurchasePlans, {
    slug: "preparatorio-pmmg",
    basicName: "Preparatório PMMG",
    basicPrice: "R$ 29,90",
    basicIncluded: ["Apostila digital"],
    basicAvailable: true,
    upgradeName: "Combo completo",
    upgradeDescription: "Apostila e simulados",
    upgradeIncluded: ["Simulados"],
    upgradePrice: "R$ 47,00",
    upgradeDifference: "R$ 17,10",
    upgradeAvailable: true
  }));
  assert.match(html, /Escolher básico/);
  assert.match(html, /Quero o combo por R\$ 47,00/);
  assert.match(html, /\/comprar\/preparatorio-pmmg\?plano=basico/);
  assert.match(html, /\/comprar\/preparatorio-pmmg\?plano=combo/);
});
