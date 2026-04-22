import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { IconCheckCircle, IconAlertCircle, IconBook } from './Icons.jsx';
import './MethodsTheory.css';

function KaTeX({ math, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, { displayMode: display, throwOnError: false });
    }
  }, [math, display]);
  return <span ref={ref} />;
}

const METHODS_DATA = [
  {
    id: 'lu',
    title: 'Factorización LU',
    badge: 'Directo',
    badgeType: 'cyan',
    description:
      'Descompone la matriz A en el producto de una matriz triangular inferior L y una triangular superior U (con pivoteo parcial PA = LU). Luego resuelve dos sistemas triangulares por sustitución.',
    formula: 'PA = LU \\quad\\Rightarrow\\quad Ly = Pb, \\quad Ux = y',
    pseudocode: [
      'Para k = 1, ..., n-1:',
      '  Buscar pivote máximo en columna k',
      '  Intercambiar filas si es necesario',
      '  Para i = k+1, ..., n:',
      '    L[i][k] = A[i][k] / A[k][k]',
      '    Para j = k+1, ..., n:',
      '      A[i][j] = A[i][j] - L[i][k] * A[k][j]',
      'Resolver Ly = Pb (sustitución adelante)',
      'Resolver Ux = y (sustitución atrás)',
    ],
    pros: ['Solución exacta (hasta precisión de máquina)', 'No requiere iteraciones', 'Siempre funciona si det(A) ≠ 0'],
    cons: ['Complejidad O(n³)', 'No aprovecha matrices sparse', 'Puede amplificar errores en matrices mal condicionadas'],
  },
  {
    id: 'jacobi',
    title: 'Método de Jacobi',
    badge: 'Iterativo',
    badgeType: 'blue',
    description:
      'En cada iteración, despeja cada variable usando SOLO los valores de la iteración anterior. Todos los componentes se actualizan simultáneamente.',
    formula: 'x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j \\neq i} a_{ij} x_j^{(k)} \\right)',
    pseudocode: [
      'x⁰ = [0, 0, ..., 0]',
      'Mientras ||x^(k+1) - x^(k)||∞ > tol:',
      '  Para i = 1, ..., n:',
      '    σ = Σ_{j≠i} a_ij · x_j^(k)',
      '    x_i^(k+1) = (b_i - σ) / a_ii',
      '  k ← k + 1',
    ],
    pros: ['Simple de implementar', 'Paralelizable (cada componente es independiente)', 'Converge si A es diagonalmente dominante'],
    cons: ['Convergencia lenta', 'Puede no converger si A no es diag. dominante', 'No usa información actualizada dentro de la iteración'],
  },
  {
    id: 'gaussSeidel',
    title: 'Gauss-Seidel',
    badge: 'Iterativo',
    badgeType: 'blue',
    description:
      'Similar a Jacobi, pero usa los valores YA ACTUALIZADOS dentro de la misma iteración. Generalmente converge más rápido que Jacobi.',
    formula: 'x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j<i} a_{ij} x_j^{(k+1)} - \\sum_{j>i} a_{ij} x_j^{(k)} \\right)',
    pseudocode: [
      'x⁰ = [0, 0, ..., 0]',
      'Mientras ||x^(k+1) - x^(k)||∞ > tol:',
      '  Para i = 1, ..., n:',
      '    σ₁ = Σ_{j<i} a_ij · x_j^(k+1)   ← ya actualizados',
      '    σ₂ = Σ_{j>i} a_ij · x_j^(k)     ← aún de iter. anterior',
      '    x_i^(k+1) = (b_i - σ₁ - σ₂) / a_ii',
    ],
    pros: ['Más rápido que Jacobi', 'Usa información fresca', 'Converge bajo las mismas condiciones que Jacobi'],
    cons: ['No paralelizable (orden importa)', 'Depende del ordenamiento de ecuaciones'],
  },
  {
    id: 'sor',
    title: 'Sobrerelajación Sucesiva (SOR)',
    badge: 'Iterativo',
    badgeType: 'blue',
    description:
      'Generalización de Gauss-Seidel con un parámetro de relajación ω. Para ω > 1, acelera la convergencia; para ω = 1, es exactamente Gauss-Seidel.',
    formula: 'x_i^{(k+1)} = (1-\\omega)\\,x_i^{(k)} + \\frac{\\omega}{a_{ii}} \\left( b_i - \\sum_{j<i} a_{ij} x_j^{(k+1)} - \\sum_{j>i} a_{ij} x_j^{(k)} \\right)',
    pseudocode: [
      'Elegir ω ∈ (0, 2)',
      'x⁰ = [0, 0, ..., 0]',
      'Mientras ||x^(k+1) - x^(k)||∞ > tol:',
      '  Para i = 1, ..., n:',
      '    x_GS = (b_i - Σ_{j≠i} a_ij·x_j) / a_ii',
      '    x_i^(k+1) = (1-ω)·x_i^(k) + ω·x_GS',
    ],
    pros: ['Puede converger mucho más rápido con ω óptimo', 'Flexible', 'Base de métodos más avanzados'],
    cons: ['Requiere elegir ω adecuado', 'ω mal elegido puede divergir', 'Difícil encontrar ω óptimo analíticamente'],
  },
  {
    id: 'cg',
    title: 'Gradiente Conjugado Precondicionado',
    badge: 'Avanzado',
    badgeType: 'warning',
    description:
      'Método basado en minimización de la forma cuadrática f(x) = ½xᵀAx + bᵀx. Genera direcciones A-conjugadas que convergen en ≤ n iteraciones (teóricamente). El precondicionador M mejora el número de condición.',
    formula: '\\alpha_k = \\frac{r_{k-1}^T z_{k-1}}{p_k^T A p_k}, \\quad \\beta_k = \\frac{r_{k-1}^T z_{k-1}}{r_{k-2}^T z_{k-2}}',
    pseudocode: [
      'r₀ = b - Ax₀',
      'Mientras r_k ≠ 0:',
      '  Resolver Mz_k = r_k',
      '  k ← k + 1',
      '  Si k = 1: p₁ = z₀',
      '  Sino: β_k = (r_{k-1}ᵀz_{k-1})/(r_{k-2}ᵀz_{k-2})',
      '         p_k = z_{k-1} + β_k·p_{k-1}',
      '  α_k = (r_{k-1}ᵀz_{k-1})/(p_kᵀAp_k)',
      '  x_k = x_{k-1} + α_k·p_k',
      '  r_k = r_{k-1} - α_k·Ap_k',
    ],
    pros: ['Converge en ≤ n iteraciones', 'Excelente para matrices grandes', 'El precondicionador mejora convergencia'],
    cons: ['Requiere A simétrica definida positiva (o usar ecuaciones normales)', 'Sensible a errores de redondeo', 'El precondicionador afecta mucho el rendimiento'],
  },
];

export default function MethodsTheory() {
  const [activeMethod, setActiveMethod] = useState('lu');
  const method = METHODS_DATA.find(m => m.id === activeMethod);

  return (
    <section id="theory" className="theory">
      <div className="container">
        <h2 className="section-title">Métodos Numéricos — Teoría</h2>
        <p className="section-subtitle">
          Fundamentos teóricos, fórmulas y pseudocódigo de cada método implementado en la calculadora.
        </p>

        {/* Method tabs */}
        <div className="theory__tabs">
          {METHODS_DATA.map(m => (
            <button
              key={m.id}
              className={`theory__tab ${activeMethod === m.id ? 'theory__tab--active' : ''}`}
              onClick={() => setActiveMethod(m.id)}
            >
              {m.title}
            </button>
          ))}
        </div>

        {/* Active method content */}
        {method && (
          <div className="theory__content glass-card" key={method.id}>
            <div className="theory__header">
              <h3 className="theory__title">{method.title}</h3>
              <span className={`badge badge-${method.badgeType}`}>{method.badge}</span>
            </div>

            <p className="theory__desc">{method.description}</p>

            {/* Formula */}
            <div className="theory__formula-box">
              <div className="theory__formula-label">Fórmula Principal</div>
              <KaTeX math={method.formula} display />
            </div>

            {/* Pseudocode */}
            <div className="theory__pseudo-box">
              <div className="theory__pseudo-label">Pseudocódigo</div>
              <pre className="theory__pseudo-code">
                {method.pseudocode.join('\n')}
              </pre>
            </div>

            {/* Pros & Cons */}
            <div className="theory__proscons">
              <div className="theory__pros">
                <h4>
                  <IconCheckCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--success)' }} />
                  Ventajas
                </h4>
                <ul>
                  {method.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="theory__cons">
                <h4>
                  <IconAlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--danger)' }} />
                  Limitaciones
                </h4>
                <ul>
                  {method.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* References */}
        <div className="theory__references glass-card">
          <h4>
            <IconBook size={18} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--cyan-300)' }} />
            Referencias
          </h4>
          <ul>
            <li>Suñagua, P. (2020). <em>Método de Gradientes Conjugados Precondicionado</em>. Revista Boliviana de Matemática – UMSA, 04, 2–7.</li>
            <li>Golub, G. H., & Van Loan, C. F. (2013). <em>Matrix Computations</em> (4th ed.). JHU Press.</li>
            <li>Burden, R. L., & Faires, J. D. <em>Numerical Analysis</em>. Cengage Learning.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
