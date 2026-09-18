import { projects } from "../data/projects";
import { SectionHeading } from "./ui";
import { ProjectCard } from "./ProjectCard";
export function Projects() {
  return (
    <section id="projects" className="section projects-section">
      <SectionHeading
        number="03"
        eyebrow="PROJECTS"
        title="Ideas into implementation."
        description="A closer look at the things I build, the problems behind them, and the tools that bring them to life."
      />
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
