import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { ResourceLink } from "./ui";
export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
      <h2>
        Let’s Connect<span>.</span>
      </h2>
      <p>
        Have an engineering opportunity, a project idea, or a question?
        <br className="desktop-break" /> I’d be happy to start a conversation.
      </p>
      <div className="contact-links">
        <ResourceLink
          href={`mailto:${portfolio.email}`}
          className="button button-primary"
        >
          <Mail size={17} /> Email me <ArrowUpRight size={17} />
        </ResourceLink>
        <ResourceLink href={portfolio.linkedinUrl} className="text-link">
          <Linkedin size={17} /> LinkedIn <ArrowUpRight size={15} />
        </ResourceLink>
        <ResourceLink href={portfolio.githubUrl} className="text-link">
          <Github size={17} /> GitHub <ArrowUpRight size={15} />
        </ResourceLink>
      </div>
    </section>
  );
}
