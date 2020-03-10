import * as Tone from 'tone';

const d3 = require('d3');

var fft = new Tone.FFT();
var waveform = new Tone.Waveform();
var synth = new Tone.PolySynth().chain(fft, waveform, Tone.Master);

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
    console.log(type);
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

module.exports = {
    synth: synth,
    setEnvelope: setEnvelope,
    fft: fft,
    waveform: waveform
};