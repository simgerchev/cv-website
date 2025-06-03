import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function Intro() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Backend Development.",
        "Frontend Development.",
        "Devops Development.",
      ],
      typeSpeed: 30,
      backSpeed: 25,
      loop: true
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="intro">
      <h1 className="intro-title">
        <span ref={typedRef}></span>
      </h1>
      <p className="intro-lead">
        My name is <span className="intro-name">Simeon</span>, I’m 24 years old and I have completed two vocational trainings in IT: 
        one as an IT Specialist with a focus on Multimedia, and another as an IT Specialist in Application Development.<br />
        I’m passionate about <span className="intro-highlight">programming</span>, but I’m also very interested in <span className="intro-highlight">IT infrastructure</span>, <span className="intro-highlight">cybersecurity</span>, and <span className="intro-highlight">DevOps</span>.
      </p>
      <div className="icons">
        <span>🌊</span><span>🌊</span><span>🌊</span><span>🌊</span>
      </div>
    </section>
  );
}