/**
 * gaussSeidel.js — Método iterativo de Gauss-Seidel
 *
 * Similar a Jacobi, pero utiliza los valores YA ACTUALIZADOS dentro de la
 * misma iteración. Esto generalmente produce convergencia más rápida.
 *
 *   x_i^{(k+1)} = (1/a_ii) * ( b_i - Σ_{j<i} a_ij * x_j^{(k+1)} - Σ_{j>i} a_ij * x_j^{(k)} )
 *
 * Criterio de parada: ||x^{(k+1)} - x^{(k)}||∞ < tolerancia
 */

import { normInf, residual, norm2 } from './utils.js';

export function solveGaussSeidel(A, b, tol = 1e-6, maxIter = 1000) {
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
          // Para j < i usa x[j] (ya actualizado); para j > i usa x[j] (aún de la iteración anterior)
          sum += A[i][j] * x[j];
        }
      }
      x[i] = (b[i] - sum) / A[i][i];
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
