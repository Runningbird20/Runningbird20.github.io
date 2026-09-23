import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { CustomCursor } from "./effects/CustomCursor";
import { LivingBackground } from "./effects/LivingBackground";
import { BootSequence } from "./effects/BootSequence";
import { ScrollJourney, type JourneyStage } from "./effects/ScrollJourney";
import { useInteraction } from "./hooks/useInteraction";
import { usePointerPhysics } from "./hooks/usePointerPhysics";
import { shouldShowIntro } from "./lib/animation";
import { portfolio } from "./data/portfolio";
import { SocialLinks } from "./components/ui";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Activities } from "./components/Activities";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const interaction = useInteraction();
  const [introActive, setIntroActive] = useState(shouldShowIntro);
  usePointerPhysics(!introActive);
  const [hasFinished, setHasFinished] = useState(false);

  const finishIntro = useCallback(() => {
    setIntroActive(false);
    setHasFinished(true);
  }, []);

  useLayoutEffect(() => {
    if (hasFinished)
      document.getElementById("main")?.focus({ preventScroll: true });
  }, [hasFinished]);

  const stages: JourneyStage[] = useMemo(() => {
    const list: JourneyStage[] = [
      {
        id: "home",
        label: "HOME",
        sectorCode: "PORTAL DECK",
        content: <Hero />,
      },
      {
        id: "about",
        label: "ABOUT",
        sectorCode: "IDENTITY SPECS",
        content: <About />,
      },
      {
        id: "projects",
        label: "PROJECTS",
        sectorCode: "ARCHIVE VAULT",
        content: <Projects />,
      },
      {
        id: "experience",
        label: "EXPERIENCE",
        sectorCode: "MISSION LOGS",
        content: <Experience />,
        horizontalSpan: 2.8,
      },
      {
        id: "skills",
        label: "SKILLS",
        sectorCode: "SYSTEM MATRIX",
        content: <Skills />,
      },
      {
        id: "education",
        label: "EDUCATION",
        sectorCode: "KNOWLEDGE BASE",
        content: <Education />,
      },
    ];

    if (portfolio.activities.length > 0) {
      list.push({
        id: "activities",
        label: "ACTIVITIES",
        sectorCode: "SIGNALS",
        content: <Activities />,
      });
    }

    list.push({
      id: "contact",
      label: "CONTACT",
      sectorCode: "DIRECT UPLINK",
      content: (
        <div className="contact-stage-wrap">
          <Contact />
          <Footer />
        </div>
      ),
    });

    return list;
  }, []);

  return (
    <>
      <CustomCursor enabled={!introActive} interaction={interaction} />
      <LivingBackground interaction={interaction} introActive={introActive} />
      <BootSequence
        active={introActive}
        onComplete={finishIntro}
        interaction={interaction}
      />
      <div
        className={
          introActive || hasFinished
            ? "portfolio-page intro-visible"
            : "portfolio-page"
        }
        inert={introActive}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <main id="main" tabIndex={-1}>
          <ScrollJourney stages={stages} active={!introActive} />
        </main>
        <div className="floating-social-links" aria-label="Social Profiles">
          <SocialLinks />
        </div>
      </div>
    </>
  );
}
