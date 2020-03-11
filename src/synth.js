import * as Tone from 'tone';
import * as d3 from 'd3';
import { sliderVertical } from 'd3-simple-slider';

var fft = new Tone.FFT();
var waveform = new Tone.Waveform();
var synth = new Tone.PolySynth(8, Tone.Synth).chain(fft, waveform, Tone.Master);

const DEFAULT_VOLUME = -8;
synth.volume.value = DEFAULT_VOLUME;

// -----------------
// -- OSCILLATORS --
// -----------------
d3.selectAll("input[name='wave-type']").on("change", function(){
    setOscillatorType(this.value);
});

d3.selectAll("input[name='wave-type']").property("checked", function(){ return this.value === "triangle"; });

function setOscillatorType(type) {
    const voices = synth.voices;
    for (const voice in voices) {
        voices[voice].oscillator.type = type;
    }
}

function setEnvelope(envl) {
    const voices = synth.voices;
    for (const voice in voices) {
        voices[voice].envelope.attack = envl.attack;
        voices[voice].envelope.decay = envl.decay;
        voices[voice].envelope.sustain = envl.sustain;
        voices[voice].envelope.release = envl.release;
        voices[voice].envelope.attackCurve = envl.attackCurve;
        voices[voice].envelope.decayCurve = envl.decayCurve;
        voices[voice].envelope.releaseCurve = envl.releaseCurve;
    }
}

// --------------------
// --   VOLUME      ---
// --------------------

var width = 0;
var height = 300 + 0;

var offsetW = 50;
var offsetH = 30;

var volumeSlider = sliderVertical()
  .min(-32)
  .max(0)
  .width(width)
  .height(height)
  .tickFormat(d3.format('.2'))
  .ticks(0)
  .default(DEFAULT_VOLUME)
  .fill('#2196f3')
  .handle(d3
    .symbol()
    .type(d3.symbolCircle)
    .size(200)())
  .on('onchange', val => {
    synth.volume.value = val;
  });

var svg = d3
  .select('#volume')
  .append('svg')
  .attr('width', width + 2*offsetW)
  .attr('height', height + 2*offsetH)
  .append('g')
  .attr('transform', 'translate(' + offsetW + ',' + offsetH + ')');

svg.call(volumeSlider);

module.exports = {
    synth: synth,
    setEnvelope: setEnvelope,
    fft: fft,
    waveform: waveform
};