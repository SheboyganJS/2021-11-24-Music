// Song file generated by https://github.com/colxi/midi-parser-js
// Original MIDI file from https://themushroomkingdom.net/media/smb/mid
import getContext from "./util/getContext.js";
import song from "../assets/song.json" assert { type: "json" };
import midiNumberToFrequency from "./util/midiNumberToFrequency.js";

const MASTER_VOLUME = 0.1;
const NOTE_VOLUME = 0.1;
const OSCILLATOR_TYPE = "square";

const oscillatorsByMidiNumber = new Map();

export default function playSong() {
  const [context, mainGainNode] = getContext();

  for (const track of song.track) {
    let offsetTime = 0;
    let secondsPerQuarterNote = 1;
    let metronome = 24;
    for (const event of track.event) {
      // deltaTime is in relation to the tempo and time signature, so we need to do a little math
      offsetTime = offsetTime + (event.deltaTime / 96) * secondsPerQuarterNote;

      if (event.type === 255) {
        if (event.metaType === 88) {
          // Time Signature
          metronome = event.data[2];
        } else if (event.metaType === 81) {
          // Tempo in microseconds per quarter note
          secondsPerQuarterNote = event.data / 1000000;
        }
      } else if (event.type === 9) {
        // NOTE ON
        const [noteNumber] = event.data;

        let oscillator = oscillatorsByMidiNumber.get(noteNumber);
        if (!oscillator) {
          oscillator = context.createOscillator();
          oscillator.type = OSCILLATOR_TYPE;
          oscillatorsByMidiNumber.set(noteNumber, oscillator);

          oscillator.gainNode = context.createGain();
          oscillator.gainNode.gain.value = 0;

          oscillator.connect(oscillator.gainNode).connect(mainGainNode);
          oscillator.start();
        }

        oscillator.frequency.setValueAtTime(
          midiNumberToFrequency(noteNumber),
          context.currentTime + offsetTime
        );

        oscillator.gainNode.gain.setValueAtTime(
          NOTE_VOLUME,
          context.currentTime + offsetTime
        );
      } else if (event.type === 8) {
        // NOTE OFF
        const [noteNumber] = event.data;
        const oscillator = oscillatorsByMidiNumber.get(noteNumber);
        if (oscillator) {
          oscillator.gainNode.gain.setValueAtTime(
            0,
            context.currentTime + offsetTime
          );
        }
      }
    }
  }
}
