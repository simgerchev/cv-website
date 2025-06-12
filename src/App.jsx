import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import RandomPainting from './components/RandomPainting';

function App() {

  return (
    <div className="app">
      <Header />
      <Intro />
      <Skills />
      <Projects />
      <Footer />
    </div>
  );
}

export default App;
