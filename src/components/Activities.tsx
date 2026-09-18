import { portfolio } from "../data/portfolio";
import { ExampleLabel, SectionHeading } from "./ui";
export function Activities() {
  if (!portfolio.activities.length) return null;
  return (
    <section id="activities" className="section">
      <SectionHeading
        number="06"
        eyebrow="BEYOND THE CLASSROOM"
        title="Building together."
      />
      <div className="activity-grid">
        {portfolio.activities.map((activity) => (
          <article
            className="activity-card"
            key={`${activity.name}-${activity.date}`}
          >
            {activity.placeholder && <ExampleLabel />}
            <p className="eyebrow">{activity.date}</p>
            <h3>{activity.name}</h3>
            <p>{activity.role}</p>
            <p className="description">{activity.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
