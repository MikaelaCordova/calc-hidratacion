/**
 * utils.js — Utilidades matemáticas para los solvers
 */

/** Norma infinito de un vector */
export function normInf(v) {
  return Math.max(...v.map(Math.abs));
}

/** Norma 2 (euclidiana) de un vector */
export function norm2(v) {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

/** Producto punto de dos vectores */
export function dot(a, b) {
  return a.reduce((s, ai, i) => s + ai * b[i], 0);
}

/** Multiplicación matriz × vector: A·v */
export function matVec(A, v) {
  return A.map(row => dot(row, v));
}

/** Resta de vectores: a - b */
export function vecSub(a, b) {
  return a.map((ai, i) => ai - b[i]);
}

/** Suma de vectores: a + b */
export function vecAdd(a, b) {
  return a.map((ai, i) => ai + b[i]);
}

/** Escalar por vector: s·v */
export function vecScale(s, v) {
  return v.map(vi => s * vi);
}

/** Copia profunda de una matriz */
export function cloneMatrix(M) {
  return M.map(row => [...row]);
}

/** Copia de un vector */
export function cloneVec(v) {
  return [...v];
}

/**
 * Calcula el residuo r = b - A·x
 */
export function residual(A, x, b) {
  return vecSub(b, matVec(A, x));
}

/**
 * Estima el número de condición de una matriz 3×3 usando κ = ||A||∞ · ||A⁻¹||∞
 * Para matrices pequeñas, calculamos la inversa explícitamente.
 */
export function conditionNumber(A) {
  const n = A.length;
  // Norma infinito de A
  const normA = Math.max(...A.map(row => row.reduce((s, v) => s + Math.abs(v), 0)));

  // Inversa por adjunta para 3×3
  if (n === 3) {
    const det = determinant3(A);
    if (Math.abs(det) < 1e-15) return Infinity;
    const inv = inverse3(A, det);
    const normInvA = Math.max(...inv.map(row => row.reduce((s, v) => s + Math.abs(v), 0)));
    return normA * normInvA;
  }
  return NaN;
}

function determinant3(A) {
  return (
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
  );
}

function inverse3(A, det) {
  const d = 1 / det;
  return [
    [
      d * (A[1][1] * A[2][2] - A[1][2] * A[2][1]),
      d * (A[0][2] * A[2][1] - A[0][1] * A[2][2]),
      d * (A[0][1] * A[1][2] - A[0][2] * A[1][1]),
    ],
    [
      d * (A[1][2] * A[2][0] - A[1][0] * A[2][2]),
      d * (A[0][0] * A[2][2] - A[0][2] * A[2][0]),
      d * (A[0][2] * A[1][0] - A[0][0] * A[1][2]),
    ],
    [
      d * (A[1][0] * A[2][1] - A[1][1] * A[2][0]),
      d * (A[0][1] * A[2][0] - A[0][0] * A[2][1]),
      d * (A[0][0] * A[1][1] - A[0][1] * A[1][0]),
    ],
  ];
}

/**
 * Verifica si la matriz es simétrica
 */
export function isSymmetric(A) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[i][j] - A[j][i]) > 1e-10) return false;
    }
  }
  return true;
}

/**
 * Verifica dominancia diagonal
 */
export function isDiagonallyDominant(A) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (j !== i) sum += Math.abs(A[i][j]);
    }
    if (Math.abs(A[i][i]) <= sum) return false;
  }
  return true;
}
