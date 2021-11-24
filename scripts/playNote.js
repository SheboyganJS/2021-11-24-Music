export default function playNote() {
  const context = new AudioContext();

  const oscillator = context.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.frequency.value = 500;
  oscillator.detune.value = 0; // value in cents

  const gainNode = context.createGain();
  gainNode.gain.value = 0.02;

  // Connect oscillator to gain
  oscillator.connect(gainNode);
  // Then gain to the output
  gainNode.connect(context.destination);

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 1000);
}
