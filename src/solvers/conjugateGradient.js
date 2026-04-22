/**
 * conjugateGradient.js — Gradiente Conjugado Precondicionado
 *
 * Basado en el Algoritmo 2 del artículo:
 *   "Método de Gradientes Conjugados Precondicionado"
 *   Porfirio Suñagua S., UMSA, 2020
 *
 * El método resuelve Ax = b donde A es simétrica y definida positiva.
 * Se usa un precondicionador M = diag(A) (precondicionador de Jacobi),
 * de modo que en cada iteración se resuelve Mz = r, lo cual es trivial
 * porque M es diagonal: z_i = r_i / a_ii.
 *
 * ALGORITMO (Hestenes-Stiefel precondicionado):
 *   Datos: x₀ (aprox. inicial)
 *   r₀ = b - A·x₀
 *   Mientras r_k ≠ 0:
 *     Resolver Mz_k = r_k
 *     k = k + 1
 *     Si k = 1: p₁ = z₀
 *     Sino:     β_k = (r_{k-1}ᵀ z_{k-1}) / (r_{k-2}ᵀ z_{k-2})
 *               p_k = z_{k-1} + β_k · p_{k-1}
 *     α_k = (r_{k-1}ᵀ z_{k-1}) / (p_kᵀ A p_k)
 *     x_k = x_{k-1} + α_k · p_k
 *     r_k = r_{k-1} - α_k · A · p_k
 *
 * Nota: Para matrices NO simétricas, se aplica a la forma AᵀAx = Aᵀb
 * (ecuaciones normales), que siempre es simétrica definida positiva.
 */

import { dot, matVec, vecSub, vecAdd, vecScale, norm2, isSymmetric } from './utils.js';

/**
 * Resuelve Mz = r donde M = diag(A)
 */
function preconditionerSolve(diagA, r) {
  return r.map((ri, i) => ri / diagA[i]);
}

/**
 * Transpone una matriz
 */
function transpose(A) {
  const n = A.length;
  const m = A[0].length;
  const T = [];
  for (let j = 0; j < m; j++) {
    T[j] = [];
    for (let i = 0; i < n; i++) {
      T[j][i] = A[i][j];
    }
  }
  return T;
}

export function solveConjugateGradient(A_input, b_input, tol = 1e-6, maxIter = 1000) {
  const t0 = performance.now();
  const n = A_input.length;

  let A, b;
  // Si A no es simétrica, usamos ecuaciones normales: AᵀA x = Aᵀb
  if (!isSymmetric(A_input)) {
    const At = transpose(A_input);
    A = At.map(row => {
      const result = new Array(n);
      for (let j = 0; j < n; j++) {
        result[j] = dot(row, A_input.map(r => r[j]));
      }
      return result;
    });
    b = matVec(transpose(A_input), b_input);
  } else {
    A = A_input;
    b = b_input;
  }

  // Diagonal de A (para el precondicionador de Jacobi)
  const diagA = A.map((row, i) => row[i]);

  // Verificar que los elementos diagonales no sean cero
  if (diagA.some(d => Math.abs(d) < 1e-15)) {
    return {
      solution: new Array(n).fill(NaN),
      iterations: 0,
      converged: false,
      residualHistory: [Infinity],
      executionTime: performance.now() - t0,
    };
  }

  let x = new Array(n).fill(0); // x₀ = 0
  let r = vecSub(b, matVec(A, x));  // r₀ = b - Ax₀
  let z = preconditionerSolve(diagA, r); // Mz₀ = r₀
  let p = [...z]; // p₁ = z₀

  let rz = dot(r, z); // r₀ᵀz₀

  const residualHistory = [norm2(vecSub(b_input, matVec(A_input, x)))];
  let converged = false;
  let iter = 0;

  for (iter = 1; iter <= maxIter; iter++) {
    const Ap = matVec(A, p);       // A·p_k
    const pAp = dot(p, Ap);       // p_kᵀ A p_k

    if (Math.abs(pAp) < 1e-15) break;

    const alpha = rz / pAp;       // α_k = (r_{k-1}ᵀ z_{k-1}) / (p_kᵀ A p_k)

    x = vecAdd(x, vecScale(alpha, p));   // x_k = x_{k-1} + α_k · p_k
    r = vecSub(r, vecScale(alpha, Ap));  // r_k = r_{k-1} - α_k · A · p_k

    // Registrar residuo respecto al sistema ORIGINAL
    residualHistory.push(norm2(vecSub(b_input, matVec(A_input, x))));

    const rNorm = norm2(r);
    if (rNorm < tol) {
      converged = true;
      break;
    }

    z = preconditionerSolve(diagA, r);   // Mz_k = r_k
    const rzNew = dot(r, z);            // r_kᵀ z_k

    const beta = rzNew / rz;            // β_{k+1} = (r_kᵀ z_k) / (r_{k-1}ᵀ z_{k-1})
    p = vecAdd(z, vecScale(beta, p));    // p_{k+1} = z_k + β_{k+1} · p_k

    rz = rzNew;
  }

  return {
    solution: x,
    iterations: iter > maxIter ? maxIter : iter,
    converged,
    residualHistory,
    executionTime: performance.now() - t0,
  };
}
