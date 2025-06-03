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
      <h1>
        <span ref={typedRef}></span>
      </h1>
      <p>
        Raleway HTML5 template is provided by <a href="#">templatemo</a>. Credit goes to <a href="#">Unsplash</a> for photos.
        Feel free to modify and use this layout for any personal or commercial website.
      </p>
      <div className="icons">
        <span>🏆</span><span>🎖️</span><span>🪄</span><span>💬</span>
      </div>
    </section>
  );
}