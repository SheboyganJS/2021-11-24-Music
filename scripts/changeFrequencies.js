import midiNumberToFrequency from "./util/midiNumberToFrequency.js";

function getOscillator(context, midiNumber) {
  const oscillator = context.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.frequency.value = midiNumberToFrequency(midiNumber);
  oscillator.detune.value = 0; // value in cents
  return oscillator;
}

export default function changeFrequencies() {
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

  oscillatorC.start(context.currentTime);
  oscillatorE.start(context.currentTime);
  oscillatorG.start(context.currentTime);

  // Change chord 2 seconds after starting
  oscillatorC.frequency.setValueAtTime(
    midiNumberToFrequency(67),
    context.currentTime + 2
  );
  oscillatorE.frequency.setValueAtTime(
    midiNumberToFrequency(71),
    context.currentTime + 2
  );
  oscillatorG.frequency.setValueAtTime(
    midiNumberToFrequency(74),
    context.currentTime + 2
  );

  setTimeout(() => {
    oscillatorC.stop();
    oscillatorE.stop();
    oscillatorG.stop();
  }, 4000);
}
