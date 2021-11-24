const MASTER_VOLUME = 0.1;

let context;
let mainGainNode;
export default function getContext() {
  if (!context) {
    context = new AudioContext();
    mainGainNode = context.createGain();
    mainGainNode.gain.value = MASTER_VOLUME;
    mainGainNode.connect(context.destination);
  }
  return [context, mainGainNode];
}
