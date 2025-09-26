import WhiteLogo from '../assets/website-logo-pixel.png';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container">
        <img src={WhiteLogo} alt="Logo" className="logo-img" />
        <nav>
          <Link to="/" className="nav-link">HOME</Link>
          <a href="/#skills" className="nav-link">SKILLS</a>
          <a href="/#projects" className="nav-link">PROJECTS</a>
          <Link to="/browser-terminal" className="nav-link">BROWSER TERMINAL</Link>
        </nav>
      </div>
    </header>
  );
}