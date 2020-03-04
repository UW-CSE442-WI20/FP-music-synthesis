import * as Tone from 'tone';

const d3 = require('d3');

var fft = new Tone.FFT();
var waveform = new Tone.Waveform();
var synth = new Tone.Synth().chain(fft, waveform, Tone.Master);

// -----------------
// -- OSCILLATORS --
// -----------------
d3.selectAll("input[name='wave-type']").on("change", function(){
    console.log(this.value);
    synth.oscillator.type = this.value;
});

module.exports = {
    synth: synth,
    fft: fft,
    waveform: waveform
};