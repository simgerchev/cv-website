import projectFirst from '../assets/project-pictures/project-first.png';
import projectSecond from '../assets/project-pictures/project-second.jpg';
import projectThird from '../assets/project-pictures/project-third.png';
import projectFourth from '../assets/project-pictures/project-fourth.png';
import projectFifth from '../assets/project-pictures/project-fifth.png';
import projectSixth from '../assets/project-pictures/project-sixth.png';
import { Link } from 'react-router-dom';

const projects = [
  {
    img: projectFirst,
    title: "Babel's Room(🔨WIP🔨)",
    desc: "A chat application where you can temporary chat sessions with an end to end encryption.",
    tech: ["React Vite", "Django", "Docker", "Git"],
    link: "https://github.com/simgerchev/chat-app",
    showButton: true
  },
  {
    img: projectSecond,
    title: "Deserted",
    desc: "Explore an unknown desert world with your 6-legged lizzard cat while mastering obstacles, traps and many other dangers. Find new abilities, fight enemies and uncover hidden treasures in this Metroidvanice-inspired.",
    tech: ["C#", "Unity","Git"],
    link: "https://codelikeasir.itch.io/deserted",
    showButton: true
  },
  {
    img: projectThird,
    title: "Yggdrasil",
    desc: "Go on an adventure to save the sacred tree Yggdrasil! The frost giants have frozen Hvergelmir, the spring to all rivers. But Yggdrasil needs water to survive and thrive. You must restore Hvergelmir and the flow of water in the world.",
    tech: ["C#", "Unity","Git"],
    link: "https://luameyer.itch.io/yggdrasil",
    showButton: true
  },
  {
    img: projectFourth,
    title: "Browser Terminal",
    desc: "A web-based terminal emulator that runs in the browser, allowing users to interact with a simulated command line interface. Similar to the Overthewire Wargames.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/browser-terminal",
    showButton: true
  },
  {
    img: projectFifth,
    title: "CyberMonk(🔨WIP🔨)",
    desc: "CyberMonk is a web-based terminal emulator game about a monk exploring a fantasy world through command-line commands. Similar to Terminus.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/cyber-monk",
    showButton: true
  },
    {
    img: projectSixth,
    title: "Podvigh(🔨WIP🔨)",
    desc: "Podvigh is a web-based ASCII game about a monk exploring a fantasy world through command-line commands.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/podvigh",
    showButton: true
  }
];

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2 style={{ width: "100%", textAlign: "center" }}>My Projects / More on Github</h2>
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
            {proj.showButton !== false && (
              proj.link.startsWith('/') ? (
                <Link className="btn" to={proj.link}>View Project</Link>
              ) : (
                <a className="btn" href={proj.link} target="_blank" rel="noopener noreferrer">View Project</a>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}