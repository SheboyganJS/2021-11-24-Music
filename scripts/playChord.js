import midiNumberToFrequency from "./util/midiNumberToFrequency.js";

function getOscillator(context, midiNumber) {
  const oscillator = context.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.frequency.value = midiNumberToFrequency(midiNumber);
  oscillator.detune.value = 0; // value in cents
  return oscillator;
}

export default function playChord() {
  const context = new AudioContext();

  // Create one oscillator per note
  const oscillatorC = getOscillator(context, 60);
  const oscillatorE = getOscillator(context, 64);
  const oscillatorG = getOscillator(context, 67);

  const gainNode = context.createGain();
  gainNode.gain.value = 0.02;

  // Connect oscillators to gain
  oscillatorC.connect(gainNode);
  oscillatorE.connect(gainNode);
  oscillatorG.connect(gainNode);

  // Then gain to the output
  gainNode.connect(context.destination);

  oscillatorC.start();
  oscillatorE.start();
  oscillatorG.start();
  setTimeout(() => {
    oscillatorC.stop();
    oscillatorE.stop();
    oscillatorG.stop();
  }, 1000);
}
