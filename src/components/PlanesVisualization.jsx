import { useState, useMemo } from 'react';
import Plot from './PlotlyChart.jsx';
import { SCENARIOS } from '../data/scenarios.js';
import { solveLU } from '../solvers/luFactorization.js';
import './PlanesVisualization.css';

export default function PlanesVisualization() {
  const [activeScenario, setActiveScenario] = useState(0);
  const sc = SCENARIOS[activeScenario];

  const plotData = useMemo(() => {
    const A = sc.A;
    const b = sc.b;
    const sol = solveLU(A, b);
    const pt = sol.solution;

    // Generate plane surfaces: for each equation a1*x + a2*y + a3*z = b
    // Solve for z: z = (b - a1*x - a2*y) / a3
    // Or if a3 ≈ 0, solve for y: y = (b - a1*x - a3*z) / a2

    const colors = [
      'rgba(33, 150, 243, 0.35)',   // Blue
      'rgba(0, 188, 212, 0.35)',    // Cyan
      'rgba(16, 185, 129, 0.35)',   // Green
    ];

    const colorscales = [
      [[0, 'rgba(33,150,243,0.2)'], [1, 'rgba(33,150,243,0.5)']],
      [[0, 'rgba(0,188,212,0.2)'],  [1, 'rgba(0,188,212,0.5)']],
      [[0, 'rgba(16,185,129,0.2)'], [1, 'rgba(16,185,129,0.5)']],
    ];

    const planeNames = ['Balance de Sodio', 'Balance de Potasio', 'Balance de Glucosa'];

    // Determine range based on solution
    const cx = isNaN(pt[0]) ? 1 : pt[0];
    const cy = isNaN(pt[1]) ? 1 : pt[1];
    const range = 3;
    const xMin = cx - range, xMax = cx + range;
    const yMin = cy - range, yMax = cy + range;

    const N = 20;
    const traces = [];

    for (let eq = 0; eq < 3; eq++) {
      const a1 = A[eq][0], a2 = A[eq][1], a3 = A[eq][2], bi = b[eq];

      const xVals = [];
      const yVals = [];
      const zVals = [];

      for (let i = 0; i <= N; i++) {
        const x = xMin + (xMax - xMin) * i / N;
        const zRow = [];
        const yRow = [];
        for (let j = 0; j <= N; j++) {
          const y = yMin + (yMax - yMin) * j / N;
          if (Math.abs(a3) > 1e-10) {
            const z = (bi - a1 * x - a2 * y) / a3;
            zRow.push(z);
            yRow.push(y);
          } else if (Math.abs(a2) > 1e-10) {
            const yCalc = (bi - a1 * x - a3 * j) / a2;
            zRow.push(j);
            yRow.push(yCalc);
          } else {
            zRow.push(0);
            yRow.push(y);
          }
        }
        xVals.push(new Array(N + 1).fill(x));
        yVals.push(yRow);
        zVals.push(zRow);
      }

      traces.push({
        type: 'surface',
        x: xVals,
        y: yVals,
        z: zVals,
        colorscale: colorscales[eq],
        showscale: false,
        opacity: 0.6,
        name: planeNames[eq],
        hovertemplate:
          `<b>${planeNames[eq]}</b><br>` +
          'x₁: %{x:.3f}<br>x₂: %{y:.3f}<br>x₃: %{z:.3f}<extra></extra>',
      });
    }

    // Add intersection point
    if (!pt.some(isNaN)) {
      traces.push({
        type: 'scatter3d',
        x: [pt[0]],
        y: [pt[1]],
        z: [pt[2]],
        mode: 'markers+text',
        marker: {
          size: 8,
          color: '#FF6B6B',
          symbol: 'diamond',
          line: { color: 'white', width: 2 },
        },
        text: [`(${pt[0].toFixed(2)}, ${pt[1].toFixed(2)}, ${pt[2].toFixed(2)})`],
        textposition: 'top center',
        textfont: { color: 'white', size: 11 },
        name: 'Solución',
        hovertemplate:
          '<b>Punto de Intersección</b><br>' +
          `x₁ = ${pt[0].toFixed(4)} L<br>` +
          `x₂ = ${pt[1].toFixed(4)} L<br>` +
          `x₃ = ${pt[2].toFixed(4)} L<extra></extra>`,
      });
    }

    return traces;
  }, [activeScenario]);

  return (
    <section id="planes" className="planes-viz">
      <div className="container">
        <h2 className="section-title">Visualización 3D de Planos</h2>
        <p className="section-subtitle">
          Cada ecuación del sistema define un plano en ℝ³. La solución del sistema es el punto
          donde los tres planos se intersecan.
        </p>

        <div className="planes-viz__tabs">
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

        <div className="planes-viz__chart glass-card">
          <Plot
            data={plotData}
            layout={{
              autosize: true,
              height: 550,
              margin: { l: 0, r: 0, t: 30, b: 0 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              scene: {
                xaxis: { title: 'x₁ (Suero A)', color: '#90CAF9', gridcolor: 'rgba(66,165,245,0.15)' },
                yaxis: { title: 'x₂ (Suero B)', color: '#90CAF9', gridcolor: 'rgba(66,165,245,0.15)' },
                zaxis: { title: 'x₃ (Suero C)', color: '#90CAF9', gridcolor: 'rgba(66,165,245,0.15)' },
                bgcolor: 'transparent',
              },
              font: { color: '#BBDEFB', family: 'Inter' },
              legend: {
                x: 0.01, y: 0.99,
                bgcolor: 'rgba(10,22,40,0.7)',
                bordercolor: 'rgba(66,165,245,0.2)',
                borderwidth: 1,
                font: { size: 11, color: '#BBDEFB' },
              },
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['toImage'],
            }}
            style={{ width: '100%' }}
          />
        </div>

        <div className="planes-viz__legend">
          <div className="planes-viz__legend-item">
            <span className="planes-viz__dot" style={{ background: '#2196F3' }} />
            Balance de Sodio
          </div>
          <div className="planes-viz__legend-item">
            <span className="planes-viz__dot" style={{ background: '#00BCD4' }} />
            Balance de Potasio
          </div>
          <div className="planes-viz__legend-item">
            <span className="planes-viz__dot" style={{ background: '#10B981' }} />
            Balance de Glucosa
          </div>
          <div className="planes-viz__legend-item">
            <span className="planes-viz__dot" style={{ background: '#FF6B6B' }} />
            Punto de Intersección (Solución)
          </div>
        </div>
      </div>
    </section>
  );
}
