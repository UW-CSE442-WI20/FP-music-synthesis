import * as Tone from "tone";
const d3 = require('d3');

const synthMaster = require('./synth.js');
const synth = synthMaster.synth;
const waveform = synthMaster.waveform;

const keyboard = d3.select("#keyboard-root");

//TODO: Space sustain

// width and height of entire keyboard
const width = 800;
const height = 150;

// 1 Octave: 8 keys (C-C), 2 groups
const octaves = 3;                  // num of octaves
const keys_white = 7 * octaves + 1; // num of white keys

const black_ratio_w = .8;       // ratio of width of black keys to width of white keys
const black_ratio_h = .6;       // ratio of height of black keys to height of white keys
const black_height = black_ratio_h * height;

const white_width = width / keys_white;
const black_width = white_width * black_ratio_w;

keyboard
  .style("height", height + "px")
  .style("width", width + "px")

// define key mapping
const keymap_white = [
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
  ',', '.', '/', 'q', 'w', 'e', 'r',
  't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'
];

const keymap_black = [
  's', 'd', '', 'g', 'h', 'j', '',
  'l', ';', '', '2', '3', '4', '',
  '6', '7', '', '9', '0', '-', '',
];

const notemap_white = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
  'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6', 'C7', 'D7'
];

const notemap_black = [
  'Db4', 'Eb4', '', 'Gb4', 'Ab4', 'Bb4', '',
  'Db5', 'Eb5', '', 'Gb5', 'Ab5', 'Bb5', '',
  'Db6', 'Eb6', '', 'Gb6', 'Ab6', 'Bb6', ''
];

// create map to store keyboard events for specific keys
const keyboard_event_on = {};

const keyboard_event_off = {};

// link keyboard shortcuts
const key_map = {};

d3.select("body")
  .on("keydown", () => {
    let cur_key = key_map[d3.event.key];
    if (cur_key && !cur_key.down) {
      cur_key.down = true;
      cur_key.func_down();
    }
  })
  .on("keyup", () => {
    let cur_key = key_map[d3.event.key];
    if (cur_key && cur_key.down) {
      cur_key.down = false;
      cur_key.func_up();
    }
  })
  .on("mouseup", () => {
    if (click_note != null) {
      keyboard_event_off[click_note]();
    }
  });

for (let i = 0; i < notemap_white.length; i++) {
  //set (piano) keyboard events
  keyboard_event_on[notemap_white[i]] = function() {
    synth.triggerAttack(notemap_white[i]);
    d3.select("#" + notemap_white[i]).attr("class", "white-down white key");
  };
  keyboard_event_off[notemap_white[i]] = function() {
    synth.triggerRelease(notemap_white[i]);
    d3.select("#" + notemap_white[i]).attr("class", "white key");
  };

  //set (computer) keyboard key mappings
  key_map[keymap_white[i]] = {
    down: false,
    func_down: keyboard_event_on[notemap_white[i]],
    func_up: keyboard_event_off[notemap_white[i]]
  };
}

for (let i = 0; i < notemap_black.length; i++) {
  if (notemap_black[i] === "") {
    continue;
  }
  //set (piano) keyboard events
  keyboard_event_on[notemap_black[i]] = function(vel) {
    synth.triggerAttack(notemap_black[i], "+0", vel || 1);
    d3.select("#" + notemap_black[i]).attr("class", "black-down black key");
  };
  keyboard_event_off[notemap_black[i]] = function() {
    synth.triggerRelease(notemap_black[i]);
    d3.select("#" + notemap_black[i]).attr("class", "black key");
  };

  //set (computer) keyboard key mappings
  key_map[keymap_black[i]] = {
    down: false,
    func_down: keyboard_event_on[notemap_black[i]],
    func_up: keyboard_event_off[notemap_black[i]]
  };
}

const enharmonic_map = {
  'A#':'Bb',
  'C#':'Db',
  'D#':'Eb',
  'F#':'Gb',
  'G#':'Ab',
}

//convert midi to note using pitch scheme with flats to allow for easier css matching
function midi2Note(note) {
  let name = Tone.Midi(note).toNote();
  if (name.includes("#")) {
    return enharmonic_map[name.substring(0,2)] + name.substring(2);
  } else {
    return name;
  }
}

// create midi note functions
function note_down(note, vel) {
  let name = midi2Note(note);
  if (name in keyboard_event_on) {
    keyboard_event_on[name](vel/127);
  } else {
    synth.triggerAttack(name, "+0", vel/127);
  }
}

function note_up(note) {
  let name = midi2Note(note); 
  if (name in keyboard_event_off) {
    keyboard_event_off[name]();
  } else {
    synth.triggerRelease(name);
  }
}

// ------------------------------------------------
// ---            DRAW KEYBOARD                 ---
// ------------------------------------------------
let click_note = null;

// create white keys
for (let i = 0; i < keys_white; i++) {
  keyboard.append("div")
    .attr("class", "white key")
    .attr("id", notemap_white[i])
    .on("mousedown", () => {
      keyboard_event_on[notemap_white[i]]();
      click_note = notemap_white[i];
    })
    .append("div")
    .attr("class", "label")
    .text(keymap_white[i]);
}

// create black keys
{
  let offset = white_width - black_width / 2;
  for (let i = 0; i < keys_white - 1; i++) { // - 1 since we don't want to draw black keys for the last key
    //skip on 3rd and 7th key
    if (i % 7 === 2 || i % 7 === 6) {
      offset += white_width;
      continue;
    }
    //create div
    keyboard.append("div")
      .attr("class", "black key")
      .attr("id", notemap_black[i])
      .style("height", black_height + "px")
      .style("width", black_width + "px")
      .style("left", offset + "px")
      .on("mousedown", () => {
        keyboard_event_on[notemap_black[i]]();
        click_note = notemap_black[i];
      })
      .append("div")
      .attr("class", "label")
      .text(keymap_black[i]);

    //update offset
    offset += white_width;
  }
}

// ---------------------
// --- DRAW ANALYZER ---
// ---------------------

//
// draw chart
var HEIGHT = 60,
    WIDTH = 800;

// draw wave stuff
var svg_wave = d3.select('#waveform-root')
            .append('svg')
            .attr('height', HEIGHT)
            .attr('width', WIDTH);

// create scales
var x_wave = d3.scaleLinear()
            .domain([0, waveform.size-1])
            .range([0, WIDTH]);

var y_wave = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, HEIGHT]);

// create line generator 
var line_wave = d3.line()
                  .x(function(d,i) {return x_wave(i);})
                  .y(function(d) {return y_wave(d);});
                  
// add path directly to the svg and draw the data directly
svg_wave.append("path")
        .attr("d", line_wave(waveform.getValue()));

// update visualizations using requestAnimateFrame
function renderChart() {
  requestAnimationFrame(renderChart);

  // get wave data and update plot
  svg_wave.selectAll("path")
          .attr("d", line_wave(waveform.getValue()));

  //console.log(waveform.getValue())
}

// Begin animation
renderChart();

module.exports = {
  note_down: note_down,
  note_up: note_up
};
