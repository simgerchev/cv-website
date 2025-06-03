import babelLogo from '../assets/only-logo.png';

const projects = [
  {
    img: babelLogo,
    title: "Babel's Room",
    desc: "A chatt application where you can temporary chat sessions with an end to end encryption.",
    tech: ["React", "Django", "Docker"],
    link: "https://github.com/simgerchev/chat-app"
  },
];

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2 style={{ width: "100%", textAlign: "center" }}>My Projects / Github For More</h2>
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
            <a className="btn" href={proj.link} target="_blank" rel="noopener noreferrer">View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}