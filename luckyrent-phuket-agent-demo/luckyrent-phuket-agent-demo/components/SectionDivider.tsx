import type { ReactNode } from "react";

/** Roman-numeral section divider (editorial motif from the reference). */
export default function SectionDivider({
  num,
  title,
}: {
  num: string;
  title: string;
}) {
  return (
    <div className="divider" aria-hidden="true">
      <span className="num">{num}</span>
      <span className="line" />
      <span className="title">{title}</span>
    </div>
  );
}

export function PanelHeading({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 26 }}>
      {eyebrow ? <p className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</p> : null}
      <h2>{children}</h2>
    </div>
  );
}
