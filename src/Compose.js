import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import Wrapper from "./components/Wrapper";
import TimeSignatures from "./enum/TimeSignutures";
import abcjs from "abcjs";
import { MicSound } from "./utils/MicSound";
import { useEffect } from "react";
import Player from "./components/Player";
import abcNotes , {setAbcNotes} from "./notes/abcNotes";

let stream;
let noteString = "";
let noteValue = 0;
const Compose = ({onSave}) => {
  const [headers, setHeaders] = useState({
    X: 1,
    T: "",
    M: "",
    L: "",
    Q: "",
    K: "",
  });
  const [listening, setListening] = useState(false);
  const [created, setCreated] = useState(false);
  const [abcString, setAbcString] = useState("");
  const [visualObj, setVisualObj] = useState({});
  const [selectedSong, setSelectedSong] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const onChangeHandler = (prop) => (event) => {
    setHeaders({
      ...headers,
      [prop]: event.target.value,
    });
  };
  useEffect(() => {
    if (created || selectedSong) {
      stream = new MicSound(null, true, onNewNote);
    }
  }, [created, selectedSong]);
  useEffect(() => {
    const EditorObj = new abcjs.Editor("abc", {
      canvas_id: "paper",
      abcjsParams: { selectionColor: "blue", responsive: "resize" },
    });
    setVisualObj(EditorObj.tunes[0]);
  }, [abcString]);
  const onCreate = (params) => {
    let abc = "";
    Object.keys(headers).forEach((key) => {
      abc += `${key}:${headers[key]}\n`;
    });
    abc += "x";
    // noteString = abc;
    setAbcString(abc);
    setCreated(true);
    setCreateNew(false)
  };
  const onListening = () => {
    if (!listening) {
      stream.resumeListening();
    } else {
      stream.stopListening();
    }
    setListening(!listening);
  };

  const onNewNote = (note) => {
    const TimeSignature = headers.M.split("/");
    const beatsPerMeasure = parseInt(TimeSignature[0]);
    noteValue += 0.5;
    noteString += note;
    if (noteValue >= beatsPerMeasure) {
      noteString += "|";
      noteValue = 0;
    }
    setAbcString(abcString + noteString);
  };


  useEffect(() => {
    const save = () => {
      setAbcNotes({
        [selectedSong]: abcString
      })
    }
    onSave(save);
  }, [abcString,selectedSong])
  return (
    <Wrapper>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <FormControl sx={{ width: "270px" }} size="small">
          <InputLabel>Select an existing song to edit</InputLabel>
          <Select
            label="Select an existing song to edit"
            value={selectedSong}
            onChange={(e) => {
              setAbcString(abcNotes[e.target.value])
              setSelectedSong(e.target.value);
            }}
          >
            {Object.keys(abcNotes).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider orientation="vertical" flexItem />
        <Typography
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => {setSelectedSong("");setCreateNew(true);}}
        >
          Create a new?
        </Typography>
      </Stack>
      {createNew && (
        <Stack
          direction="row"
          width={1}
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ flexWrap: "wrap", mb: 2 }}
        >
          <TextField
            placeholder="Title"
            label="Title"
            size="small"
            onChange={onChangeHandler("T")}
            value={headers.T}
            sx={{ backgroundColor: "white", my: 1 }}
            // helperText="*optional"
          />
          <FormControl
            sx={{ width: "150px", backgroundColor: "white", my: 1 }}
            size="small"
          >
            <InputLabel>Time signature</InputLabel>
            <Select
              label="Time signature"
              size="small"
              value={headers.M}
              onChange={onChangeHandler("M")}
            >
              {TimeSignatures.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            placeholder="example: 1/8"
            label="The unit note length"
            size="small"
            sx={{ width: "180px", backgroundColor: "white", my: 1 }}
            onChange={onChangeHandler("L")}
            value={headers.L}
          />
          <TextField
            sx={{ width: "90px", backgroundColor: "white", my: 1 }}
            label="Tempo"
            size="small"
            onChange={onChangeHandler("Q")}
            value={headers.Q}
          />
          <TextField
            sx={{ width: "150px", backgroundColor: "white", my: 1 }}
            label="Key signature"
            size="small"
            onChange={onChangeHandler("K")}
            value={headers.K}
          />
          <Button variant="contained" sx={{ my: 1 }} onClick={onCreate}>
            Create
          </Button>
        </Stack>
      )}

      <Stack direction="row" spacing={2}>
        <Button variant="contained" sx={{width: "200px"}} disabled={selectedSong ? false : !created} onClick={onListening}>
          {listening ? "Stop listening" : "Start listening"}
        </Button>
        {!selectedSong || !abcString ? null :
        <Player visualObj={visualObj} /> }
      </Stack>

      <Grid container spacing={2} >
        <Grid item xs={4}>
          <TextField
            id="abc"
            fullWidth
            multiline
            minRows="20"
            sx={{ my: 2 }}
            value={abcString}
            onChange={(e) => setAbcString(e.target.value)}
            spellCheck="false"
          />
        </Grid>
        <Grid item xs={8} sx={{height: "calc(100vh - 216px)", overflow: "auto"}}>
          <div id="paper"></div>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Compose;
