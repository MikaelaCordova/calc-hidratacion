import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { SCENARIOS, METHODS } from '../data/scenarios.js';
import { solveJacobi } from '../solvers/jacobi.js';
import { solveGaussSeidel } from '../solvers/gaussSeidel.js';
import { solveSOR } from '../solvers/sor.js';
import { solveLU } from '../solvers/luFactorization.js';
import { solveConjugateGradient } from '../solvers/conjugateGradient.js';
import { conditionNumber } from '../solvers/utils.js';
import { IconCalculator, IconCheckCircle, IconAlertCircle, IconSyringe, IconAlertTriangle } from './Icons.jsx';
import './CalculatorSection.css';

function KaTeX({ math, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { displayMode: display, throwOnError: false });
    }
  }, [math, display]);
  return <span ref={ref} />;
}

const SOLVERS = {
  lu: (A, b, _tol, _maxIter, _omega) => solveLU(A, b),
  jacobi: (A, b, tol, maxIter) => solveJacobi(A, b, tol, maxIter),
  gaussSeidel: (A, b, tol, maxIter) => solveGaussSeidel(A, b, tol, maxIter),
  sor: (A, b, tol, maxIter, omega) => solveSOR(A, b, omega, tol, maxIter),
  conjugateGradient: (A, b, tol, maxIter) => solveConjugateGradient(A, b, tol, maxIter),
};

export default function CalculatorSection() {
  const [matrix, setMatrix] = useState(SCENARIOS[0].A.map(r => [...r]));
  const [vector, setVector] = useState([...SCENARIOS[0].b]);
  const [method, setMethod] = useState('lu');
  const [tol, setTol] = useState(1e-6);
  const [maxIter, setMaxIter] = useState(1000);
  const [omega, setOmega] = useState(1.25);
  const [result, setResult] = useState(null);
  const [activePreset, setActivePreset] = useState('ideal');

  const loadPreset = (id) => {
    const sc = SCENARIOS.find(s => s.id === id);
    if (sc) {
      setMatrix(sc.A.map(r => [...r]));
      setVector([...sc.b]);
      setActivePreset(id);
      setResult(null);
    }
  };

  const handleMatrixChange = (i, j, val) => {
    const newMatrix = matrix.map(r => [...r]);
    newMatrix[i][j] = parseFloat(val) || 0;
    setMatrix(newMatrix);
    setActivePreset(null);
  };

  const handleVectorChange = (i, val) => {
    const newVec = [...vector];
    newVec[i] = parseFloat(val) || 0;
    setVector(newVec);
    setActivePreset(null);
  };

  const solve = () => {
    const solver = SOLVERS[method];
    if (solver) {
      const res = solver(matrix, vector, tol, maxIter, omega);
      setResult(res);
    }
  };

  const kappa = conditionNumber(matrix);
  const nutrientLabels = ['Sodio (Na⁺)', 'Potasio (K⁺)', 'Glucosa'];
  const suerumLabels = ['Suero A', 'Suero B', 'Suero C'];

  return (
    <section id="calculator" className="calculator">
      <div className="container">
        <h2 className="section-title">Calculadora Interactiva</h2>
        <p className="section-subtitle">
          Modifica los coeficientes del sistema y observa cómo cada método numérico resuelve el problema.
        </p>

        {/* Presets */}
        <div className="calc__presets">
          <span className="calc__presets-label">Cargar escenario:</span>
          {SCENARIOS.map(sc => (
            <button
              key={sc.id}
              className={`btn btn-sm ${activePreset === sc.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => loadPreset(sc.id)}
            >
              {sc.subtitulo}
            </button>
          ))}
        </div>

        <div className="calc__layout">
          {/* Left: Matrix input */}
          <div className="calc__input-panel glass-card">
            <h3 className="calc__panel-title">
              Matriz <KaTeX math="A" /> y Vector <KaTeX math="\mathbf{b}" />
            </h3>

            <div className="calc__matrix-header">
              <div className="calc__matrix-corner"></div>
              {suerumLabels.map((s, j) => (
                <div key={j} className="calc__matrix-col-label">{s}</div>
              ))}
              <div className="calc__matrix-col-label" style={{ color: 'var(--cyan-300)' }}>
                <KaTeX math="b" />
              </div>
            </div>

            {matrix.map((row, i) => (
              <div key={i} className="calc__matrix-row">
                <div className="calc__matrix-row-label">{nutrientLabels[i]}</div>
                {row.map((val, j) => (
                  <input
                    key={j}
                    type="number"
                    step="any"
                    className="input-field calc__matrix-input"
                    value={val}
                    onChange={e => handleMatrixChange(i, j, e.target.value)}
                  />
                ))}
                <input
                  type="number"
                  step="any"
                  className="input-field calc__matrix-input calc__matrix-input--b"
                  value={vector[i]}
                  onChange={e => handleVectorChange(i, e.target.value)}
                />
              </div>
            ))}

            <div className="calc__condition">
              <span className="calc__condition-label">Número de condición:</span>
              <span className={`calc__condition-value ${kappa > 1000 ? 'calc__condition-value--bad' : kappa > 100 ? 'calc__condition-value--warn' : 'calc__condition-value--good'}`}>
                κ(A) = {kappa === Infinity ? '∞' : kappa.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right: Method selection & params */}
          <div className="calc__config-panel glass-card">
            <h3 className="calc__panel-title">Configuración</h3>

            <div className="calc__field">
              <label htmlFor="method-select">Método Numérico</label>
              <select
                id="method-select"
                className="input-field"
                value={method}
                onChange={e => setMethod(e.target.value)}
              >
                {METHODS.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre} ({m.tipo})</option>
                ))}
              </select>
            </div>

            <div className="calc__field-row">
              <div className="calc__field">
                <label htmlFor="tol-input">Tolerancia</label>
                <input
                  id="tol-input"
                  type="number"
                  step="any"
                  className="input-field"
                  value={tol}
                  onChange={e => setTol(parseFloat(e.target.value) || 1e-6)}
                />
              </div>
              <div className="calc__field">
                <label htmlFor="maxiter-input">Máx. Iteraciones</label>
                <input
                  id="maxiter-input"
                  type="number"
                  className="input-field"
                  value={maxIter}
                  onChange={e => setMaxIter(parseInt(e.target.value) || 1000)}
                />
              </div>
            </div>

            {method === 'sor' && (
              <div className="calc__field">
                <label htmlFor="omega-input">Parámetro ω (SOR)</label>
                <input
                  id="omega-input"
                  type="number"
                  step="0.05"
                  min="0"
                  max="2"
                  className="input-field"
                  value={omega}
                  onChange={e => setOmega(parseFloat(e.target.value) || 1.25)}
                />
                <p className="calc__field-hint">
                  ω = 1 → Gauss-Seidel | ω &gt; 1 → sobre-relajación | ω &lt; 1 → sub-relajación
                </p>
              </div>
            )}

            <button className="btn btn-primary calc__solve-btn" onClick={solve}>
              <IconCalculator size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Resolver Sistema
            </button>

            {/* Results */}
            {result && (
              <div className={`calc__result ${result.converged ? 'calc__result--ok' : 'calc__result--fail'}`}>
                <div className="calc__result-header">
                  <span className={`badge ${result.converged ? 'badge-success' : 'badge-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {result.converged 
                      ? <><IconCheckCircle size={14} /> Convergió</>
                      : <><IconAlertCircle size={14} /> No convergió</>
                    }
                  </span>
                  <span className="calc__result-time">{result.executionTime.toFixed(2)} ms</span>
                </div>

                <div className="calc__result-solution">
                  <div className="calc__result-title">Solución</div>
                  <div className="calc__result-vars">
                    {result.solution.map((val, i) => (
                      <div key={i} className="calc__result-var">
                        <KaTeX math={`x_${i + 1}`} />
                        <span className="calc__result-val">
                          = {isNaN(val) ? 'N/A' : val.toFixed(6)}
                        </span>
                        <span className="calc__result-unit">litros</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="calc__result-meta">
                  <div>
                    <strong>Iteraciones:</strong> {result.iterations}
                  </div>
                  <div>
                    <strong>Residuo final:</strong>{' '}
                    {result.residualHistory[result.residualHistory.length - 1]?.toExponential(3) || 'N/A'}
                  </div>
                </div>

                {/* Clinical interpretation */}
                {result.converged && !result.solution.some(isNaN) && (
                  <div className="calc__result-clinical">
                    <div className="calc__result-title">
                      <IconSyringe size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--cyan-300)' }} /> 
                      Interpretación Clínica
                    </div>
                    <p>
                      Se deben administrar al paciente:{' '}
                      <strong>{result.solution[0].toFixed(3)} L</strong> del Suero A,{' '}
                      <strong>{result.solution[1].toFixed(3)} L</strong> del Suero B, y{' '}
                      <strong>{result.solution[2].toFixed(3)} L</strong> del Suero C
                      para alcanzar exactamente los requerimientos de sodio, potasio y glucosa prescritos.
                    </p>
                    {result.solution.some(v => v < 0) && (
                      <p className="calc__result-warning">
                        <IconAlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> <strong>Atención:</strong> Alguno de los volúmenes es negativo, lo cual no tiene
                        sentido clínico. Esto puede indicar que los requerimientos no son alcanzables
                        con la combinación de sueros disponible.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
