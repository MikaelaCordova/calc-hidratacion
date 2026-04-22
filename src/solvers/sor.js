/**
 * sor.js — Método de Sobrerelajación Sucesiva (SOR)
 *
 * Generalización de Gauss-Seidel con un parámetro de relajación ω:
 *
 *   x_i^{(k+1)} = (1-ω)·x_i^{(k)} + (ω/a_ii)·( b_i - Σ_{j<i} a_ij·x_j^{(k+1)} - Σ_{j>i} a_ij·x_j^{(k)} )
 *
 * - ω = 1  → es Gauss-Seidel
 * - ω < 1  → sub-relajación (más estable pero más lento)
 * - ω > 1  → sobre-relajación (más rápido si ω está bien elegido)
 * - Rango óptimo: 1 < ω < 2
 *
 * Criterio de parada: ||x^{(k+1)} - x^{(k)}||∞ < tolerancia
 */

import { normInf, residual, norm2 } from './utils.js';

export function solveSOR(A, b, omega = 1.25, tol = 1e-6, maxIter = 1000) {
  const t0 = performance.now();
  const n = A.length;
  let x = new Array(n).fill(0);
  const residualHistory = [];
  let converged = false;
  let iter = 0;

  residualHistory.push(norm2(residual(A, x, b)));

  for (iter = 1; iter <= maxIter; iter++) {
    const xOld = [...x];

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      // Gauss-Seidel step
      const xGS = (b[i] - sum) / A[i][i];
      // SOR relaxation
      x[i] = (1 - omega) * xOld[i] + omega * xGS;
    }

    const r = residual(A, x, b);
    residualHistory.push(norm2(r));

    const diff = x.map((v, i) => v - xOld[i]);
    if (normInf(diff) < tol) {
      converged = true;
      break;
    }
  }

  return {
    solution: [...x],
    iterations: iter > maxIter ? maxIter : iter,
    converged,
    residualHistory,
    executionTime: performance.now() - t0,
  };
}
