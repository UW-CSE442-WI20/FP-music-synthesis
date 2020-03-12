import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

const sample_window = 100;
const DEFAULT = 440;
const width = 800;
const height = 500;
const margin = {
  top: 10,
  right: 10,
  bottom: 40,
  left: 40
};
const w = width - margin.right;
const h = height - margin.top - margin.bottom;

function generateSineData(freq) {
  freq = freq / 100;
  return d3.range(0, sample_window, 0.2).map(function(i) {
    return Math.sin(i * freq);
  });
}

const xScale = d3.scaleLinear().domain([0, sample_window - 1]).range([0, w]);
const yScale = d3.scaleLinear().domain([-1, 1]).range([h, 0]);
const svg = d3.select('#pitch-waveform')
  .append('svg')
  .attr('width', w + margin.left + margin.right)
  .attr('height', h + margin.top + margin.bottom)
  .append('g')
  .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
svg.append("defs")
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", w)
  .attr("height", h);

const line = d3.line().x(function(d, i) {
  return xScale(i);
}).y(function(d) {
  return yScale(d);
}).curve(d3.curveBasis);

const g = svg.append('g').attr('clip-path', 'url(#clip)');
g.append('path')
  .attr('class', 'line')
  .data([generateSineData(DEFAULT)])
  .attr('d', line)
  .style('fill', 'none')
  .style('stroke', 'black')
  .style('stroke-width', '1px');


function updatePitch(pitch) {
  var data = generateSineData(pitch);
  console.log(data);
  svg.selectAll("path")
    .data([data])
    .attr('d', line);
}

/*********************/ 
/*                   */
/*      Slider       */
/*********************/
var pitchSlider = sliderHorizontal()
  .min(1)
  .max(880)
  .width(300)
  .displayValue(true)
  .tickFormat(d3.format('.1f'))
  .default(DEFAULT)
  .on('onchange', val => {
    updatePitch(val);
});
d3.select('#pitch-slider')
  .append('svg')
  .attr('width', 300 + 50)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  .call(pitchSlider);