import { useState, useMemo } from 'react';
import Plot from './PlotlyChart.jsx';
import { SCENARIOS, METHODS } from '../data/scenarios.js';
import { solveJacobi } from '../solvers/jacobi.js';
import { solveGaussSeidel } from '../solvers/gaussSeidel.js';
import { solveSOR } from '../solvers/sor.js';
import { solveLU } from '../solvers/luFactorization.js';
import { solveConjugateGradient } from '../solvers/conjugateGradient.js';
import { IconBook } from './Icons.jsx';
import './ConvergenceCharts.css';

const SOLVERS = {
  lu: (A, b) => solveLU(A, b),
  jacobi: (A, b) => solveJacobi(A, b, 1e-6, 1000),
  gaussSeidel: (A, b) => solveGaussSeidel(A, b, 1e-6, 1000),
  sor: (A, b) => solveSOR(A, b, 1.25, 1e-6, 1000),
  conjugateGradient: (A, b) => solveConjugateGradient(A, b, 1e-6, 1000),
};

const COLORS = {
  lu: '#FF6B6B',
  jacobi: '#4ECDC4',
  gaussSeidel: '#45B7D1',
  sor: '#96CEB4',
  conjugateGradient: '#DDA0DD',
};

export default function ConvergenceCharts() {
  const [activeScenario, setActiveScenario] = useState(0);
  const sc = SCENARIOS[activeScenario];

  const plotData = useMemo(() => {
    const traces = [];

    METHODS.forEach(method => {
      const res = SOLVERS[method.id](sc.A, sc.b);
      const history = res.residualHistory;

      if (history.length > 1) {
        traces.push({
          type: 'scatter',
          mode: 'lines+markers',
          x: history.map((_, i) => i),
          y: history,
          name: method.nombre,
          line: { color: COLORS[method.id], width: 2.5 },
          marker: { size: 4, color: COLORS[method.id] },
          hovertemplate:
            `<b>${method.nombre}</b><br>` +
            'Iteración: %{x}<br>Residuo: %{y:.2e}<extra></extra>',
        });
      } else {
        // LU — single point
        traces.push({
          type: 'scatter',
          mode: 'markers',
          x: [0],
          y: history,
          name: `${method.nombre} (directo)`,
          marker: { size: 12, color: COLORS[method.id], symbol: 'star' },
          hovertemplate:
            `<b>${method.nombre}</b><br>` +
            'Residuo: %{y:.2e}<extra></extra>',
        });
      }
    });

    // Tolerance line
    traces.push({
      type: 'scatter',
      mode: 'lines',
      x: [0, Math.max(...traces.filter(t => t.x).flatMap(t => t.x), 10)],
      y: [1e-6, 1e-6],
      name: 'Tolerancia (10⁻⁶)',
      line: { color: 'rgba(255,255,255,0.3)', width: 1, dash: 'dash' },
      hoverinfo: 'skip',
    });

    return traces;
  }, [activeScenario]);

  return (
    <section id="convergence" className="convergence">
      <div className="container">
        <h2 className="section-title">Gráficos de Convergencia</h2>
        <p className="section-subtitle">
          Evolución del residuo (||b - Ax||₂) en función del número de iteraciones para cada método.
        </p>

        <div className="convergence__tabs">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              className={`btn btn-sm ${activeScenario === i ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveScenario(i)}
            >
              {s.subtitulo}
            </button>
          ))}
        </div>

        <div className="convergence__chart glass-card">
          <Plot
            data={plotData}
            layout={{
              autosize: true,
              height: 480,
              margin: { l: 70, r: 30, t: 40, b: 60 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(13,40,71,0.3)',
              xaxis: {
                title: { text: 'Iteración', font: { color: '#90CAF9' } },
                color: '#90CAF9',
                gridcolor: 'rgba(66,165,245,0.1)',
                zerolinecolor: 'rgba(66,165,245,0.2)',
              },
              yaxis: {
                title: { text: 'Residuo (||b - Ax||₂)', font: { color: '#90CAF9' } },
                type: 'log',
                color: '#90CAF9',
                gridcolor: 'rgba(66,165,245,0.1)',
                zerolinecolor: 'rgba(66,165,245,0.2)',
              },
              font: { color: '#BBDEFB', family: 'Inter', size: 12 },
              legend: {
                bgcolor: 'rgba(10,22,40,0.7)',
                bordercolor: 'rgba(66,165,245,0.2)',
                borderwidth: 1,
                font: { size: 11 },
              },
              hovermode: 'x unified',
            }}
            config={{
              responsive: true,
              displayModeBar: false,
            }}
            style={{ width: '100%' }}
          />
        </div>

        <div className="convergence__info glass-card">
          <h4>
            <IconBook size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--cyan-300)' }} /> 
            ¿Cómo leer este gráfico?
          </h4>
          <ul>
            <li>El eje Y es <strong>logarítmico</strong>: cada división representa un orden de magnitud.</li>
            <li>Una caída rápida indica <strong>convergencia veloz</strong>.</li>
            <li>La línea punteada marca la <strong>tolerancia (10⁻⁶)</strong>: el método converge cuando el residuo cae por debajo.</li>
            <li>El <strong>Gradiente Conjugado</strong> tiende a converger en ≤ n iteraciones para sistemas n×n bien condicionados.</li>
            <li>En el caso <strong>mal condicionado</strong>, algunos métodos pueden no converger o requerir muchas más iteraciones.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
