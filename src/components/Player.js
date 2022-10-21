import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import abcjs from "abcjs";
import { useEffect, useState } from "react";
import Instruments from "../enum/Instuments";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import useCursorControl from "../utils/CursorControl";
import { MicSound } from "../utils/MicSound";

let cursorControl;
let synthControl;
let soundStream;
const Player = ({ visualObj, autoStart, type }) => {
  const [instrument, setInstrument] = useState(0);
  const [playing, setPlaying] = useState(false);
  const initializedMidi = (params) => {
    var midi = new abcjs.synth.CreateSynth();
    midi
      .init({
        visualObj: visualObj,
      })
      .then(function (response) {
        if (synthControl) {
          synthControl
            .setTune(visualObj, false, {
              program: instrument,
              chordsOff: false,
            })
            .then(function (response) {
              console.log("Audio successfully loaded.");
            })
            .catch(function (error) {
              console.warn("Audio problem:", error);
            });
        }
      })
      .catch(function (error) {
        console.warn("Audio problem:", error);
      });
  };
  useEffect(() => {
    if (Object.keys(visualObj).length > 0) {
      if (abcjs.synth.supportsAudio()) {
        if(type === "rehearse"){
          soundStream = new MicSound(null, true);
        }
        cursorControl = new useCursorControl(soundStream);
        synthControl = new abcjs.synth.SynthController();
        synthControl.load("#audio", cursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: true,
          displayWarp: true,
        });
      }
      initializedMidi();
    }
  }, [visualObj, instrument]);

  function start() {
    setPlaying(true);
    if (synthControl) {synthControl.play();}
  }
  function pause() {
    setPlaying(false);
    if(soundStream) {
      soundStream.stopListening();
    }
    if (synthControl) synthControl.pause();
  }
  useEffect(() => {
    if (autoStart) {
      setTimeout(start, 3000);
    } else {
      pause();
    }
  }, [autoStart]);
  return (
    <Stack direction="row" spacing={2} alignItems="center" width={1}>
      <FormControl size="small">
        <Select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          {Object.keys(Instruments).map((key) => (
            <MenuItem key={key} value={key}>
              {Instruments[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box id="audio" sx={{ flex: "1" }}></Box>
    </Stack>
  );
};

export default Player;
