import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';

const languageData = [
  { subject: "JavaScript", A: 50 },
  { subject: "Python", A: 50 },
  { subject: "C#", A: 35 },
  { subject: "PHP", A: 60 },
];

const techData = [
  { subject: "React", A: 40 },
  { subject: "Django", A: 30 },
  { subject: "Docker", A: 40 },
  { subject: "Git", A: 50 },
  { subject: "Laravel", A: 40 },
  { subject: "Symfony", A: 50 },
  { subject: "Redis", A: 35 },
  { subject: "RabbitMQ", A: 35 },
];

export default function Skills() {
  return (
    <section className="skills-section">
      <h2>Skills Overview</h2>
      <div className="charts-container">
        <div className="chart-block">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={languageData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Languages" dataKey="A" stroke="#2563c9" fill="#2563c9" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-block">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={techData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Tech Stack" dataKey="A" stroke="#2563c9" fill="#2563c9" fillOpacity={0.6} />
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
