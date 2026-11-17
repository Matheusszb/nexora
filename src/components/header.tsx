import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return <header className="site-header">
    <div className="container header-inner">
      <Logo />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link href="/">Início</Link><Link href="/produtos">Materiais</Link><Link href="/#categorias">Áreas de concurso</Link><Link href="/sobre">Sobre nós</Link><Link href="/contato">Contato</Link>
      </nav>
      <form action="/produtos" className="header-search" role="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
        <input type="search" name="q" placeholder="Buscar concurso" aria-label="Buscar materiais para concursos" />
      </form>
      <details className="mobile-menu">
        <summary aria-label="Abrir menu"><span/><span/><span/></summary>
        <nav aria-label="Navegação móvel"><Link href="/">Início</Link><Link href="/produtos">Materiais</Link><Link href="/#categorias">Áreas de concurso</Link><Link href="/sobre">Sobre nós</Link><Link href="/contato">Contato</Link><form action="/produtos"><input type="search" name="q" placeholder="Buscar concurso" aria-label="Buscar materiais para concursos"/><button type="submit">Buscar</button></form></nav>
      </details>
    </div>
  </header>;
}
