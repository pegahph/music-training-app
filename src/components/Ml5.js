import * as ml5 from "ml5";
import * as teoria from "teoria";
import { useEffect, useState, useRef } from "react";

const Ml5 = () => {
  const audioContext = new AudioContext();
  // const [micStream, setMicStream] = useState();
  let pitch;
  let stream;
  let stop = false;
  let classifier;
  

  // Label
  const [label, setLabel] = useState("listening...");
  // Teachable Machine model URL:
  let soundModel = "https://teachablemachine.withgoogle.com/models/1RWFTPMS2/";

  const scale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  let currentNote = "";
  const initializeMicStream = async (params) => {
    classifier = ml5.soundClassifier(soundModel + "model.json");
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    startPitch(stream, audioContext);
  };
  useEffect(() => {
    initializeMicStream();
  }, []);
  function freqToMidi(f) {
    const mathlog2 = Math.log(f / 440) / Math.log(2);
    const m = Math.round(12 * mathlog2) + 69;
    return m;
  }

  function startPitch(stream, audioContext) {
    classifier.classify(gotResult);
    pitch = ml5.pitchDetection(
      "/models/pitch-detection/crepe",
      audioContext,
      stream,
      modelLoaded
    );
  }
  function modelLoaded() {
    audioContext.resume().then(() => {
      console.log("Model Loaded!");
      getPitch()
    });
  }
  function gotResult(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    setLabel(results[0].label);
  }
  function getPitch() {
    console.log("from Ml5",audioContext);
    pitch.getPitch(function (err, frequency) {
      if (frequency) {
        const midiNum = freqToMidi(frequency);
        currentNote = scale[midiNum % 12];
        console.log(currentNote);
        let note = teoria.note.fromFrequency(frequency).note.coord;
        console.log("name", teoria.note(note).name());
        console.log("accidental", teoria.note(note).accidental());
        console.log("octave", teoria.note(note).octave());
        console.log(frequency);
      } else {
        // document.querySelector('#result').textContent = 'No pitch detected';
        // console.log("No pitch detected");
      }
      if (!stop) {
        getPitch();
      } else {
        return;
      }
    });
  }
  return <></>;
};

export default Ml5;
