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

export const portfolio: Portfolio = {
  name: "Cristal Williams",
  initials: "CW",
  email: "wcristal005@gmail.com",
  githubUrl: "https://github.com/Runningbird20",
  linkedinUrl: "https://www.linkedin.com/in/cristal-williams-b86758318/",
  resumeUrl: "#",
  roles: ["Software Engineer", "Security Engineer"],
  introduction:
    "Georgia Tech Computer Science student concentrating in Artificial Intelligence and Cybersecurity. Experienced in distributed backend systems at Google and multi-agent security automation at Expedia Group.",
  about: [
    "I’m a Computer Science student at Georgia Tech in the John H. Martinson Honors Program, focusing on Artificial Intelligence and Cybersecurity.",
    "My background spans high-throughput backend engineering and security infrastructure. I’ve refactored critical-path Java microservices serving 50M daily users at Google Play and architected autonomous multi-agent incident triage pipelines at Expedia Group.",
    "I love dissecting complex system architectures, finding performance bottlenecks, and engineering robust, secure software that operates seamlessly at scale.",
  ],
  seo: {
    title: "Cristal Williams — Software & Security Engineering",
    description:
      "The engineering portfolio of Cristal Williams, Computer Science student at Georgia Tech concentrating in AI and Cybersecurity.",
  },
  experience: [
    {
      id: "expedia-group",
      organization: "Expedia Group",
      role: "Security Engineering Intern",
      dates: "May 2026 — Jul 2026",
      location: "Seattle, WA",
      description:
        "Architected and deployed an AI-powered Security Incident Reporting Agent on Glean's agent platform, replacing manual ServiceNow forms and automating security triage.",
      accomplishments: [
        "Architected and deployed an AI-powered Security Incident Reporting Agent on Glean's agent platform, replacing a manual ServiceNow form and reducing average intake time across 7 security event categories.",
        "Engineered a multi-agent system with one primary intake agent and 7 specialized subagents, automating branch-specific email formatting, SOAR platform delivery, and Slack security team alerts, cutting manual triage work by 30% or 20 hours per week.",
        "Implemented intelligent triage and auto-resolution logic, including IT-redirect detection and known-benign pattern matching, which auto-resolved 25% of incoming tickets without analyst intervention.",
      ],
      technologies: [
        "AI Agents",
        "Glean",
        "ServiceNow",
        "SOAR",
        "Slack API",
        "Python",
        "Incident Response",
      ],
    },
    {
      id: "google",
      organization: "Google",
      role: "Software Engineering Intern",
      dates: "May 2025 — Aug 2025",
      location: "Mountain View, CA",
      description:
        "Refactored critical-path Java backend microservices for the Google Play Store checkout flow serving 50 million daily users.",
      accomplishments: [
        "Refactored critical-path Java backend microservices for the Google Play Store checkout flow, serving 50 million daily users, and tuned database queries to reduce latency by 36%.",
        "Collaborated with product, data, and operations teams to identify performance bottlenecks across 3 high-traffic services, using SQL analysis and pandas profiling to drive faster checkout times.",
        "Designed and shipped 2 scalable Java microservices, streamlining deployment pipelines and reducing release time from 5 hours to 3.2 hours.",
      ],
      technologies: [
        "Java",
        "Microservices",
        "Google Play",
        "SQL",
        "Database Tuning",
        "pandas",
        "Distributed Systems",
      ],
    },
    {
      id: "gt-degree-roadmap",
      organization: "Georgia Institute of Technology",
      role: "Full-Stack Software Engineer",
      dates: "Feb 2025 — Present",
      location: "Atlanta, GA",
      description:
        "Built and shipped GT Degree Roadmap, a full-stack degree planning platform used by 1,000 Georgia Tech students.",
      accomplishments: [
        "Built and shipped GT Degree Roadmap, a full-stack degree planning platform used by 1,000 Georgia Tech students, enabling real-time requisite visualization and schedule conflict detection.",
        "Reverse-engineered DegreeWorks PDF transcript structures and built an Oscar web scraper to automate course history ingestion, eliminating 40 hours per week of manual data entry for new users.",
        "Owned full-stack feature development across the React frontend and Firebase backend, implementing real-time data synchronization that reduced page load time by 60%.",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Firebase",
        "Web Scraping",
        "PDF Parsing",
        "Real-Time Data",
      ],
    },
    {
      id: "gt-student-assistant",
      organization: "Georgia Institute of Technology",
      role: "Student Assistant — Automation & Security",
      dates: "Nov 2024 — Present",
      location: "Atlanta, GA",
      description:
        "Built internal automation tooling and implemented AWS IAM security controls for departmental systems and records.",
      accomplishments: [
        "Built internal automation tooling to replace paper-based administrative workflows, reducing document processing turnaround time by 40% and eliminating recurring data-entry errors across 5 departmental operations.",
        "Designed and implemented AWS IAM access controls and encryption policies to secure confidential student records under FERPA compliance requirements, covering 20,000 records and systems.",
        "Wrote and optimized SQL queries and automated reporting pipelines, reducing manual reporting time by 90% and improving database integrity across the Material Science and Engineering Department.",
      ],
      technologies: [
        "AWS IAM",
        "SQL",
        "Workflow Automation",
        "FERPA Compliance",
        "Data Encryption",
        "Python",
      ],
    },
  ],
  skillsAreExamples: false,
  skills: [
    {
      category: "Languages",
      items: ["Python", "Java", "TypeScript", "Swift", "C", "C++", "C#", "SQL"],
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "FastAPI", "SwiftUI", "Django", "NumPy", "pandas", "PyTorch"],
    },
    {
      category: "Infrastructure & Tools",
      items: [
        "AWS",
        "Google Cloud",
        "Firebase",
        "PostgreSQL",
        "Supabase",
        "Git",
        "Docker",
        "Playwright",
      ],
    },
    {
      category: "AI & Machine Learning",
      items: ["LLM Integration", "RAG", "Ollama", "OpenCV", "XGBoost"],
    },
  ],
  education: {
    institution: "Georgia Institute of Technology",
    degree: "Bachelor of Science in Computer Science",
    graduation: "May 2028",
    coursework: [
      "Artificial Intelligence",
      "Cybersecurity",
      "Data Structures & Algorithms",
      "Systems & Networks",
      "Database Systems",
    ],
    gpa: "3.50 / 4.00",
    details:
      "Concentration: Artificial Intelligence & Cybersecurity · John H. Martinson Honors Program",
  },
  activities: [
    {
      name: "RAG Systems Hackathon",
      role: "1st Place Winner",
      date: "2025",
      description:
        "Won 1st place building a full-stack media platform with social tracking, collaborative lists, and a RAG-powered chatbot combining live web search with user-context signals for personalized recommendations.",
      placeholder: false,
    },
    {
      name: "Objects & Design Class Project",
      role: "2nd Place Winner",
      date: "2024",
      description:
        "Awarded 2nd place for building an AI-powered recruiting platform with automated resume parsing, skill-based candidate matching, and geospatial applicant clustering.",
      placeholder: false,
    },
    {
      name: "John H. Martinson Honors Program",
      role: "Honors Scholar",
      date: "2024 — Present",
      description:
        "Selected for Georgia Tech's rigorous honors program, participating in interdisciplinary academic research, leadership initiatives, and specialized seminars.",
      placeholder: false,
    },
  ],
};
