import getContext from "./util/getContext.js";

const SOUND_FILE_URL =
  "assets/lo-fi-chill-hop-drum-beat-loop_80bpm_C_minor.wav";

let audioBuffer;

async function getSampleBufferSource(context) {
  if (!audioBuffer) {
    const response = await fetch(SOUND_FILE_URL);
    const buffer = await response.arrayBuffer();
    audioBuffer = await context.decodeAudioData(buffer);
  }

  const source = context.createBufferSource();
  source.buffer = audioBuffer;
  return source;
}

export default async function playSample(effectNode) {
  const [context, mainGainNode] = getContext();

  const sampleNode = await getSampleBufferSource(context);
  // sampleNode.loop = true;

  const gainNode = context.createGain();
  gainNode.gain.value = 1;

  if (effectNode) {
    sampleNode.connect(effectNode).connect(gainNode);
  } else {
    sampleNode.connect(gainNode);
  }

  gainNode.connect(mainGainNode);

  sampleNode.start();

  return gainNode;
}
