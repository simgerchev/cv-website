const skills = [
  { name: "JavaScript", level: 90 },
  { name: "React", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "Python", level: 75 },
  { name: "DevOps", level: 70 },
  { name: "Cybersecurity", level: 60 },
];

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <h2 className="skills-title">Skills</h2>
      <div className="skills-list">
        {skills.map(skill => (
          <div className="skill" key={skill.name}>
            <div className="skill-label">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="skill-bar-bg">
              <div
                className="skill-bar"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="currently-learning">
        <span role="img" aria-label="rocket">📖</span>
        <span className="currently-learning-text">
          Currently learning: <strong>TypeScript & Cloud Infrastructure</strong>
        </span>
      </div>
    </section>
  );
}