/**
 * luFactorization.js — Factorización PA = LU con pivoteo parcial
 *
 * Método directo: descompone A en L (triangular inferior) y U (triangular superior)
 * con una matriz de permutación P para estabilidad numérica.
 *
 * Luego resuelve:
 *   1. Ly = Pb  (sustitución hacia adelante)
 *   2. Ux = y   (sustitución hacia atrás)
 *
 * Retorna iteraciones = 1 porque es un método directo.
 */

import { cloneMatrix, cloneVec, residual, norm2 } from './utils.js';

export function solveLU(A_input, b_input) {
  const t0 = performance.now();
  const n = A_input.length;
  const A = cloneMatrix(A_input);
  const b = cloneVec(b_input);

  // Índices de permutación
  const perm = Array.from({ length: n }, (_, i) => i);

  // Eliminación con pivoteo parcial → produce L y U in-place en A
  for (let k = 0; k < n - 1; k++) {
    // Buscar pivote máximo
    let maxVal = Math.abs(A[k][k]);
    let maxIdx = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(A[i][k]) > maxVal) {
        maxVal = Math.abs(A[i][k]);
        maxIdx = i;
      }
    }

    // Intercambiar filas
    if (maxIdx !== k) {
      [A[k], A[maxIdx]] = [A[maxIdx], A[k]];
      [perm[k], perm[maxIdx]] = [perm[maxIdx], perm[k]];
    }

    if (Math.abs(A[k][k]) < 1e-15) {
      return {
        solution: new Array(n).fill(NaN),
        iterations: 1,
        converged: false,
        residualHistory: [Infinity],
        executionTime: performance.now() - t0,
      };
    }

    for (let i = k + 1; i < n; i++) {
      A[i][k] = A[i][k] / A[k][k]; // multiplier stored in L part
      for (let j = k + 1; j < n; j++) {
        A[i][j] -= A[i][k] * A[k][j];
      }
    }
  }

  // Aplicar permutación a b
  const pb = perm.map(i => b[i]);

  // Sustitución hacia adelante: Ly = Pb (L tiene 1s en la diagonal, almacenados implícitamente)
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    y[i] = pb[i];
    for (let j = 0; j < i; j++) {
      y[i] -= A[i][j] * y[j];
    }
  }

  // Sustitución hacia atrás: Ux = y
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = y[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= A[i][j] * x[j];
    }
    x[i] /= A[i][i];
  }

  const r = residual(A_input, x, b_input);
  const res = norm2(r);

  return {
    solution: x,
    iterations: 1,
    converged: true,
    residualHistory: [res],
    executionTime: performance.now() - t0,
  };
}
