import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import LottieAnimation from './components/LottieAnimation';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <Intro />
      <LottieAnimation />
      <Skills />
      <Projects />
      <Footer />
    </div>
  );
}

export default App;
