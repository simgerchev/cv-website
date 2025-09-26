import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import BrowserTerminal from './components/BrowserTerminal';

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
                <Skills />
                <Projects />
                <Footer />
              </>
            }
          />
          <Route path="/browser-terminal" element={<BrowserTerminal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;