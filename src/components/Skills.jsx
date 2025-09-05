import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';

const languageData = [
  { subject: "JavaScript", A: 50 },
  { subject: "Python", A: 50 },
  { subject: "C#", A: 35 },
  { subject: "PHP", A: 60 },
  { subject: "Go", A: 35 },
];

const frameworkData = [
  { subject: "React", A: 40 },
  { subject: "Django", A: 30 },
  { subject: "Laravel", A: 40 },
  { subject: "Symfony", A: 50 },
  { subject: "Unity", A: 35 },
];

const devopsData = [
  { subject: "Docker", A: 45 },
  { subject: "Git(Github,Gitlab)", A: 50 },
  { subject: "Linux", A: 45 },
  { subject: "Redis", A: 35 },
  { subject: "RabbitMQ", A: 35 },
  { subject: "Jenkins", A: 35 },
];

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <h2>Skills Overview</h2>
      <div className="charts-container">
        <div className="chart-block">
          <h3>Languages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={languageData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Languages" dataKey="A" stroke="#2563c9" fill="#2563c9" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <h3>Frameworks</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={frameworkData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Frameworks" dataKey="A" stroke="#c92563" fill="#c92563" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <h3>DevOps & Tools</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={devopsData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="DevOps & Tools" dataKey="A" stroke="#25c963" fill="#25c963" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
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
