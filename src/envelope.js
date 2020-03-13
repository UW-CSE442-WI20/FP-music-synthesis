import * as Tone from 'tone';
import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

const synth = require("./synth.js");

document.addEventListener("DOMContentLoaded", function() {
  const sliderWidth = 300;
  const sliderHeight = 75;
  const strokeWidth = 2;

  const envl = new Tone.Envelope();

  var margin = {top: 10, right: 30, bottom: 30, left: 60};
  var width = 460 - margin.left - margin.right;
  var height = 150 - margin.top - margin.bottom;

  var svg = d3.select("#envelope-viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  function getEnvelopeCurve(envl, callback) {
    const n = envl.attack + envl.decay + envl.release;
    const params = envl.get();

    // Simulate envelope to get curve data
    Tone.Offline(() => {
      const dummy = new Tone.Envelope;
      dummy.set(params);
      dummy.attack *= 1, dummy.decay *= 1, dummy.release *= 1;
      dummy.toMaster();
      dummy.triggerAttack(.001);
      dummy.triggerRelease(1 * (dummy.attack + dummy.decay + .01) + .001);
    }, 1 * (n + .01) + .002).then(function(d) {
      var points = d.toArray(0);
      callback(points);
    });
  }

  function updateDivideLine() {
    var beforeRelease = envl.attack + envl.decay;
    var fullTime = beforeRelease + envl.release;
    var divideX = width * beforeRelease / fullTime;
    svg.select("line")
      .attr("x1", divideX)
      .attr("y1", 0)
      .attr("x2", divideX)
      .attr("y2", height);
    svg.select("text")
      .attr("x", divideX + 5);
  }

  function initEnvelopeCurve() {
    synth.setEnvelope(envl);
    getEnvelopeCurve(envl, function(points) {
      var x = d3.scaleLinear().domain([0, points.length]).range([0, width]);
      var y = d3.scaleLinear().domain([1, 0]).range([0, height]);
      var line = d3.line()
	  .x((d, i) => x(i))
	  .y(d => y(d))

      // Draw envelope plot
      svg.append("path")
	.attr("fill", "none")
	.attr("stroke", "black")
	.attr("stroke-width", strokeWidth)
	.attr("d", line(points));

      // Draw divide line between hold and release
      svg.append("line")
	.style("stroke", "#000")
	.attr("stroke-width", strokeWidth)
	.attr("opacity", 0.2)
	.style("stroke-dasharray", ("3, 3"));
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "start")
      .attr("y", 0)
	.text(String.fromCharCode(0x2190) + " before release");
      updateDivideLine();
    });
  }

  function updateEnvelopeCurve() {
    synth.setEnvelope(envl);
    getEnvelopeCurve(envl, function(points) {
      var x = d3.scaleLinear().domain([0, points.length]).range([0, width]);
      var y = d3.scaleLinear().domain([1, 0]).range([0, height]);
      var line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
      svg.selectAll("path")
	.attr("d", line(points));

      updateDivideLine()
    });
  }

  // Sliders
  var attackSlider = sliderHorizontal()
      .min(0.01)
      .max(2)
      .width(sliderWidth)
      .displayValue(true)
      .tickFormat(d3.format('.2'))
      .default(envl.attack)
      .on('onchange', val => {
        envl.attack = val;
        updateEnvelopeCurve();
      });
  d3.select('#envelope-attack-slider')
    .append('svg')
    .attr('width', sliderWidth + 50)
    .attr('height', sliderHeight)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(attackSlider);

  var decaySlider = sliderHorizontal()
      .min(0.01)
      .max(2)
      .width(sliderWidth)
      .displayValue(true)
      .tickFormat(d3.format('.2'))
      .default(envl.decay)
      .on('onchange', val => {
        envl.decay = val;
        updateEnvelopeCurve();
      });
  d3.select('#envelope-decay-slider')
    .append('svg')
    .attr('width', sliderWidth + 50)
    .attr('height', sliderHeight)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(decaySlider);

  var sustainSlider = sliderHorizontal()
      .min(0.01)
      .max(1)
      .width(sliderWidth)
      .displayValue(true)
      .tickFormat(d3.format('.2'))
      .default(envl.sustain)
      .on('onchange', val => {
        envl.sustain = val;
        updateEnvelopeCurve();
      });
  d3.select('#envelope-sustain-slider')
    .append('svg')
    .attr('width', sliderWidth + 50)
    .attr('height', sliderHeight)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(sustainSlider);

  var releaseSlider = sliderHorizontal()
      .min(0.01)
      .max(4)
      .width(sliderWidth)
      .displayValue(true)
      .tickFormat(d3.format('.2'))
      .default(envl.release)
      .on('onchange', val => {
        envl.release = val;
        updateEnvelopeCurve();
      });
  d3.select('#envelope-release-slider')
    .append('svg')
    .attr('width', sliderWidth + 50)
    .attr('height', sliderHeight)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(releaseSlider);

  // Curve type selection
  function populateSelect(id, curveTypes, attr) {
    // Options
    curveTypes.forEach(function (val, i) {
      var option = document.createElement('option');
      option.value = val;
      option.text = val;
      if (val == envl[attr]) {
	option.selected = true;
      }
      document.getElementById(id).appendChild(option);
    });

    var select = document.getElementById(id);
    select.addEventListener('change', function() {
      envl[attr] = select.value;
      updateEnvelopeCurve();
    });
  }

  var attackCurveTypes = [
    "linear",
    "exponential",
    "sine",
    "cosine",
    "bounce",
    "ripple",
    "step"
  ];
  var decayCurveTypes = [
    "linear",
    "exponential"
  ];
  var releaseCurveTypes = [
    "linear",
    "exponential",
    "sine",
    "cosine",
    "bounce",
    "ripple",
    "step"
  ];
  populateSelect(
    'envelope-attack-select',
    attackCurveTypes,
    'attackCurve'
  );
  populateSelect(
    'envelope-decay-select',
    decayCurveTypes,
    'decayCurve'
  );
  populateSelect(
    'envelope-release-select',
    releaseCurveTypes,
    'releaseCurve'
  );

  initEnvelopeCurve()
});
