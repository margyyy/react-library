import { Link } from "react-router-dom";

export type GlassMenuCardProps = {
  title: string;
  link: string;
};

export function GlassMenuCard({ title, link }: GlassMenuCardProps) {
  return (
    <Link
      to={link}
      className="liquid-glass-card group"
    >
      <span aria-hidden="true" className="liquid-glass-blob liquid-glass-blob--top" />
      <span aria-hidden="true" className="liquid-glass-blob liquid-glass-blob--bottom" />
      <span aria-hidden="true" className="liquid-glass-shine" />
      <span className="liquid-glass-title">
        {title}
      </span>
    </Link>
  );
}
