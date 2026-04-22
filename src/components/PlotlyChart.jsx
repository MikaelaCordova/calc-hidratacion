/**
 * PlotlyChart.jsx — Wrapper for react-plotly.js with correct import pattern
 */
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponentFactory from 'react-plotly.js/factory';

// The factory module exports { default: createPlotlyComponent }
const createPlotlyComponent = createPlotlyComponentFactory.default || createPlotlyComponentFactory;
const Plot = createPlotlyComponent(Plotly);

export default Plot;
