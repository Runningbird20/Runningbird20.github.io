import type { ReactNode } from "react";
import { Github, Linkedin } from "lucide-react";
import { portfolio } from "../data/portfolio";
export function safeHref(value: string): string | undefined {
  if (!value || /REPLACE_ME|example\.com/i.test(value)) return undefined;
  if (/^\/(?!\/)/.test(value)) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:"].includes(url.protocol)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
export function ResourceLink({
  href,
  children,
  className = "",
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const destination = safeHref(href);
  if (!destination)
    return (
      <span
        className={`${className} unavailable`}
        role="link"
        aria-disabled="true"
        aria-label={label ? `${label} — not configured` : undefined}
        title="Not configured yet"
      >
        {children}
      </span>
    );
  const external = /^https?:/.test(destination);
  return (
    <a
      href={destination}
      data-magnetic
      className={className}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
export function SocialLinks() {
  return (
    <div className="social-links">
      <ResourceLink
        href={portfolio.githubUrl}
        label="GitHub"
        className="icon-link"
      >
        <Github size={18} />
      </ResourceLink>
      <ResourceLink
        href={portfolio.linkedinUrl}
        label="LinkedIn"
        className="icon-link"
      >
        <Linkedin size={18} />
      </ResourceLink>
    </div>
  );
}
export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{number}</span> / {eyebrow}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
export function ExampleLabel() {
  return (
    <span className="example-label">Example · replace with your work</span>
  );
}
