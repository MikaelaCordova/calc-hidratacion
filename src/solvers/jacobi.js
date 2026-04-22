/**
 * jacobi.js — Método iterativo de Jacobi
 *
 * Para el sistema Ax = b, la iteración de Jacobi es:
 *
 *   x_i^{(k+1)} = (1/a_ii) * ( b_i - Σ_{j≠i} a_ij * x_j^{(k)} )
 *
 * En cada iteración se usan SOLO los valores de la iteración anterior.
 * Converge si la matriz es diagonalmente dominante.
 *
 * Criterio de parada: ||x^{(k+1)} - x^{(k)}||∞ < tolerancia
 */

import { normInf, residual, norm2 } from './utils.js';

export function solveJacobi(A, b, tol = 1e-6, maxIter = 1000) {
  const t0 = performance.now();
  const n = A.length;
  let x = new Array(n).fill(0); // x⁰ = 0
  const residualHistory = [];
  let converged = false;
  let iter = 0;

  // Residuo inicial
  residualHistory.push(norm2(residual(A, x, b)));

  for (iter = 1; iter <= maxIter; iter++) {
    const xNew = new Array(n);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j]; // usa valores de la iteración anterior
        }
      }
      xNew[i] = (b[i] - sum) / A[i][i];
    }

    // Registrar residuo
    const r = residual(A, xNew, b);
    residualHistory.push(norm2(r));

    // Verificar convergencia
    const diff = xNew.map((v, i) => v - x[i]);
    if (normInf(diff) < tol) {
      x = xNew;
      converged = true;
      break;
    }

    x = xNew;
  }

  return {
    solution: x,
    iterations: iter > maxIter ? maxIter : iter,
    converged,
    residualHistory,
    executionTime: performance.now() - t0,
  };
}
