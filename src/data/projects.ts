import type { Project } from "./portfolio";
// These are illustrative concepts, not claims of completed work. Replace before publishing.
export const projects: Project[] = [
  {
    id: "secure-api",
    name: "Secure API platform",
    category: "BACKEND / SECURITY",
    description:
      "Example concept: an API built around thoughtful authentication, input validation, and clear audit trails. Replace with a project you built and the decisions behind it.",
    technologies: ["Python", "FastAPI", "PostgreSQL"],
    githubUrl: "REPLACE_ME",
    demoUrl: "REPLACE_ME",
    featured: true,
    placeholder: true,
    illustration: "network",
  },
  {
    id: "log-explorer",
    name: "Security log explorer",
    category: "SECURITY / TOOLING",
    description:
      "Example concept: a tool for making sense of application logs and investigating unusual patterns. Replace with your implementation and what you learned.",
    technologies: ["Python", "SQL", "Docker"],
    githubUrl: "REPLACE_ME",
    demoUrl: "REPLACE_ME",
    placeholder: true,
    illustration: "terminal",
  },
  {
    id: "developer-workspace",
    name: "Developer workspace",
    category: "FULL STACK / WEB",
    description:
      "Example concept: a focused web app for organizing technical projects. Replace with your own product, its core features, and your engineering contribution.",
    technologies: ["React", "TypeScript", "Node.js"],
    githubUrl: "REPLACE_ME",
    demoUrl: "REPLACE_ME",
    placeholder: true,
    illustration: "layers",
  },
];
