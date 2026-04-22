import { useState, useEffect } from 'react';
import {
  IconHome, IconFlask, IconCalculator, IconBarChart,
  IconCube, IconTrendingUp, IconBook, IconDroplet,
} from './Icons.jsx';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'Problema y Explicacion', Icon: IconHome },
  { id: 'scenarios', label: 'Escenarios', Icon: IconFlask },
  { id: 'calculator', label: 'Calculadora', Icon: IconCalculator },
  { id: 'comparison', label: 'Comparativa', Icon: IconBarChart },
  { id: 'planes', label: 'Planos 3D', Icon: IconCube },
  { id: 'convergence', label: 'Convergencia', Icon: IconTrendingUp },
  { id: 'theory', label: 'Teoría', Icon: IconBook },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => scrollTo('hero')}>
          <span className="navbar__logo-icon">
            <IconDroplet size={22} color="var(--cyan-300)" />
          </span>
          <span className="navbar__logo-text">HidraCalc</span>
        </button>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <button
                className={`navbar__link ${activeSection === item.id ? 'navbar__link--active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                <span className="navbar__link-icon">
                  <item.Icon size={16} />
                </span>
                <span className="navbar__link-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
