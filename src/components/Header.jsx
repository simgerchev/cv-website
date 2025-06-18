import WhiteLogo from '../assets/website-logo.png';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container">
        <img src={WhiteLogo} alt="Logo" className="logo-img" />
        <nav>
          <Link to="/cv-website" className="nav-link">HOME</Link>
          <a href="/cv-website#skills" className="nav-link">SKILLS</a>
          <a href="/cv-website#projects" className="nav-link">PROJECTS</a>
          <Link to="/terminal" className="nav-link">TERMINAL</Link>
        </nav>
      </div>
    </header>
  );
}