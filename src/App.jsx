import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <Intro />
      <Projects />
      <Footer />
    </div>
  );
}

export default App;
