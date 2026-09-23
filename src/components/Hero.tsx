import { ArrowDown } from "lucide-react";
import { portfolio } from "../data/portfolio";

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero-content">
        <p className="hero-name">Hi, I’m {portfolio.name}</p>
        <h1 id="hero-heading">
          {portfolio.roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </h1>
      </div>
      <a
        className="hero-scroll"
        href="#about"
        data-magnetic
        aria-label="Scroll into corridor to explore about sector"
      >
        Scroll into corridor <ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
