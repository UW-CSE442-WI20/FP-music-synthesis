const keyboard = require("./keyboard.js")

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
  .then(midiSuccess);
} else {
  console.log("This browser does not support midi access");
}

function midiSuccess(access) {
  console.log("Loaded midi device", access);
  for (var input of access.inputs.values()) {
      input.onmidimessage = getMIDIMessage;
  }
}

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        keyboard.note_down(note, velocity);
      } else {
        keyboard.note_up(note);
      }
      break;
    case 128: // noteOff
      keyboard.note_up(note);
      break;
    // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}