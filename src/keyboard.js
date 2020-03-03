// Import Tone
import * as Tone from "tone";
const d3 = require('d3');

const keyboard = d3.select("#keyboard-root");

//TODO: Space sustain

// width and height of entire keyboard
const width = 800;
const height = 300;

// 1 Octave: 8 keys (C-C), 2 groups
const octaves = 2;                  // num of octaves
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
    'C6','D6','E6','F6','G6','A6','B6','C7','D7'
];

const notemap_black = [
    'Db4','Eb4','','Gb4','Ab4','Bb4','',
    'Db5','Eb5','','Gb5','Ab5','Bb5','',
    'Db6','Eb6','','Gb6','Ab6','Bb6','',
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
            cur_key.func_down();
            cur_key.down = true;
        }
    })
    .on("keyup", () => {
        let cur_key = key_map[d3.event.key];
        if (cur_key && cur_key.down) {
            cur_key.func_up();
            cur_key.down = false;
        }
    });

for (let i = 0; i < notemap_white.length; i++) {
    //set (piano) keyboard events
    keyboard_event_on[notemap_white[i]] = function() {
        synth.triggerAttack(notemap_white[i]);
        d3.select("#" + notemap_white[i]).attr("class", "white-down white key");
    };
    keyboard_event_off[notemap_white[i]] = function() {
        synth.triggerRelease();
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
    keyboard_event_on[notemap_black[i]] = function() {
        synth.triggerAttack(notemap_black[i]);
        d3.select("#" + notemap_black[i]).attr("class", "black-down black key");
    };
    keyboard_event_off[notemap_black[i]] = function() {
        synth.triggerRelease();
        d3.select("#" + notemap_black[i]).attr("class", "black key");
    };

    //set (computer) keyboard key mappings
    key_map[keymap_black[i]] = {
        down: false,
        func_down: keyboard_event_on[notemap_black[i]],
        func_up: keyboard_event_off[notemap_black[i]]
    };
}

// ------------------------------------------------
// ---            DRAW KEYBOARD                 ---
// ------------------------------------------------

// create white keys
for (let i = 0; i < keys_white; i++) {
    keyboard.append("div")
        .attr("class", "white key")
        .attr("id", notemap_white[i])
        .on("mousedown", keyboard_event_on[notemap_white[i]])
        .on("mouseup", keyboard_event_off[notemap_white[i]])
        .append("div")
            .attr("class", "label")
            .text(keymap_white[i]);
}

// create black keys
{
    let offset = white_width - black_width/2;
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
            .on("mousedown", keyboard_event_on[notemap_black[i]])
            .on("mouseup", keyboard_event_off[notemap_black[i]])
            .append("div")
                .attr("class", "label")
                .text(keymap_black[i]);

        //update offset
        offset += white_width;
    }
}