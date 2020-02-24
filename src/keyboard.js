// Import Tone
import * as Tone from "tone";
const d3 = require('d3');

const keyboard = d3.select("#keyboard-root");

// width and height of entire keyboard
const width = 600;
const height = 300;

// 1 Octave: 8 keys (C-C), 2 groups
const octaves = 1;                  // num of octaves
const keys_white = 7 * octaves + 1; // num of white keys

const black_ratio_w = .8;       // ratio of width of black keys to width of white keys
const black_ratio_h = .6;       // ratio of height of black keys to height of white keys
const black_height = black_ratio_h * height;

const white_width = width / keys_white;
const black_width = white_width * black_ratio_w;

const synth = new Tone.Synth().toMaster();

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
    'C4','D4','E4','F4','G4','A4','B4',
    'C5','D5','E5','F5','G5','A5','B5',
    'C6','D6','E6','F6','G6','A6','B6','C7'
];

const notemap_black = [
    'C#4','D#4','','F#4','G#4','A#4','',
    'C#5','D#5','','F#5','G#5','A#5','',
    'C#6','D#6','','F#6','G#6','A#6','',
];

// create white keys
for (let i = 0; i < keys_white; i++) {
    keyboard.append("div")
        .attr("class", "white key")
        .on("mousedown", () => {synth.triggerAttack(notemap_white[i])})
        .on("mouseup", () => {synth.triggerRelease()})
        .append("div")
            .attr("class", "label")
            .text(keymap_white[i]);
}

// create black keys
{
    let offset = white_width - black_width/2;
    for (let i = 0; i < keys_white - 1; i++) { // - 7 since we don't want to draw black keys for the last key
        //skip on 3rd and 7th key
        if (i % 7 === 2 || i % 7 === 6) {
            offset += white_width;
            continue;
        }
        //create div
        keyboard.append("div")
            .attr("class", "black key")
            .style("height", black_height + "px")
            .style("width", black_width + "px")
            .style("left", offset + "px")
            .on("mousedown", () => {synth.triggerAttack(notemap_black[i])})
            .on("mouseup", () => {synth.triggerRelease()})
            .append("div")
                .attr("class", "label")
                .text(keymap_black[i]);

        //update offset
        offset += white_width;
    }
}