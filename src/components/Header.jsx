import WhiteLogo from '../assets/WhiteLogo.png';

export default function Header() {
  return (
    <header>
      <div className="container">
        <img src={WhiteLogo} alt="Logo" className="logo-img" />
        <nav>
          <a className="active" href="#">HOME</a>
          <a href="#">ABOUT US</a>
          <a href="#">PROJECTS</a>
          <a href="#">BLOG ENTRIES</a>
          <a href="#">CONTACT</a>
        </nav>
      </div>
    </header>
  );
}
