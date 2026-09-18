import {
  ArrowUpRight,
  Github,
  ShieldCheck,
  Terminal,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import type { Project } from "../data/portfolio";
import { ExampleLabel, ResourceLink, Tags } from "./ui";
function ProjectVisual({ project }: { project: Project }) {
  if (project.image)
    return (
      <div className="project-visual">
        <img src={project.image.src} alt={project.image.alt} loading="lazy" />
      </div>
    );
  return (
    <div
      className={`project-visual visual-${project.illustration}`}
      aria-hidden="true"
    >
      {project.illustration === "network" ? (
        <div className="network-diagram">
          <div className="diagram-node">
            <LockKeyhole size={18} />
          </div>
          <div className="diagram-line" />
          <div className="diagram-hub">
            <ShieldCheck size={34} strokeWidth={1.2} />
          </div>
          <div className="diagram-line" />
          <div className="diagram-node">
            <Layers3 size={18} />
          </div>
        </div>
      ) : project.illustration === "terminal" ? (
        <div className="mini-terminal">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <Terminal size={13} />
          </div>
          <div className="terminal-code">
            <span>› analyze --source logs</span>
            <i />
            <i />
            <i />
            <span className="terminal-cursor">_</span>
          </div>
        </div>
      ) : (
        <div className="mini-workspace">
          <div className="workspace-sidebar">
            <Layers3 size={16} />
            <i />
            <i />
            <i />
          </div>
          <div className="workspace-main">
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
    </div>
  );
}
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className={`project-card ${project.featured ? "featured-project" : ""}`}
    >
      <div className="project-art-wrap">
        <ProjectVisual project={project} />
        <span className="project-index">0{index + 1}</span>
        {project.featured && (
          <span className="featured-label">
            {project.placeholder ? "Featured concept" : "Featured project"}
          </span>
        )}
      </div>
      <div className="project-content">
        <p className="eyebrow">{project.category}</p>
        <h3>{project.name}</h3>
        {project.placeholder && <ExampleLabel />}
        <p className="description">{project.description}</p>
        <Tags items={project.technologies} />
        <div className="project-links">
          <ResourceLink
            href={project.githubUrl}
            label={`${project.name} GitHub repository`}
          >
            <Github size={16} /> GitHub
          </ResourceLink>
          <ResourceLink
            href={project.demoUrl}
            label={`${project.name} live demo`}
          >
            Live Demo <ArrowUpRight size={16} />
          </ResourceLink>
        </div>
      </div>
    </article>
  );
}
