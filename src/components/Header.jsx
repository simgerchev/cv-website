import WhiteLogo from '../assets/website-logo.png';

export default function Header() {
  return (
    <header>
      <div className="container">
        <img src={WhiteLogo} alt="Logo" className="logo-img" />
        <nav>
          <a className="active" href="#intro">HOME</a>
          <a href="#skills">SKILLS</a>
          <a href="#projects">PROJECTS</a>
        </nav>
      </div>
    </header>
  );
}
