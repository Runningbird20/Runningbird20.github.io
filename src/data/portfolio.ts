export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  dates: string;
  location: string;
  description: string;
  accomplishments: string[];
  technologies: string[];
  placeholder?: boolean;
}
export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  featured?: boolean;
  placeholder?: boolean;
  image?: { src: string; alt: string };
  illustration: "network" | "terminal" | "layers";
}
export interface Activity {
  name: string;
  role: string;
  date: string;
  description: string;
  placeholder?: boolean;
}
export interface Portfolio {
  name: string;
  initials: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  roles: string[];
  introduction: string;
  about: string[];
  seo: { title: string; description: string };
  experience: ExperienceEntry[];
  skills: { category: string; items: string[] }[];
  skillsAreExamples: boolean;
  education: {
    institution: string;
    degree: string;
    graduation: string;
    coursework: string[];
    gpa: string;
    details: string;
  };
  activities: Activity[];
}
// Replace REPLACE_ME values. Missing/placeholder destinations render as disabled controls.
export const portfolio: Portfolio = {
  name: "Your Name",
  initials: "YN",
  email: "REPLACE_ME@example.com",
  githubUrl: "https://github.com/REPLACE_ME",
  linkedinUrl: "https://www.linkedin.com/in/REPLACE_ME",
  resumeUrl: "REPLACE_ME",
  roles: ["Software Developer.", "Security Engineering."],
  introduction:
    "Georgia Tech student exploring the intersection of software and security. I’m interested in building reliable systems and solving problems that matter.",
  about: [
    "I’m a student at Georgia Tech with an interest in how software is built, how it breaks, and how to make it more dependable.",
    "My focus spans software development and security engineering. I enjoy learning new technologies, understanding the tradeoffs behind a design, and turning challenging problems into thoughtful, practical solutions.",
  ],
  seo: {
    title: "Your Name — Software & Security Engineering",
    description:
      "The portfolio of Your Name, a Georgia Tech student interested in software development, cybersecurity, and reliable systems.",
  },
  experience: [
    {
      id: "example-experience",
      organization: "Organization name",
      role: "Software Engineering Role",
      dates: "Start date — End date",
      location: "City, State / Remote",
      placeholder: true,
      description:
        "Replace this example with a brief overview of your role, team, and the problem you worked on.",
      accomplishments: [
        "Describe a feature or system you built and your contribution.",
        "Explain a technical challenge, the approach you took, and the outcome.",
        "Include a measurable result only when you have evidence for it.",
      ],
      technologies: ["Technology", "Framework", "Tool"],
    },
  ],
  skillsAreExamples: true,
  skills: [
    { category: "Languages", items: ["Python", "TypeScript", "Java", "SQL"] },
    { category: "Frameworks", items: ["React", "Node.js", "FastAPI"] },
    {
      category: "Security",
      items: ["Threat modeling", "Secure development", "Network fundamentals"],
    },
    { category: "Cloud / Infrastructure", items: ["Linux", "Docker", "AWS"] },
    {
      category: "Developer Tools",
      items: ["Git", "GitHub Actions", "VS Code", "Postman"],
    },
  ],
  education: {
    institution: "Georgia Institute of Technology",
    degree: "Add your degree / program",
    graduation: "Add expected graduation",
    coursework: [],
    gpa: "",
    details: "",
  },
  // Optional: add real activities here. An empty array hides the entire section.
  // Example: { name: 'JPMorgan Chase Code for Good', role: 'Your role', date: 'Year', description: 'Describe your actual contribution.' }
  activities: [
    {
      name: "Engineering activity / hackathon",
      role: "Your role",
      date: "Add date",
      description:
        "Replace with an event you attended and explain your contribution, team, and what you built or learned.",
      placeholder: true,
    },
  ],
};
