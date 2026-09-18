import { GraduationCap, ArrowUpRight } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { SectionHeading, Tags } from "./ui";
export function Education() {
  const education = portfolio.education;
  return (
    <section id="education" className="section">
      <SectionHeading
        number="05"
        eyebrow="EDUCATION"
        title="A foundation for what’s next."
      />
      <article className="education-card">
        <div className="education-icon">
          <GraduationCap size={28} />
        </div>
        <div className="education-content">
          <h3>{education.institution}</h3>
          <p>{education.degree}</p>
          {education.gpa && <p>GPA: {education.gpa}</p>}
          {education.details && <p>{education.details}</p>}
          {education.coursework.length > 0 && (
            <div className="coursework">
              <h4>Relevant coursework</h4>
              <Tags items={education.coursework} />
            </div>
          )}
        </div>
        <p className="graduation-date">
          {education.graduation}
          <ArrowUpRight size={16} />
        </p>
      </article>
    </section>
  );
}
