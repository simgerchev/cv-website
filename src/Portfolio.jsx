import React from "react";
import "./Portfolio.css";
import image1 from "./assets/image1.png";

const images = [
  {
    src: image1,
    alt: "Stingray Illustration"
  }
];

const Portfolio = () => {
  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <div className="logo-section">
          <div className="logo-gradient" />
          <span className="logo-text">Anke Friedmann</span>
        </div>
        <nav className="portfolio-nav">
          <a href="#projects" className="active-link">Projekte</a>
          <a href="#about">Über mich</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </nav>
      </header>

      <main className="portfolio-main">
        <h1 className="portfolio-title">Illustrationen & Motion-Design</h1>
        <div className="image-grid">
          {images.map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.src} alt={image.alt} className="portfolio-image" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;