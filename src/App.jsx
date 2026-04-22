import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ScenariosSection from './components/ScenariosSection.jsx';
import CalculatorSection from './components/CalculatorSection.jsx';
import ComparisonTable from './components/ComparisonTable.jsx';
import PlanesVisualization from './components/PlanesVisualization.jsx';
import ConvergenceCharts from './components/ConvergenceCharts.jsx';
import MethodsTheory from './components/MethodsTheory.jsx';
import { IconDroplet } from './components/Icons.jsx';
import './App.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="app-footer__inner">
          <div className="app-footer__brand">
            <span className="app-footer__logo">
              <IconDroplet size={18} color="var(--cyan-300)" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              HidraCalc
            </span>
            <p>Calculadora de Hidratación Intravenosa</p>
          </div>
          <div className="app-footer__info">
            <p>Métodos Numéricos</p>
            <p>Univ. Mikaela Belen Cordova Vasquez</p>
          </div>
          <div className="app-footer__methods">
            <p className="app-footer__label">Métodos implementados</p>
            <p>LU · Jacobi · Gauss-Seidel · SOR · Grad. Conjugado</p>
          </div>
        </div>
        <div className="app-footer__bottom">
          <p>Administración Intravenosa de Electrolitos en Deshidratación e Hipovolemia</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <ScenariosSection />
        <div className="section-divider" />
        <CalculatorSection />
        <div className="section-divider" />
        <ComparisonTable />
        <div className="section-divider" />
        <PlanesVisualization />
        <div className="section-divider" />
        <ConvergenceCharts />
        <div className="section-divider" />
        <MethodsTheory />
      </main>
      <Footer />
    </div>
  );
}
