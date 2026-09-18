import { portfolio } from "../data/portfolio";
import { SectionHeading, Tags } from "./ui";
export function Skills() {
  return (
    <section id="skills" className="section">
      <SectionHeading
        number="04"
        eyebrow="TOOLKIT"
        title="The tools behind the work."
      />
      {portfolio.skillsAreExamples && (
        <p className="section-note">
          Example skills — replace with technologies you’ve actually used.
        </p>
      )}
      <div className="skills-grid">
        {portfolio.skills.map((group, index) => (
          <div key={group.category} className="skill-group">
            <span className="skill-index">0{index + 1}</span>
            <h3>{group.category}</h3>
            <Tags items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}
