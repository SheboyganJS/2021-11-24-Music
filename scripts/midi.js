import connectAndStartNewOscillator from "./util/connectAndStartNewOscillator.js";
import getContext from "./util/getContext.js";

const midiState = {
  currentInput: null,
  inputs: [],
  isEnabled: false,
};

const NOTE_VOLUME = 0.5;

const oscillatorsByMidiNumber = new Map();

function playPiano(noteNumber, action) {
  const [context, mainGainNode] = getContext();

  let oscillator = oscillatorsByMidiNumber.get(noteNumber);
  if (!oscillator) {
    oscillator = connectAndStartNewOscillator(
      context,
      mainGainNode,
      noteNumber
    );
    oscillatorsByMidiNumber.set(noteNumber, oscillator);
  }

  if (action === "down") {
    oscillator.gainNode.gain.setValueAtTime(NOTE_VOLUME, context.currentTime);
  } else if (action === "up") {
    oscillator.gainNode.gain.setValueAtTime(0, context.currentTime);
  }
}

function midiInputMessageHandler(event) {
  const [cmd, noteNumber, velocity] = event.data;

  // 144 = NOTE ON on CHANNEL 1
  if (cmd === 144) {
    if (velocity > 0) {
      playPiano(noteNumber, "down");
    } else if (velocity === 0) {
      // NOTE ON with velocity 0 = NOTE OFF
      playPiano(noteNumber, "up");
    }
  } else if (cmd === 128) {
    // 128 = NOTE OFF on CHANNEL 1
  } else if (cmd === 176) {
    // Volume
  }
}

export async function activateMIDI(onStateChange) {
  if (typeof navigator.requestMIDIAccess !== "function") {
    return "Browser does not support MIDI";
  }

  const midiAccess = await navigator.requestMIDIAccess();

  const val = midiAccess.inputs.values();
  for (let input = val.next(); input.done !== true; input = val.next()) {
    midiState.inputs.push(input.value);
  }

  if (midiState.inputs.length > 0) {
    midiState.currentInput = midiState.inputs[0];
    midiState.currentInput.addEventListener(
      "midimessage",
      midiInputMessageHandler
    );
  }

  midiState.isEnabled = true;

  onStateChange(midiState);

  midiAccess.addEventListener("statechange", (event) => {
    // Ignore output ports
    if (event.port.type !== "input") return;

    const changedInput = event.port;

    if (changedInput.state === "disconnected") {
      // remove from list
      midiState.inputs = midiState.inputs.filter(
        (input) => input.id !== changedInput.id
      );

      // clear current if disconnected was the current
      if (
        midiState.currentInput != null &&
        midiState.currentInput.id === changedInput.id
      ) {
        midiState.currentInput.removeEventListener(
          "midimessage",
          midiInputMessageHandler
        );
        midiState.currentInput = null;
      }

      onStateChange(midiState);
    } else if (changedInput.state === "connected") {
      // remove from list temporarily
      midiState.inputs = midiState.inputs.filter(
        (input) => input.id !== changedInput.id
      );
      // then add back updated
      midiState.inputs.push(changedInput);

      // last connected will always be current
      if (midiState.currentInput != null) {
        midiState.currentInput.removeEventListener(
          "midimessage",
          midiInputMessageHandler
        );
      }
      midiState.currentInput = changedInput;
      midiState.currentInput.addEventListener(
        "midimessage",
        midiInputMessageHandler
      );

      onStateChange(midiState);
    }
  });
}
