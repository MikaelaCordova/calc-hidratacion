import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { NUTRIENTES, VARIABLES_INFO } from '../data/scenarios.js';
import { IconSodium, IconPotassium, IconGlucose, IconClipboard } from './Icons.jsx';
import './HeroSection.css';

const NUTRIENT_ICONS = [
  <IconSodium size={36} color="var(--cyan-300)" />,
  <IconPotassium size={36} color="var(--cyan-300)" />,
  <IconGlucose size={36} color="var(--cyan-300)" />,
];

function KaTeX({ math, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { displayMode: display, throwOnError: false });
    }
  }, [math, display]);
  return <span ref={ref} />;
}

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__container">
        {/* Decorative elements */}
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />

        <div className="hero__badge-row">
          <span className="badge badge-cyan">Métodos Numéricos</span>
        </div>

        <h1 className="hero__title">
          Calculadora de Hidratación
          <span className="hero__title-accent"> Intravenosa</span>
        </h1>

        <p className="hero__subtitle">
          Resolución interactiva de sistemas de ecuaciones lineales para la dosificación
          óptima de sueros IV en escenarios clínicos. Compara 5 métodos numéricos en
          tiempo real.
        </p>

        {/* Formula card — improved explanation */}
        <div className="hero__formula-card glass-card">
          <div className="hero__formula-label">Sistema de ecuaciones lineales</div>
          <KaTeX math="A\mathbf{x} = \mathbf{b}" display />

          <div className="hero__formula-breakdown">
            <div className="hero__formula-item">
              <div className="hero__formula-symbol">
                <KaTeX math="A" />
              </div>
              <div className="hero__formula-explain">
                <strong>Matriz de coeficientes (3×3)</strong>
                <span>Cada fila representa un nutriente (sodio, potasio, glucosa). Cada columna representa un suero (A, B, C). Los valores son las concentraciones de cada nutriente en cada suero.</span>
              </div>
            </div>

            <div className="hero__formula-item">
              <div className="hero__formula-symbol">
                <KaTeX math="\mathbf{x}" />
              </div>
              <div className="hero__formula-explain">
                <strong>Vector de incógnitas (3×1)</strong>
                <span>
                  <KaTeX math="x = [x_1,\; x_2,\; x_3]^T" /> — son los <em>litros de cada suero</em> que
                  se deben administrar al paciente. Esto es lo que queremos encontrar.
                </span>
              </div>
            </div>

            <div className="hero__formula-item">
              <div className="hero__formula-symbol">
                <KaTeX math="\mathbf{b}" />
              </div>
              <div className="hero__formula-explain">
                <strong>Vector de requerimientos (3×1)</strong>
                <span>Contiene las cantidades exactas de sodio, potasio y glucosa que el paciente necesita según su diagnóstico clínico.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrientes */}
        <div className="hero__section-label">
          <span className="hero__section-dot" />
          Nutrientes Clave en la Rehidratación
        </div>

        <div className="hero__nutrientes-grid">
          {NUTRIENTES.map((nut, i) => (
            <div key={i} className="hero__nutriente-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="hero__nutriente-icon">{NUTRIENT_ICONS[i]}</div>
              <h3 className="hero__nutriente-name">{nut.nombre}</h3>
              <p className="hero__nutriente-rol">{nut.rol}</p>
              <span className="badge badge-blue">{nut.unidad}</span>
            </div>
          ))}
        </div>

        {/* Variables */}
        <div className="hero__section-label">
          <span className="hero__section-dot" />
          Definición de Variables
        </div>

        <div className="hero__variables-card glass-card">
          <p className="hero__variables-intro">
            Las variables del sistema representan los <strong>volúmenes de solución intravenosa</strong> que
            se administran simultáneamente al paciente:
          </p>
          <div className="hero__variables-grid">
            {VARIABLES_INFO.map((v, i) => (
              <div key={i} className="hero__variable-item">
                <div className="hero__variable-symbol">
                  <KaTeX math={`x_${i + 1}`} />
                </div>
                <div>
                  <div className="hero__variable-name">{v.nombre}</div>
                  <div className="hero__variable-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hero__variables-note">
            <strong>Cada fila</strong> de la matriz <KaTeX math="A" /> corresponde a un nutriente (sodio, potasio, glucosa).{' '}
            <strong>Cada columna</strong> corresponde a un suero (A, B, C).
            El vector <KaTeX math="\mathbf{b}" /> contiene los requerimientos fisiológicos del paciente.
          </div>
        </div>

        {/* Contexto */}
        <div className="hero__context-card glass-card">
          <h3 className="hero__context-title">
            <IconClipboard size={18} color="var(--cyan-300)" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Contexto Clínico
          </h3>
          <p>
            La rehidratación intravenosa es uno de los procedimientos más frecuentes en medicina de
            urgencias y cuidados intensivos. Cuando un paciente no puede recuperar líquidos y electrolitos
            por vía oral, el personal médico recurre a soluciones intravenosas que reponen directamente
            los compuestos esenciales.
          </p>
          <p>
            El reto clínico consiste en determinar <strong>cuántos litros de cada suero</strong> se deben
            administrar simultáneamente para satisfacer exactamente los requerimientos del paciente,
            sin exceder ni quedar por debajo de los valores fisiológicos seguros.
          </p>
        </div>
      </div>
    </section>
  );
}
