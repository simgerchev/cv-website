import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import BrowserTerminal from './components/BrowserTerminal';
import CyberMonk from './components/CyberMonk';
import Podvigh from './components/Podvigh';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Intro />
                <Footer />
              </>
            }
          />
          <Route path="/skills" element={
            <>
              <Skills />
              <Footer />
            </>
            } 
          />
          <Route path="/projects" element={
            <>
              <Projects />
              <Footer />
            </>
            } 
          />
          <Route path="/browser-terminal" element={<BrowserTerminal />} />
          <Route path="/cyber-monk" element={<CyberMonk />} />
          <Route path="/podvigh" element={<Podvigh />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;