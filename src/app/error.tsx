"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="container empty-page"><span className="eyebrow">Erro temporário</span><h1>Não conseguimos carregar esta página.</h1><p>Tente novamente em instantes.</p><button className="btn btn-primary" onClick={reset}>Tentar novamente</button></main>; }
