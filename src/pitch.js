import * as Tone from "tone";
import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';

document.addEventListener("DOMContentLoaded", function() {
  const synthMaster = require('./synth.js');
  console.log(synthMaster);
  console.log(synthMaster.volume);
  var synth = new Tone.Synth().chain(synthMaster.volume, Tone.Master);
  synth.oscillator.type = "sine";

  const sampleWindow = 100;
  const sampleStep = 0.5;
  const DEFAULT_FREQ = 440;
  const width = 800;
  const height = 200;
  const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 40
  };
  const w = width - margin.right;
  const h = height - margin.top - margin.bottom;

  const sliderWidth = 350;
  const sliderHeight = 100;
  const buttonWidth = sliderWidth;
  const buttonHeight = 50;

  const delay = 16;
  const timeStep = 10;

  var frequency = DEFAULT_FREQ;
  var t = 0;

  function generateSineData(freq, t=0) {
    freq = freq / 1000;
    return d3.range(0, sampleWindow, sampleStep).map(function(i) {
      return Math.sin(i * freq + t);
    });
  }

  const xScale = d3.scaleLinear().domain([0, sampleWindow / sampleStep]).range([0, w]);
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
    .data([generateSineData(frequency)])
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '1px');

  function updateWavePlot() {
    var data = generateSineData(frequency, t);
    svg.selectAll("path")
      .data([data])
      .attr('d', line);
  }

  function updateFrequency(freq) {
    frequency = freq;
    updateWavePlot(freq);
  }

  var doAnimation = false;
  function startWaveAnimation() {
    function updateLoop() {
      t += timeStep;
      updateWavePlot();
      if (doAnimation) {
	setTimeout(updateLoop, delay);
      }
    }
    doAnimation = true;
    updateLoop();
  }

  function stopWaveAnimation() {
    doAnimation = false;
  }

  /*********************/
  /*      Slider       */
  /*********************/
  var pitchSlider = sliderHorizontal()
      .min(65.4) // C2
      .max(880)  // A5
      .width(sliderWidth)
      .displayValue(true)
      .tickFormat(d3.format('.1f'))
      .default(frequency)
      .on('onchange', freq => {
	updateFrequency(freq);
      });
  d3.select('#pitch-slider')
    .append('svg')
    .attr('width', sliderWidth + 50)
    .attr('height', sliderHeight)
    .append('g')
    .attr('transform', 'translate(30,30)')
    .call(pitchSlider);

  /*********************/
  /*    Tone Button    */
  /*********************/
  const toneButton = document.getElementById("pitch-tone-button");
  var toneButtonDown = false;
  toneButton.addEventListener("mousedown", function() {
    toneButtonDown = true;
    synth.triggerAttack(frequency);
    startWaveAnimation();
  });
  window.addEventListener("mouseup", function() {
    if (toneButtonDown) {
      synth.triggerRelease();
      toneButtonDown = false;
      stopWaveAnimation();
    }
  });
});
