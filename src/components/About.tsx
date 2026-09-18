import { Code2, ShieldCheck, Workflow } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { SectionHeading } from "./ui";
export function About() {
  return (
    <section id="about" className="section about-section">
      <SectionHeading
        number="01"
        eyebrow="ABOUT"
        title="Curiosity, meet engineering."
      />
      <div className="about-grid">
        <div className="about-copy">
          {portfolio.about.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="focus-list">
          {[
            {
              icon: Code2,
              title: "Build thoughtfully",
              text: "Clear code. Practical solutions.",
            },
            {
              icon: ShieldCheck,
              title: "Think securely",
              text: "Security as part of the design.",
            },
            {
              icon: Workflow,
              title: "Understand the system",
              text: "Look beyond the individual component.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div className="focus-item" key={title}>
              <Icon size={21} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
