const noteLetters = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export default function noteAndOctaveToMidiNumber({ note, octave }) {
  const keyNumber = noteLetters.indexOf(note);
  return keyNumber + octave * 12;
}
