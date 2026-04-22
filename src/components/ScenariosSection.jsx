import { useEffect, useRef } from 'react';
import katex from 'katex';
import { SCENARIOS } from '../data/scenarios.js';
import { IconCheckCircle, IconAlertTriangle, IconAlertCircle } from './Icons.jsx';
import './ScenariosSection.css';

function KaTeX({ math, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { displayMode: display, throwOnError: false });
    }
  }, [math, display]);
  return <span ref={ref} />;
}

export default function ScenariosSection() {
  return (
    <section id="scenarios" className="scenarios">
      <div className="container">
        <h2 className="section-title">Escenarios Clínicos</h2>
        <p className="section-subtitle">
          Tres situaciones reales donde la condición numérica del sistema impacta directamente
          en la precisión del cálculo de dosificación.
        </p>

        <div className="scenarios__grid">
          {SCENARIOS.map((sc, idx) => (
            <div key={sc.id} className="scenarios__card glass-card" style={{ animationDelay: `${idx * 0.15}s` }}>
              {/* Header */}
              <div className="scenarios__card-header">
                <span className={`badge badge-${sc.badge}`}>{sc.badgeText}</span>
                <h3 className="scenarios__card-title">{sc.nombre}</h3>
                <p className="scenarios__card-subtitle">{sc.subtitulo}</p>
              </div>

              {/* Clinical context */}
              <div className="scenarios__card-body">
                <p className="scenarios__desc">{sc.descripcion}</p>

                {/* Serum composition table */}
                <div className="scenarios__table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Na⁺ (mEq/L)</th>
                        <th>K⁺ (mEq/L)</th>
                        <th>Glucosa (g/L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sc.sueros.map((s, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.nombre}</td>
                          <td>{s.sodio}</td>
                          <td>{s.potasio}</td>
                          <td>{s.glucosa}</td>
                        </tr>
                      ))}
                      <tr className="scenarios__req-row">
                        <td style={{ fontWeight: 700, color: 'var(--cyan-300)' }}>Requerimiento</td>
                        <td style={{ color: 'var(--cyan-300)', fontWeight: 600 }}>{sc.requerimiento.sodio}</td>
                        <td style={{ color: 'var(--cyan-300)', fontWeight: 600 }}>{sc.requerimiento.potasio}</td>
                        <td style={{ color: 'var(--cyan-300)', fontWeight: 600 }}>{sc.requerimiento.glucosa}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Equations */}
                <div className="scenarios__equations">
                  <div className="scenarios__equations-label">Sistema de Ecuaciones</div>
                  {sc.ecuaciones.map((eq, i) => (
                    <div key={i} className="scenarios__equation">
                      <KaTeX math={eq} display />
                    </div>
                  ))}
                </div>

                {/* Condition explanation */}
                <div className="scenarios__condition">
                  <div className="scenarios__condition-label">
                    {sc.id === 'ideal'
                      ? <IconCheckCircle size={16} color="var(--success)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      : sc.id === 'stress'
                        ? <IconAlertTriangle size={16} color="var(--warning)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        : <IconAlertCircle size={16} color="var(--danger)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    }
                    Condición Numérica
                  </div>
                  <p>{sc.explicacionCondicion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
