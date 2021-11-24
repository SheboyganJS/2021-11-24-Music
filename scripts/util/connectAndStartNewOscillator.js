import midiNumberToFrequency from "./midiNumberToFrequency.js";

export default function connectAndStartNewOscillator(
  context,
  mainGainNode,
  noteNumber
) {
  const oscillator = context.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value = midiNumberToFrequency(noteNumber);

  oscillator.gainNode = context.createGain();
  oscillator.gainNode.gain.value = 0;

  oscillator.connect(oscillator.gainNode).connect(mainGainNode);
  oscillator.start();

  return oscillator;
}
