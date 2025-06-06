const skills = [
  { name: "JavaScript", level: 40 },
  { name: "React", level: 30 },
  { name: "PHP", level: 50 },
  { name: "Symfony", level: 30 },
  { name: "Laravel", level: 20 },
  { name: "Python", level: 50 },
  { name: "Django", level: 30 },
  { name: "C#", level: 40 },
  { name: "Unity", level: 30 },
  { name: "Redis", level: 30 },
  { name: "Git", level: 30 },
  { name: "Docker", level: 50 },
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
          Currently learning: <strong>React and Django</strong>
        </span>
      </div>
    </section>
  );
}