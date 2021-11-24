export default function midiNumberToFrequency(midiNumber) {
  return 440 * Math.pow(2, (midiNumber - 57) / 12);
}
