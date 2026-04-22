/**
 * scenarios.js — Los 3 escenarios clínicos predefinidos
 *
 * Cada escenario contiene:
 *  - id, nombre, badge (tipo de badge CSS)
 *  - descripción clínica
 *  - Matriz A (3×3) y vector b (3×1)
 *  - Explicación de por qué tiene esa condición numérica
 *  - Composición de sueros para la tabla visual
 */

export const NUTRIENTES = [
  {
    nombre: 'Sodio (Na⁺)',
    rol: 'Regula la presión osmótica y el volumen extracelular',
    unidad: 'mEq/L',
    icono: '🧂',
  },
  {
    nombre: 'Potasio (K⁺)',
    rol: 'Mantiene el potencial de membrana en células musculares y cardíacas',
    unidad: 'mEq/L',
    icono: '⚡',
  },
  {
    nombre: 'Glucosa',
    rol: 'Fuente primaria de energía para el metabolismo celular',
    unidad: 'g/L',
    icono: '🍬',
  },
];

export const VARIABLES_INFO = [
  { variable: 'x₁', nombre: 'Litros del Suero A', desc: 'Volumen total del Suero A que se inyecta al paciente' },
  { variable: 'x₂', nombre: 'Litros del Suero B', desc: 'Volumen total del Suero B que se inyecta al paciente' },
  { variable: 'x₃', nombre: 'Litros del Suero C', desc: 'Volumen total del Suero C que se inyecta al paciente' },
];

export const SCENARIOS = [
  {
    id: 'ideal',
    nombre: 'Caso 1: Bien Condicionado',
    subtitulo: 'Deshidratación Moderada',
    badge: 'success',
    badgeText: 'Estable',
    descripcion:
      'Un paciente adulto ingresa al servicio de urgencias con deshidratación moderada provocada por gastroenteritis aguda. Sus signos vitales son estables: frecuencia cardíaca ligeramente elevada (95 lpm), presión arterial normal-baja y piel con turgencia disminuida. Los análisis de laboratorio muestran valores de electrolitos por debajo del rango óptimo.',
    explicacionCondicion:
      'La matriz A es diagonalmente dominante: en cada fila, el coeficiente de la diagonal supera en magnitud a la suma de los demás coeficientes. Esto garantiza convergencia rápida de los métodos iterativos y un número de condición pequeño.',
    sueros: [
      { nombre: 'Suero A', sodio: 150, potasio: 3, glucosa: 20 },
      { nombre: 'Suero B', sodio: 20, potasio: 12, glucosa: 25 },
      { nombre: 'Suero C', sodio: 15, potasio: 2, glucosa: 80 },
    ],
    requerimiento: { sodio: 185, potasio: 17, glucosa: 150 },
    A: [
      [150, 20, 15],
      [3, 12, 2],
      [20, 25, 80],
    ],
    b: [185, 17, 150],
    ecuaciones: [
      '150x_1 + 20x_2 + 15x_3 = 185',
      '3x_1 + 12x_2 + 2x_3 = 17',
      '20x_1 + 25x_2 + 80x_3 = 150',
    ],
  },
  {
    id: 'stress',
    nombre: 'Caso 2: Bajo Estrés',
    subtitulo: 'Shock Hipovolémico',
    badge: 'warning',
    badgeText: 'Estrés',
    descripcion:
      'Un paciente llega a urgencias en shock hipovolémico: pérdida masiva de líquidos. Su presión arterial es críticamente baja y el nivel de consciencia está comprometido. Los valores de sodio y potasio están muy por debajo de lo normal, y la glucemia muestra hipoglucemia severa.',
    explicacionCondicion:
      'Los coeficientes de mayor magnitud amplifican los errores de redondeo en cada iteración. Los métodos iterativos requieren más pasos para converger, especialmente si la matriz no es tan dominante como en el caso ideal.',
    sueros: [
      { nombre: 'Suero A', sodio: 145, potasio: 4, glucosa: 40 },
      { nombre: 'Suero B', sodio: 70, potasio: 10, glucosa: 40 },
      { nombre: 'Suero C', sodio: 70, potasio: 5, glucosa: 85 },
    ],
    requerimiento: { sodio: 285, potasio: 19, glucosa: 165 },
    A: [
      [145, 70, 70],
      [4, 10, 5],
      [40, 40, 85],
    ],
    b: [285, 19, 165],
    ecuaciones: [
      '145x_1 + 70x_2 + 70x_3 = 285',
      '4x_1 + 10x_2 + 5x_3 = 19',
      '40x_1 + 40x_2 + 85x_3 = 165',
    ],
  },
  {
    id: 'illcond',
    nombre: 'Caso 3: Mal Condicionado',
    subtitulo: 'Sueros Similares',
    badge: 'danger',
    badgeText: 'Inestable',
    descripcion:
      'Un hospital en zona rural recibe un paciente con deshidratación moderada, pero el stock de sueros es limitado: solo dispone del Suero A y de un Suero B prácticamente idéntico. Como única alternativa diferenciada, tiene un Suero C con alta concentración de glucosa. Cuando dos sueros son nutricionalmente casi idénticos, las ecuaciones se vuelven casi proporcionales.',
    explicacionCondicion:
      'La similitud entre las columnas del Suero A y Suero B hace que la matriz A sea casi singular. El número de condición κ(A) es muy elevado: pequeñas perturbaciones en b producen grandes cambios en x. Clínicamente, un error de ±1 mEq en la medición puede variar la dosis en varios litros.',
    sueros: [
      { nombre: 'Suero A', sodio: 150, potasio: 3, glucosa: 20 },
      { nombre: 'Suero B', sodio: 148, potasio: 2.95, glucosa: 19.8 },
      { nombre: 'Suero C', sodio: 15, potasio: 2, glucosa: 80 },
    ],
    requerimiento: { sodio: 185, potasio: 17, glucosa: 150 },
    A: [
      [150, 148, 15],
      [3, 2.95, 2],
      [20, 19.8, 80],
    ],
    b: [185, 17, 150],
    ecuaciones: [
      '150x_1 + 148x_2 + 15x_3 = 185',
      '3x_1 + 2.95x_2 + 2x_3 = 17',
      '20x_1 + 19.8x_2 + 80x_3 = 150',
    ],
  },
];

export const METHODS = [
  { id: 'lu', nombre: 'Factorización LU', tipo: 'directo' },
  { id: 'jacobi', nombre: 'Jacobi', tipo: 'iterativo' },
  { id: 'gaussSeidel', nombre: 'Gauss-Seidel', tipo: 'iterativo' },
  { id: 'sor', nombre: 'SOR', tipo: 'iterativo' },
  { id: 'conjugateGradient', nombre: 'Grad. Conjugado Prec.', tipo: 'iterativo' },
];
