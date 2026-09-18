import { ArrowUpRight, MapPin } from "lucide-react";
import { portfolio } from "../data/portfolio";
import type { ExperienceEntry } from "../data/portfolio";
import { ExampleLabel, ResourceLink, SectionHeading, Tags } from "./ui";
function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="experience-card">
      <div className="experience-dates">
        <span className="timeline-dot" />
        <p>{entry.dates}</p>
        <span>
          <MapPin size={13} />
          {entry.location}
        </span>
      </div>
      <div className="experience-body">
        {entry.placeholder && <ExampleLabel />}
        <h3>{entry.role}</h3>
        <p className="organization">{entry.organization}</p>
        <p className="description">{entry.description}</p>
        <ul className="accomplishments">
          {entry.accomplishments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Tags items={entry.technologies} />
      </div>
    </article>
  );
}
export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="heading-row">
        <SectionHeading
          number="02"
          eyebrow="EXPERIENCE"
          title="Learning by building."
        />
        <ResourceLink href={portfolio.resumeUrl} className="text-link">
          Full resume <ArrowUpRight size={16} />
        </ResourceLink>
      </div>
      {portfolio.experience.map((entry) => (
        <ExperienceCard key={entry.id} entry={entry} />
      ))}
    </section>
  );
}
