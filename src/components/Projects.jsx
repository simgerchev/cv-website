export default function Projects() {
  return (
    <section className="projects">
      <div className="container">
        <div className="project-text">
            <h2>LATEST PROJECTS</h2>
            <p>
            Sed eu turpis vehicula, iaculis sapien eu, molestie libero. Cras ac urna in magna commodo sodales vel et dolor.
            </p>
            <p>
            Nunc eget velit nec felis ultrices vulputate venenatis interdum arcu. In ac auctor quam.
            </p>
            <a href="#" className="btn">CONTINUE JOURNAL</a>
        </div>
        <div className="project-grid">
            <img src="https://source.unsplash.com/300x200/?mountain" alt="Project 1" />
            <div className="project-box">PROJECT | TWO</div>
            <img src="https://source.unsplash.com/300x200/?beach" alt="Project 3" />
            <img src="https://source.unsplash.com/300x200/?workspace" alt="Project 4" />
        </div>
      </div>
    </section>
  );
}
