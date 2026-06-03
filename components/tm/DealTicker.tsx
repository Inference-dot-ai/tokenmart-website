import { TM_TICKER } from "./catalog";

export function DealTicker() {
  const items = [...TM_TICKER, ...TM_TICKER];
  return (
    <div className="tm-ticker" aria-hidden="true">
      <div className="tm-ticker-track">
        {items.map((t, i) => (
          <span className="tm-ticker-item" key={i}>
            <span className="tm-ticker-star">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
