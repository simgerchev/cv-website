import project1 from '../assets/react.svg';
import project2 from '../assets/react.svg';

const projects = [
  {
    img: project1,
    title: "React App",
    desc: "A modern React application using hooks and components.",
    link: "#"
  },
  {
    img: project2,
    title: "SVG Demo",
    desc: "A project showcasing SVG graphics in React.",
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
            <h3>{proj.title}</h3>
            <p>{proj.desc}</p>
            <a className="btn" href={proj.link}>View Project</a>
          </div>
        ))}
      </div>
    </section>
  );
}