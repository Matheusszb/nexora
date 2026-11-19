import Image from "next/image";
import Link from "next/link";
import { curatedProducts } from "@/lib/curated-products";
import { money } from "@/lib/format";
import "./curated-product-card.css";

type CuratedProduct = (typeof curatedProducts)[number];

export function CuratedProductCard({ product, hidePrice = false }: { product: CuratedProduct; hidePrice?: boolean }) {
  return <article className="curated-card">
    <Link href={`/concursos/${product.slug}`} className="curated-card-image" aria-label={`Conhecer ${product.name}`}><Image src={product.imageUrl} alt={`Capa de ${product.name}`} fill sizes="(max-width: 680px) 100vw, 300px" /></Link>
    <div className="curated-card-body"><span className="curated-card-kicker">{product.eyebrow}</span><h3><Link href={`/concursos/${product.slug}`}>{product.name}</Link></h3><p>{product.shortDescription}</p><div className="curated-card-tags">{product.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div><div className={`curated-card-bottom${hidePrice ? " curated-card-bottom-no-price" : ""}`}>{!hidePrice && <strong>{money(product.priceCents)}</strong>}<Link href={`/concursos/${product.slug}`}>Ver apostila e condições <span aria-hidden="true">↗</span></Link></div></div>
  </article>;
}
