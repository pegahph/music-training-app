import {
  Backdrop,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import MusicNote from "./components/MusicNote";
import Player from "./components/Player";
import Wrapper from "./components/Wrapper";
import abcNotes from "./notes/abcNotes";
import abcjs from "abcjs";

const Rehearse = () => {
  const [selectedSong, setSelectedSong] = useState("");
  const [visualObj, setVisualObj] = useState({});
  const [playing, setPlaying] = useState(false);
  const [counter, setCounter] = useState(1);
  useEffect(() => {
    if (selectedSong !== "") {
      let obj = abcjs.renderAbc("paper", abcNotes[selectedSong], {
        selectionColor: "blue",
        responsive: "resize",
      });
      setVisualObj(obj[0]);
      setPlaying(false)
    }
  }, [selectedSong]);

  useEffect(() => {
    if(playing){
      let cnt = 1;
      let myInterval = setInterval(() => {
        cnt +=1
        setCounter(cnt);
        if (cnt > 3) {
          clearInterval(myInterval);
        }
      }, 1000);
    }
  }, [playing])

  return (
    <Wrapper>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ width: "200px" }} size="small">
          <InputLabel>Select a song</InputLabel>
          <Select
            label="Select a song"
            value={selectedSong}
            onChange={(e) => setSelectedSong(e.target.value)}
          >
            {Object.keys(abcNotes).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Player visualObj={visualObj} autoStart={playing} type="rehearse"/>
        <Button
          variant="contained"
          disabled={!selectedSong}
          onClick={() => {
            setPlaying(!playing);
            if(!playing){
              setCounter(1)
            }
          }}
        >
          {!playing ? "Start" : "pause"}
        </Button>
      </Stack>
      <div id="paper"></div>
      {counter < 4 && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={playing}
        >
          <Typography variant="h1" color="white">
            {counter}
          </Typography>
        </Backdrop>
      )}

      {/* <MusicNote/> */}
    </Wrapper>
  );
};

export default Rehearse;
