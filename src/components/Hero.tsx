import {
  ArrowDown,
  ArrowUpRight,
  FileText,
  Code2,
  ShieldCheck,
  Layers3,
} from "lucide-react";
import { portfolio } from "../data/portfolio";
import { ResourceLink, SocialLinks } from "./ui";
export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="eyebrow">
          <span className="status-dot" /> STUDENT. DEVELOPER. PROBLEM SOLVER.
        </p>
        <p className="hero-name">Hi, I’m {portfolio.name}.</p>
        <h1>
          {portfolio.roles.map((role, i) => (
            <span key={role} className={i === 1 ? "accent-text" : ""}>
              {role}
            </span>
          ))}
        </h1>
        <p className="hero-description">{portfolio.introduction}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            View Projects <ArrowUpRight size={17} />
          </a>
          <ResourceLink
            href={portfolio.resumeUrl}
            className="button button-secondary"
          >
            <FileText size={16} /> View Resume
          </ResourceLink>
          <a className="text-link" href="#contact">
            Contact Me <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="hero-social">
          <SocialLinks />
          <span className="tiny-divider" />
          <span>Software with security in mind.</span>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-grid" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="art-core">
          <Code2 strokeWidth={1.2} />
        </div>
        <div className="art-node node-security">
          <ShieldCheck />
          <span>security</span>
        </div>
        <div className="art-node node-systems">
          <Layers3 />
          <span>systems</span>
        </div>
        <span className="art-coordinate coordinate-top">
          01 / BUILD WITH INTENT
        </span>
        <span className="art-coordinate coordinate-bottom">
          THOUGHTFUL CODE. RELIABLE SYSTEMS.
        </span>
        <div className="art-point point-one" />
        <div className="art-point point-two" />
      </div>
      <div className="hero-bottom">
        <span>
          GEORGIA TECH <span className="muted">/ SOFTWARE & SECURITY</span>
        </span>
        <a href="#about">
          Explore the portfolio <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
