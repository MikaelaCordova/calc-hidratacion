import { useState, useMemo } from 'react';
import { SCENARIOS, METHODS } from '../data/scenarios.js';
import { solveJacobi } from '../solvers/jacobi.js';
import { solveGaussSeidel } from '../solvers/gaussSeidel.js';
import { solveSOR } from '../solvers/sor.js';
import { solveLU } from '../solvers/luFactorization.js';
import { solveConjugateGradient } from '../solvers/conjugateGradient.js';
import { conditionNumber } from '../solvers/utils.js';
import { IconZap, IconCheckCircle, IconAlertCircle } from './Icons.jsx';
import './ComparisonTable.css';

const SOLVERS = {
  lu: (A, b) => solveLU(A, b),
  jacobi: (A, b) => solveJacobi(A, b, 1e-6, 1000),
  gaussSeidel: (A, b) => solveGaussSeidel(A, b, 1e-6, 1000),
  sor: (A, b) => solveSOR(A, b, 1.25, 1e-6, 1000),
  conjugateGradient: (A, b) => solveConjugateGradient(A, b, 1e-6, 1000),
};

export default function ComparisonTable() {
  const [computed, setComputed] = useState(false);
  const [results, setResults] = useState(null);

  const compute = () => {
    const data = {};
    METHODS.forEach(method => {
      data[method.id] = {};
      SCENARIOS.forEach(sc => {
        data[method.id][sc.id] = SOLVERS[method.id](sc.A, sc.b);
      });
    });
    setResults(data);
    setComputed(true);
  };

  const condNumbers = useMemo(() => {
    return SCENARIOS.map(sc => conditionNumber(sc.A));
  }, []);

  return (
    <section id="comparison" className="comparison">
      <div className="container">
        <h2 className="section-title">Tabla Comparativa de Métodos</h2>
        <p className="section-subtitle">
          Ejecución simultánea de los 5 métodos en los 3 escenarios clínicos con tolerancia 10⁻⁶.
        </p>

        {/* Condition numbers */}
        <div className="comparison__kappas">
          {SCENARIOS.map((sc, i) => (
            <div key={sc.id} className="comparison__kappa glass-card">
              <div className="comparison__kappa-label">{sc.subtitulo}</div>
              <div className="comparison__kappa-value">
                κ(A) = {condNumbers[i] === Infinity ? '∞' : condNumbers[i].toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {!computed ? (
          <div className="comparison__cta">
            <button className="btn btn-primary" onClick={compute}>
              <IconZap size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Ejecutar Todos los Métodos
            </button>
            <p className="comparison__cta-hint">
              Esto calculará 15 resoluciones (5 métodos × 3 escenarios)
            </p>
          </div>
        ) : (
          <div className="comparison__table-wrapper">
            <table className="data-table comparison__table">
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Tipo</th>
                  <th>Iter. (Ideal)</th>
                  <th>Iter. (Estrés)</th>
                  <th>Iter. (Mal Cond.)</th>
                  <th>Conv. (Ideal)</th>
                  <th>Conv. (Estrés)</th>
                  <th>Conv. (Mal C.)</th>
                </tr>
              </thead>
              <tbody>
                {METHODS.map(method => (
                  <tr key={method.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {method.nombre}
                    </td>
                    <td>
                      <span className={`badge ${method.tipo === 'directo' ? 'badge-cyan' : 'badge-blue'}`}>
                        {method.tipo}
                      </span>
                    </td>
                    {SCENARIOS.map(sc => (
                      <td key={sc.id}>
                        {results[method.id][sc.id].iterations}
                      </td>
                    ))}
                    {SCENARIOS.map(sc => (
                      <td key={sc.id + '-conv'}>
                        <span className={results[method.id][sc.id].converged ? 'comparison__conv-yes' : 'comparison__conv-no'} style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                          {results[method.id][sc.id].converged 
                            ? <><IconCheckCircle size={14} /> Sí</> 
                            : <><IconAlertCircle size={14} /> No</>}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Solutions detail */}
        {computed && (
          <div className="comparison__solutions">
            <h3 className="comparison__solutions-title">Soluciones Obtenidas (Factorización LU)</h3>
            <div className="comparison__solutions-grid">
              {SCENARIOS.map(sc => {
                const res = results.lu[sc.id];
                return (
                  <div key={sc.id} className="comparison__solution-card glass-card">
                    <div className="comparison__solution-label">{sc.subtitulo}</div>
                    {res.solution.map((v, i) => (
                      <div key={i} className="comparison__solution-var">
                        <span>x{i + 1}</span>
                        <span className="comparison__solution-val">
                          {isNaN(v) ? 'N/A' : v.toFixed(6)} L
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
