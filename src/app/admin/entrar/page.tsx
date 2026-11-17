import type { Metadata } from "next";
import Link from "next/link";
import { login } from "../actions";

export const metadata: Metadata = { title: "Entrar no painel", robots: { index: false, follow: false } };
export default async function Login({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return <main className="admin-login"><div className="admin-login-card"><Link href="/" className="admin-login-back">← Voltar à loja</Link><div className="admin-login-logo"><img src="/nexora-logo.png" alt="Nexora Digital"/></div><span className="eyebrow">ACESSO RESTRITO</span><h1>Bem-vindo ao painel</h1><p>Entre com as credenciais de administrador.</p>{erro && <div className="form-error" role="alert">{erro === "limite" ? "Muitas tentativas. Aguarde 15 minutos antes de tentar novamente." : "Credenciais inválidas. Verifique os dados e tente novamente."}</div>}<form action={login} className="admin-login-form"><label>E-mail<input className="field" type="email" name="email" required autoComplete="username"/></label><label>Senha<input className="field" type="password" name="password" required autoComplete="current-password"/></label><button className="btn btn-primary" type="submit">Entrar no painel →</button></form></div></main>;
}
