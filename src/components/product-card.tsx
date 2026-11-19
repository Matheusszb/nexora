import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import { isOptimizableProductImage } from "@/lib/product-image";

export function ProductCard({ product, hidePrice = false }: { product: Product; hidePrice?: boolean }) {
  return <article className="product-card">
    <Link href={`/concursos/${product.slug}`} className="product-image" aria-label={`Ver ${product.name}`}>
      {product.imageUrl ? <Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized={!isOptimizableProductImage(product.imageUrl)} /> : <div className="cover-placeholder"><div className="cover-orbit"/><span>{product.productType}</span><strong>{product.name}</strong><small>NEXORA DIGITAL</small></div>}
      {product.featured && <span className="card-badge">Destaque</span>}
    </Link>
    <div className="product-card-body"><span className="eyebrow">{product.productType}</span><h3><Link href={`/concursos/${product.slug}`}>{product.name}</Link></h3><p>{product.shortDescription}</p>{!hidePrice && <div className="card-bottom"><div className="price-stack">{product.compareAtPriceCents && <s>{money(product.compareAtPriceCents)}</s>}<strong>{product.upgradePriceCents != null ? "A partir de " : ""}{money(product.priceCents)}</strong></div><Link className="arrow-link" href={`/concursos/${product.slug}`} aria-label={`Ver detalhes de ${product.name}`}>↗</Link></div>}<div className="card-actions"><Link href={`/concursos/${product.slug}`}>{product.checkoutUrl || product.upgradeCheckoutUrl ? "Ver detalhes e comprar" : "Ver detalhes"} ↗</Link></div></div>
  </article>;
}
