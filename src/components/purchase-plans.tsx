"use client";

import { useRef } from "react";
import { CheckoutLink } from "./campaign-capture";

type Props = {
  slug: string;
  basicName: string;
  basicPrice: string;
  compareAtPrice?: string;
  basicIncluded: string[];
  basicAvailable: boolean;
  upgradeName?: string | null;
  upgradeDescription: string;
  upgradeIncluded: string[];
  upgradePrice?: string;
  upgradeDifference?: string;
  upgradeAvailable: boolean;
};

export function PurchasePlans(props: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const hasUpgrade = Boolean(props.upgradeName && props.upgradePrice && props.upgradeAvailable);

  return <section id="planos" className="section product-plans">
    <div className="container">
      <div className="section-head product-section-center"><div><span className="eyebrow">ESCOLHA SEU PLANO</span><h2>Como você quer começar?</h2><p>Compare o conteúdo de cada opção antes de seguir para o checkout.</p></div></div>
      <div className={hasUpgrade ? "plan-grid" : "plan-grid plan-grid-single"}>
        <article className="plan-card">
          <span className="plan-kicker">PLANO BÁSICO</span>
          <h3>{props.basicName}</h3>
          <p>Para começar com o conteúdo principal deste material.</p>
          {props.compareAtPrice && <span className="plan-previous-price">{props.compareAtPrice}</span>}
          <strong className="plan-price">{props.basicPrice}</strong>
          <ul>{props.basicIncluded.length ? props.basicIncluded.map((item, index) => <li key={index}>{item}</li>) : <li>Material descrito nesta página</li>}</ul>
          {props.basicAvailable ? hasUpgrade ? <button type="button" className="btn btn-outline plan-action" onClick={() => dialog.current?.showModal()}>Escolher básico</button> : <CheckoutLink slug={props.slug} className="btn btn-primary plan-action">Comprar material ↗</CheckoutLink> : <button className="btn btn-outline plan-action" disabled>Compra indisponível</button>}
        </article>
        {hasUpgrade && <article className="plan-card plan-card-featured">
          <span className="plan-label">OPÇÃO COMPLETA</span>
          <span className="plan-kicker">PLANO COMBO</span>
          <h3>{props.upgradeName}</h3>
          <p>{props.upgradeDescription || "Inclui o material básico e os itens adicionais listados abaixo."}</p>
          <strong className="plan-price">{props.upgradePrice}</strong>
          <ul><li>Conteúdo do plano básico</li>{props.upgradeIncluded.map((item, index) => <li key={index}>{item}</li>)}</ul>
          <CheckoutLink slug={props.slug} plan="combo" className="btn btn-primary plan-action">Escolher combo ↗</CheckoutLink>
        </article>}
      </div>
      <p className="plan-note">O pagamento e as condições finais aparecem no checkout do plano escolhido.</p>
    </div>
    {hasUpgrade && <dialog ref={dialog} className="upgrade-dialog" aria-labelledby="upgrade-dialog-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="upgrade-dialog-content">
        <button type="button" className="upgrade-close" aria-label="Fechar oferta" onClick={() => dialog.current?.close()}>×</button>
        <span className="upgrade-icon" aria-hidden="true">✦</span>
        <span className="eyebrow">ANTES DE CONTINUAR</span>
        <h2 id="upgrade-dialog-title">Quer incluir o combo?</h2>
        <p>{props.upgradeDifference ? `Por mais ${props.upgradeDifference}, você pode escolher ${props.upgradeName}.` : `Você também pode escolher ${props.upgradeName}.`}</p>
        <ul>{props.upgradeIncluded.map((item, index) => <li key={index}>{item}</li>)}</ul>
        <CheckoutLink slug={props.slug} plan="combo" className="btn btn-primary upgrade-primary">Quero o combo por {props.upgradePrice} ↗</CheckoutLink>
        <CheckoutLink slug={props.slug} className="upgrade-secondary">Continuar só com o básico por {props.basicPrice}</CheckoutLink>
      </div>
    </dialog>}
  </section>;
}
