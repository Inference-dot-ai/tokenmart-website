import { SectionLabel, fmt } from "./primitives";
import { TM_COMPARE } from "./catalog";

export function PricingCompare() {
  const totalRetail = TM_COMPARE.reduce((a, b) => a + b.retail, 0);
  const totalWhole = TM_COMPARE.reduce((a, b) => a + b.whole, 0);
  const save = Math.round((1 - totalWhole / totalRetail) * 100);
  return (
    <section className="tm-pricing" id="pricing">
      <SectionLabel
        kicker="RECEIPT CHECK"
        title="Retail vs. wholesale"
        sub="Per 1M output tokens. Same models, same uptime — minus the markup."
      />
      <div className="tm-receipt">
        <div className="tm-receipt-head">
          <span>MODEL</span>
          <span className="tm-rc-r">LIST PRICE</span>
          <span className="tm-rc-w">TOKENMART</span>
          <span className="tm-rc-s">YOU SAVE</span>
        </div>
        {TM_COMPARE.map((r) => {
          const pct = Math.round((1 - r.whole / r.retail) * 100);
          return (
            <div className="tm-receipt-row" key={r.model}>
              <span className="tm-rc-m">{r.model}</span>
              <span className="tm-rc-r">
                <s>${fmt(r.retail)}</s>
              </span>
              <span className="tm-rc-w">${fmt(r.whole)}</span>
              <span className="tm-rc-s">−{pct}%</span>
            </div>
          );
        })}
        <div className="tm-receipt-total">
          <span className="tm-rc-m">BASKET TOTAL</span>
          <span className="tm-rc-r">
            <s>${fmt(totalRetail)}</s>
          </span>
          <span className="tm-rc-w">${fmt(totalWhole)}</span>
          <span className="tm-rc-s big">−{save}%</span>
        </div>
        <div className="tm-receipt-foot">
          <span className="tm-barcode" />
          THANK YOU FOR SHOPPING WHOLESALE · MEMBER #TKN-2026
        </div>
      </div>
    </section>
  );
}
