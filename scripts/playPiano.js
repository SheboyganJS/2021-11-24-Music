import connectAndStartNewOscillator from "./util/connectAndStartNewOscillator.js";
import getContext from "./util/getContext.js";
import midiNumberToFrequency from "./util/midiNumberToFrequency.js";
import noteAndOctaveToMidiNumber from "./util/noteAndOctaveToMidiNumber.js";

const NOTE_VOLUME = 0.5;
const OCTAVE_OFFSET = 3;

const oscillatorsByMidiNumber = new Map();

export default function playPiano(details) {
  // details argument looks like this:
  // {action: 'down', note: 'C', octave: 2}
  details.octave = details.octave + OCTAVE_OFFSET; // otherwise starts at 0
  const noteNumber = noteAndOctaveToMidiNumber(details);

  const [context, mainGainNode] = getContext();

  let oscillator = oscillatorsByMidiNumber.get(noteNumber);
  if (!oscillator) {
    oscillator = connectAndStartNewOscillator(
      context,
      mainGainNode,
      noteNumber
    );
    oscillatorsByMidiNumber.set(noteNumber, oscillator);
  }

  if (details.action === "down") {
    oscillator.gainNode.gain.setValueAtTime(NOTE_VOLUME, context.currentTime);
  } else if (details.action === "up") {
    oscillator.gainNode.gain.setValueAtTime(0, context.currentTime);
  }
}
