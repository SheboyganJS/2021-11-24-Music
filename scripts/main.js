import changeFrequencies from "./changeFrequencies.js";
import playChord from "./playChord.js";
import playNote from "./playNote.js";
import playNoteByMidiNumber from "./playNoteByMidiNumber.js";
import playSong from "./playSong.js";
import playPiano from "./playPiano.js";
import playSample from "./playSample.js";
import playSampleWithEffects from "./playSampleWithEffects.js";
import { activateMIDI } from "./midi.js";

document.getElementById("btn1").addEventListener("click", playNote);
document.getElementById("btn2").addEventListener("click", playNoteByMidiNumber);
document.getElementById("btn3").addEventListener("click", playChord);
document.getElementById("btn4").addEventListener("click", changeFrequencies);
document.getElementById("btn5").addEventListener("click", () => playSample());
document
  .getElementById("btn6")
  .addEventListener("click", playSampleWithEffects);
document.getElementById("btnSong").addEventListener("click", playSong);
document
  .getElementById("interactive-piano")
  .addEventListener("note-down", (event) =>
    playPiano({ action: "down", ...event.detail })
  );
document
  .getElementById("interactive-piano")
  .addEventListener("note-up", (event) =>
    playPiano({ action: "up", ...event.detail })
  );

const midiInputCount = document.getElementById("midiInputCount");
const midiInputName = document.getElementById("midiInputName");
activateMIDI((state) => {
  midiInputCount.innerHTML = state.inputs.length;
  midiInputName.innerHTML = state.currentInput
    ? state.currentInput.name
    : "None";
}).catch((error) => {
  console.error(error);
});
