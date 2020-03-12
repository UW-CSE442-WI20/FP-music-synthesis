import * as Tone from 'tone';
import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

document.addEventListener("DOMContentLoaded", function() {
  var xBound = [0, 50];
  var yBound = [-3, 3];
  var step = 0.8;

  var margin = {top: 10, right: 30, bottom: 30, left: 60};
  var width = 600 - margin.left - margin.right;
  var height = 150 - margin.top - margin.bottom;

  // Animation parameters
  // Delay is about 60 FPS
  var delay = 16;
  var timeStep = 0.05;
  var maxOpacity = 0.6;
  var fadeInTime = 1000;

  var svg = d3.select("#soundwave-viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      	    "translate(" + margin.left + "," + margin.top + ")");

  var dataLength = (xBound[1] - xBound[0]) / step;
  var x = d3.scaleLinear().domain([0, dataLength]).range([0, width]);
  var y = d3.scaleLinear().domain(yBound).range([0, height]);
  var xAxis = d3.axisBottom()
      .scale(x)
      .tickValues([])
      .tickSize(0, 0);
  var yAxis = d3.axisLeft()
      .scale(y)
      .tickValues([])
      .tickSize(0, 0);
  var line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

  function getWaveCurveData(t) {
    var data = [];
    for (var xi = xBound[0]; xi < xBound[1]; xi += step) {
      var xi2 = xi + t;
      var yi = Math.sin(xi2)
	  - 0.3 * Math.sin(xi2 * 0.5)
	  - 2 * Math.sin(xi2 * 0.3);
      data.push(yi);
    }
    return data;
  }

  function initWavePlot() {
    // Curve
    var data = getWaveCurveData(0);
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", line(data));

    // Axis labels
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "center")
      .attr("x", width / 2)
      .attr("y", height + 20)
      .text("time");
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "center")
      .attr("x", -height * 3/4)
      .attr("y", -20)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("pressure");

    // TODO: Display axes
    // // Axes
    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0, " + height + ")")
    //   .call(xAxis);
    // svg.append("g")
    //   .attr("class", "y axis")
    //   .call(yAxis);
  }

  function updateWavePlot(t, opacity) {
    var data = getWaveCurveData(t);
    svg.selectAll("path")
      .attr("d", line(data))
      .style("opacity", opacity);
  }

  function startWaveAnimation() {
    var t = 0;
    var opacity = 0;
    var opacityStep = maxOpacity / fadeInTime * delay;
    function updateLoop() {
      t += timeStep;
      opacity = Math.min(opacity + opacityStep, maxOpacity);
      updateWavePlot(t, opacity);
      setTimeout(updateLoop, delay);
    }
    updateLoop();
  }

  initWavePlot();
  startWaveAnimation();
});
