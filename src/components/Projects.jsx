import reactLogo from '../assets/react.svg';

const projects = [
  {
    img: reactLogo,
    title: "React App",
    desc: "A modern React application using hooks and components.",
    tech: ["React", "JavaScript", "CSS"],
    link: "#"
  },
  {
    img: reactLogo,
    title: "SVG Demo",
    desc: "A project showcasing SVG graphics in React.",
    tech: ["SVG", "React"],
    link: "#"
  }
];

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2 style={{ width: "100%", textAlign: "center" }}>My Projects</h2>
      <div className="project-grid">
        {projects.map((proj, idx) => (
          <div className="project-card" key={idx}>
            <img src={proj.img} alt={proj.title} className="project-img" />
            <h3 className="project-title">{proj.title}</h3>
            <p className="project-desc">{proj.desc}</p>
            <div className="project-techstack">
              {proj.tech.map((tech, i) => (
                <span className="tech-badge" key={i}>{tech}</span>
              ))}
            </div>
            <a className="btn" href={proj.link}>View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}