import { useCallback, useLayoutEffect, useState } from "react";
import { LivingBackground } from "./effects/LivingBackground";
import { BootSequence } from "./effects/BootSequence";
import { useInteraction } from "./hooks/useInteraction";
import { shouldShowIntro } from "./lib/animation";
import { Navbar } from "./components/Navbar";
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
  const [hasFinished, setHasFinished] = useState(false);
  const finishIntro = useCallback(() => {
    setIntroActive(false);
    setHasFinished(true);
  }, []);
  useLayoutEffect(() => {
    if (hasFinished)
      document.getElementById("main")?.focus({ preventScroll: true });
  }, [hasFinished]);
  return (
    <>
      <LivingBackground interaction={interaction} introActive={introActive} />
      <BootSequence
        active={introActive}
        onComplete={finishIntro}
        interaction={interaction}
      />
      <div className={introActive || hasFinished ? "portfolio-page intro-visible" : "portfolio-page"} inert={introActive}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="container" tabIndex={-1}>
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Education />
          <Activities />
          <Contact />
        </main>
        <div className="container">
          <Footer />
        </div>
      </div>
    </>
  );
}
