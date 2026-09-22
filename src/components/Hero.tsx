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
      <a className="hero-scroll" href="#about" data-magnetic>
        Scroll to explore <ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
