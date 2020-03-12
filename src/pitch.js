import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

function generateSineData(freq){
  return d3.range(0, 100, 0.2).map(function(i){
    return Math.sin(i * freq);
  });
}

var samples, data, width, height, margin, w, h, xScale, yScale, svg, line, g, pitch, xAxis, yAxis, path;
samples = Math.PI * 3;
data = generateSineData(1.0);
width = 800;
height = 500;
pitch = 1;
margin = {
  top: 10,
  right: 10,
  bottom: 40,
  left: 40
};
w = width - margin.right;
h = height - margin.top - margin.bottom;
xScale = d3.scaleLinear().domain([0, samples - 1]).range([0, w]);
yScale = d3.scaleLinear().domain([-1, 1]).range([h, 0]);
svg = d3.select('#vis')
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
// xAxis = d3.svg.axis().scale(xScale).ticks(10).orient('bottom');
// svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + h + ")").call(xAxis);
// yAxis = d3.svg.axis().scale(yScale).ticks(5).orient('left');
// svg.append('g').attr('class', 'y axis').call(yAxis);
line = d3.line().x(function(d, i){
  return xScale(i);
}).y(function(d){
  return yScale(d);
}).curve(d3.curveBasis);

g = svg.append('g').attr('clip-path', 'url(#clip)');
path = g.append('path')
  .attr('class', 'line')
  .data([data])
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
  .min(0.01)
  .max(10)
  .width(300)
  .displayValue(true)
  .tickFormat(d3.format('1'))
  .default(pitch)
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