import { ArrowUp } from "lucide-react";
import { portfolio } from "../data/portfolio";
import { SocialLinks } from "./ui";
export function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {portfolio.name}
        <span>Built with intention.</span>
      </p>
      <div>
        <SocialLinks />
        <a className="back-top" href="#home" aria-label="Back to top">
          <ArrowUp size={17} />
        </a>
      </div>
    </footer>
  );
}
