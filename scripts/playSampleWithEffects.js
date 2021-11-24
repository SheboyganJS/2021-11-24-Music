import playSample from "./playSample.js";
import getContext from "./util/getContext.js";

export default async function playSampleWithEffects() {
  const [context] = getContext();

  const tuna = new Tuna(context);
  const overdrive = new tuna.Overdrive({
    outputGain: -9.154, //-42 to 0 in dB
    drive: 0.197, //0 to 1
    curveAmount: 0.979, //0 to 1
    algorithmIndex: 0, //0 to 5, selects one of the drive algorithms
    bypass: 0,
  });

  await playSample(overdrive);
}
