import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { MicSound } from "../utils/MicSound";
import abcNotes from "../notes/abcNotes";
import useCursorControl from "../utils/CursorControl";

let soundStream;
const MusicNote = () => {
  const [index, setIndex] = useState(0);
  const initializeSoundStream = () => {
    soundStream = new MicSound(setIndex);
  };
  const initialLivePlay = (visualObj) => {
    const cursorControl = new useCursorControl("#paper");
    if (abcjs.synth.supportsAudio()) {
      let controlOptions = {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      };
      const synthControl = new abcjs.synth.SynthController();
      synthControl.load("#audio", cursorControl, controlOptions);
      synthControl.disable(true);
      const midiBuffer = new abcjs.synth.CreateSynth();
      midiBuffer
        .init({
          visualObj: visualObj[0],
          millisecondsPerMeasure: 500,
          options: {},
        })
        .then(function () {
          synthControl.setTune(visualObj[0], true).then(function (response) {
            document
              .querySelector(".abcjs-inline-audio")
              .classList.remove("disabled");
          });
        });
    } else {
      console.log("audio is not supported on this browser");
    }
  };
  useEffect(() => {
    initializeSoundStream();
    const visualObj = abcjs.renderAbc("paper", abcNotes.test, {
      selectionColor: "blue",
      responsive: "resize",
    });
    console.log(visualObj);
    initialLivePlay(visualObj);

    noteStepper();
  }, []);

  useEffect(() => {
    if (index < document.querySelectorAll(`[data-name="note"]`).length) {
      noteStepper();
    }
  }, [index]);

  const getNote = () => {
    let note;
    const noteElement = document.querySelectorAll(`[data-name="note"]`)[index];
    let currentNote = noteElement.firstChild.dataset.name;
    if (currentNote.includes("accidentals")) {
      currentNote = noteElement.children[1].dataset.name;
    }
    const sharp = currentNote.split("^");
    const flat = currentNote.split("_");
    const natural = currentNote.split("=");
    if (natural.length > 1) {
      currentNote = natural[natural.length - 1];
    } else if (flat.length > 1) {
      currentNote = flat[flat.length - 1];
      for (let i = 0; i < flat.length - 1; i++) {
        currentNote += "b";
      }
    } else if (sharp.length > 1) {
      currentNote = sharp[sharp.length - 1];
      for (let i = 0; i < sharp.length - 1; i++) {
        currentNote += "#";
      }
    }
    const down = currentNote.split(",");
    const up = currentNote.split("'");
    if (down.length > 1) {
      for (let i = 0; i < down.length; i++) {
        if (i === 0) {
          note = down[i];
        } else {
          note += down[i];
        }
      }
      if (down[0] === down[0].toUpperCase()) {
        note = note + (4 - (down.length - 1)).toString();
      } else {
        note = note + (5 - (down.length - 1)).toString();
      }
    } else if (up.length > 1) {
      for (let i = 0; i < up.length; i++) {
        if (i === 0) {
          note = up[i];
        } else {
          note += up[i];
        }
      }
      if (up[0] === up[0].toUpperCase()) {
        note = note + (4 + (up.length - 1)).toString();
      } else {
        note = note + (5 + (up.length - 1)).toString();
      }
    } else {
      if (currentNote.length > 1) {
        if (currentNote[0] === currentNote[0].toUpperCase()) {
          note = currentNote + "4";
        } else {
          note = currentNote + "5";
        }
      } else {
        if (currentNote === currentNote.toUpperCase()) {
          note = currentNote + "4";
        } else {
          note = currentNote + "5";
        }
      }
    }
    return note;
  };

  const noteStepper = () => {
    const noteElement = document.querySelectorAll(`[data-name="note"]`)[index];
    const note = getNote();
    soundStream.setNewPosition(note,noteElement,index)
    noteElement.classList.add("abcjs-note_selected");
    noteElement.style.fill = "blue";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div id="paper"></div>
      <div id="audio"></div>
    </Box>
  );
};

export default MusicNote;
