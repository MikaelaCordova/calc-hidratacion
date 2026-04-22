# HidraCalc: Calculadora de Hidratación Intravenosa

HidraCalc es una aplicación web interactiva orientada a la medicina clínica, diseñada para calcular la dosificación óptima de sueros intravenosos utilizando la resolución de sistemas de ecuaciones lineales mediante **Métodos Numéricos**. Este proyecto fue desarrollado como parte de la asignatura de Métodos Numéricos.

**Demo en vivo: [Ver aplicación desplegada](https://mikaelacordova.github.io/calc-hidratacion/)**

## Documentación y Teoría

Toda la fundamentación teórica, el planteamiento del problema clínico (balance de sodio, potasio y glucosa) y la justificación detallada de la arquitectura matemática se encuentran en el siguiente enlace:
**[Ver Documentación y Marco Teórico (PDF)](./docs/documentacion.pdf)**

## Características Principales

- **Calculadora Interactiva**: Interfaz intuitiva para modificar los requerimientos del paciente y la composición de los sueros.
- **Cinco Métodos de Resolución**:
  - *Directos*: Factorización LU con pivoteo parcial.
  - *Iterativos Clásicos*: Jacobi, Gauss-Seidel.
  - *Iterativos Avanzados*: SOR (Sobrerelajación Sucesiva) con parámetro $\omega$ ajustable.
  - *Técnicas Modernas*: Gradiente Conjugado Precondicionado (maneja matrices no simétricas mediante ecuaciones normales).
- **Visualización 3D**: Representación interactiva con Plotly.js de los planos formados por cada balance de nutrientes.
- **Gráficos de Convergencia**: Monitoreo dinámico del residuo $||b - Ax||_2$ vs. iteraciones.
- **Escenarios Preconfigurados**: Tres casos clínicos específicos (Bien condicionado, Estrés, Mal condicionado)

## Stack Tecnológico

- **Core**: React.js 18 + Vite
- **Estilos**: CSS3 Vanilla (Arquitectura de variables globales y tokens de diseño, efecto Glassmorphism)
- **Cómputo Numérico**: Algoritmos de álgebra lineal implementados nativamente en JavaScript (`src/solvers/`).
- **Renderizado Matemático**: KaTeX
- **Gráficos**: Plotly.js (`react-plotly.js`)

## Instalación y Ejecución Local

1. Asegúrate de tener Node.js instalado.
2. Clona este repositorio y navega a la carpeta del proyecto:
   ```bash
   cd calc-hidratacion
   ```
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
5. Abre el navegador en `http://localhost:5173`.

## Desarrollado Por

**Univ. Mikaela Belen Cordova Vasquez**  
*Materia: Métodos Numéricos*
