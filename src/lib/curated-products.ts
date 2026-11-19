export const curatedProducts = [
  {
    slug: "banestes-tecnico-bancario",
    name: "Apostila BANESTES 2026/2027 | Técnico Bancário",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · TÉCNICO BANCÁRIO",
    shortDescription: "Preparação em nove disciplinas com 44 aulas, 300 questões de treino, três simulados e cronogramas de estudo.",
    searchTerms: "banestes banco do estado do espírito santo tecnico técnico bancário fcc 2026 2027",
    highlights: ["44 aulas", "300 questões", "3 simulados"],
    imageUrl: "/banestes-tecnico-bancario/cartaz.webp",
    priceCents: 3400,
    compareAtPriceCents: null,
    featured: true
  },
  {
    slug: "tjsp-escrevente",
    name: "Apostila TJSP 2026/2027 | Escrevente Técnico Judiciário",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · ESCREVENTE TJSP",
    shortDescription: "Preparação para Escrevente Técnico Judiciário com teoria, exercícios, treino de redação e três simulados autorais.",
    searchTerms: "tjsp tribunal justiça são paulo escrevente técnico judiciário vunesp 2026 2027",
    highlights: ["115 páginas", "3 simulados", "Redação"],
    imageUrl: "/tjsp-escrevente/capa.webp",
    priceCents: 3400,
    compareAtPriceCents: null,
    featured: true
  },
  {
    slug: "pmsp-2026",
    name: "Apostila PM-SP 2026 | Soldado PM",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · SOLDADO PM-SP 2026",
    shortDescription: "Um plano completo de estudo com aulas, questões, simulados e revisão para a preparação de Soldado PM-SP.",
    searchTerms: "pmsp pm-sp polícia militar são paulo soldado",
    highlights: ["47 aulas", "414 itens", "3 simulados"],
    imageUrl: "/pmsp-2026/capa.webp",
    priceCents: 2990,
    compareAtPriceCents: 5990,
    featured: true
  },
  {
    slug: "pcpe-agente",
    name: "Apostila PC-PE 2026 | Agente de Polícia",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · AGENTE PC-PE",
    shortDescription: "Preparação para Agente da Polícia Civil de Pernambuco com 46 aulas, questões, simulados e redação.",
    searchTerms: "pcpe pc-pe polícia civil pernambuco agente polícia recife 2026 2027",
    highlights: ["46 aulas", "497 questões", "3 simulados"],
    imageUrl: "/pcpe-agente/capa.webp",
    priceCents: 2990,
    compareAtPriceCents: 4990,
    featured: true
  },
  {
    slug: "ibge-recenseador",
    name: "Apostila IBGE 2026/2027 | Recenseador",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · RECENSEADOR IBGE",
    shortDescription: "Preparação com 34 aulas, banco de 300 questões, três simulados e cronogramas de estudo.",
    searchTerms: "ibge recenseador censo agropecuário florestal aquícola 2026 2027 cesgranrio",
    highlights: ["34 aulas", "300 questões", "3 simulados"],
    imageUrl: "/ibge-recenseador/capa.webp",
    priceCents: 1990,
    compareAtPriceCents: null,
    featured: true
  },
  {
    slug: "gcm-2026",
    name: "Apostila GCM 2026 | Guarda Civil Municipal",
    productType: "Apostila digital",
    eyebrow: "PÁGINA EXCLUSIVA · GUARDA CIVIL MUNICIPAL",
    shortDescription: "Preparação geral para GCM com 37 aulas, banco de 300 questões, três simulados e planos de estudo.",
    searchTerms: "gcm guarda civil municipal guarda municipal agente 2026 concurso",
    highlights: ["37 aulas", "300 questões", "3 simulados"],
    imageUrl: "/gcm-2026/capa.webp",
    priceCents: 1900,
    compareAtPriceCents: null,
    featured: true
  }
] as const;

export function isLegacyPmspProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /pmsp|pm-sp/i.test(product.name) && /2026/.test(product.name) && /soldado/i.test(product.name);
}

export function isLegacyPcpeProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /pcpe|pc-pe|polícia civil.*pernambuco/i.test(`${product.name} ${product.slug}`) && /agente/i.test(product.name);
}

export function isLegacyIbgeProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /ibge/i.test(`${product.name} ${product.slug}`) && /recenseador/i.test(`${product.name} ${product.slug}`);
}

export function isLegacyGcmProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /gcm|guarda civil municipal/i.test(`${product.name} ${product.slug}`);
}

export function isLegacyBanestesProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /banestes/i.test(`${product.name} ${product.slug}`) && /técnico bancário|tecnico bancario/i.test(product.name);
}

export function isLegacyTjspProduct(product: { name: string; slug: string }) {
  return /apostila/i.test(product.name) && /tjsp|tribunal de justiça.*são paulo/i.test(`${product.name} ${product.slug}`) && /escrevente/i.test(product.name);
}

export function isLegacyCuratedProduct(product: { name: string; slug: string }) {
  return isLegacyPmspProduct(product) || isLegacyPcpeProduct(product) || isLegacyIbgeProduct(product) || isLegacyGcmProduct(product) || isLegacyBanestesProduct(product) || isLegacyTjspProduct(product);
}
