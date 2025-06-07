import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Skills from './components/Skills';
import Projects from './components/Projects';
import BibleVerse from './components/BibleVerse';
import Footer from './components/Footer';

function App() {
  const [showBibleVerse, setShowBibleVerse] = useState(false);
  const tapCount = useRef(0);
  const tapTimeout = useRef(null);

  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      tapCount.current = 0;
    }, 700);

    if (tapCount.current === 3) {
      setShowBibleVerse((v) => !v);
      tapCount.current = 0;
    }
  };

  return (
    <div className="app">
      <div onClick={handleSecretTap}>
        <Header />
      </div>
      <Intro />
      <Skills />
      <Projects />
      {showBibleVerse && <BibleVerse />}
      <Footer />
    </div>
  );
}

export default App;
