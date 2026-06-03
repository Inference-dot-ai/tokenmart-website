import { SectionLabel, CornerBadge } from "./primitives";
import { TM_BENEFITS } from "./catalog";

export function Benefits() {
  return (
    <section className="tm-benefits" id="bulk">
      <SectionLabel kicker="WHY BUY WHOLESALE" title="The perks" />
      <div className="tm-benefit-grid">
        {TM_BENEFITS.map((b) => (
          <div className="tm-benefit" key={b.t}>
            <CornerBadge tone={b.tone}>{b.tag}</CornerBadge>
            <div className="tm-benefit-ic">{b.icon}</div>
            <h3>{b.t}</h3>
            <p>{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
