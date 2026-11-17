import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return <header className="site-header">
    <div className="container header-inner">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link href="/">Início</Link><Link href="/produtos">Produtos</Link><Link href="/#categorias">Categorias</Link><Link href="/sobre">Sobre nós</Link><Link href="/contato">Contato</Link>
      </nav>
      <form action="/produtos" className="header-search" role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
        <input type="search" name="q" placeholder="Buscar produtos" aria-label="Buscar produtos" />
      </form>
      <details className="mobile-menu">
        <summary aria-label="Abrir menu"><span/><span/><span/></summary>
        <nav aria-label="Navegação móvel"><Link href="/">Início</Link><Link href="/produtos">Produtos</Link><Link href="/#categorias">Categorias</Link><Link href="/sobre">Sobre nós</Link><Link href="/contato">Contato</Link><form action="/produtos"><input type="search" name="q" placeholder="Buscar produtos" aria-label="Buscar produtos"/><button type="submit">Buscar</button></form></nav>
      </details>
    </div>
  </header>;
}
