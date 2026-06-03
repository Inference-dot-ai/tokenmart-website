/* eslint-disable @next/next/no-img-element */
import { coverFor, meshBackground } from "./cover";

export function BlogCover({
  coverImage,
  slug,
  title,
  className,
}: {
  coverImage?: string;
  slug: string;
  title: string;
  className?: string;
}) {
  if (coverImage) {
    return (
      <div className={`blog-cover ${className ?? ""}`}>
        <img src={coverImage} alt={title} loading="lazy" />
      </div>
    );
  }
  const { c1, c2, glyph } = coverFor(slug);
  return (
    <div className={`blog-cover ${className ?? ""}`} style={{ background: meshBackground(c1, c2) }}>
      <span className="blog-cover-glyph">{glyph}</span>
    </div>
  );
}
