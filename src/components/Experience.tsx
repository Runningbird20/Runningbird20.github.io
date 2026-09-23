import { useEffect, useRef } from "react";
import { ArrowUpRight, MapPin, Calendar, Briefcase } from "lucide-react";
import { portfolio } from "../data/portfolio";
import type { ExperienceEntry } from "../data/portfolio";
import { ExampleLabel, ResourceLink, SectionHeading, Tags } from "./ui";

function TimelineCard({
  entry,
  index,
  total,
}: {
  entry: ExperienceEntry;
  index: number;
  total: number;
}) {
  return (
    <article className="experience-timeline-card" data-index={index}>
      <div className="card-timeline-node" aria-hidden="true">
        <span className="node-pip" />
        <span className="node-step">
          0{index + 1} / 0{total}
        </span>
      </div>
      <div className="experience-dates">
        <p className="experience-date-badge">
          <Calendar size={13} />
          {entry.dates}
        </p>
        <span className="experience-location-badge">
          <MapPin size={13} />
          {entry.location}
        </span>
      </div>
      <div className="experience-body">
        {entry.placeholder && <ExampleLabel />}
        <h3 className="experience-role-title">{entry.role}</h3>
        <p className="organization">
          <Briefcase size={14} className="org-icon" />
          {entry.organization}
        </p>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTravel = () => {
      if (!containerRef.current || !trackRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const travel = Math.max(0, trackWidth - containerWidth + 60);
      containerRef.current.style.setProperty("--max-travel", `${travel}px`);
    };

    updateTravel();
    window.addEventListener("resize", updateTravel);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateTravel);
      if (containerRef.current) ro.observe(containerRef.current);
      if (trackRef.current) ro.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateTravel);
      ro?.disconnect();
    };
  }, []);

  return (
    <section id="experience" className="section experience-section">
      <div className="heading-row">
        <SectionHeading
          number="02"
          eyebrow="EXPERIENCE TIMELINE"
          title="Learning by building."
        />
        <div className="experience-header-actions">
          <span className="timeline-hint-badge" aria-hidden="true">
            SCROLL TO EXPLORE TIMELINE →
          </span>
          <ResourceLink href={portfolio.resumeUrl} className="text-link">
            Full resume <ArrowUpRight size={16} />
          </ResourceLink>
        </div>
      </div>

      {/* Timeline track container */}
      <div ref={containerRef} className="experience-timeline-container">
        {/* Horizontal axis guide */}
        <div className="experience-timeline-axis" aria-hidden="true">
          <div className="axis-line" />
          <div className="axis-line-fill" />
        </div>

        {/* Scrollable track that translates along X */}
        <div ref={trackRef} className="experience-timeline-track">
          {portfolio.experience.map((entry, index) => (
            <TimelineCard
              key={entry.id}
              entry={entry}
              index={index}
              total={portfolio.experience.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
