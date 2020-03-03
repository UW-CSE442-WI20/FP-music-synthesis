import * as Tone from 'tone';

const d3 = require('d3');

var synth = new Tone.Synth().toMaster();

// -----------------
// -- OSCILLATORS --
// -----------------
d3.selectAll("input[name='wave-type']").on("change", function(){
    console.log(this.value);
    synth.oscillator.type = this.value;
});

module.exports.synth = synth;