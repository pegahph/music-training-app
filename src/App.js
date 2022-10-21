import "./App.css";
import { useRef, useEffect, useState } from "react";
import Flat from "./components/Flat";
import MusicNote from "./components/MusicNote";
import OptionsDialog from "./components/options/OptionDialog";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import Rehearse from "./Rehearse";
import Compose from "./Compose";
import MenuIcon from "@mui/icons-material/Menu";

function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [saveFunc, setSaveFunc] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.pathname === "/") {
      setOpenDialog(true);
    }
  }, []);

  const save = () => {
    saveFunc();
  };
  return (
      <Box
        sx={{
          backgroundImage: "url('/bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100%",
          height: "100%",
        }}
      >
        <AppBar position="static">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {window.location.pathname.split('/')[1].toUpperCase()}
          </Typography> */}
            <FormControl>
              <Select
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "1.4rem",
                  ".MuiOutlinedInput-notchedOutline": { display: "none" },
                }}
                value={window.location.pathname.split("/")[1].toLowerCase()}
                onChange={(e) => navigate(`/${e.target.value}`)}
              >
                <MenuItem value="rehearse">REHEARSE</MenuItem>
                <MenuItem value="compose">COMPOSE</MenuItem>
              </Select>
            </FormControl>
            {window.location.pathname.split("/")[1].toLowerCase() ===
              "compose" && (
              <>
                <Button variant="contained" color="secondary" onClick={save}>
                  Save
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        {/* <Flat/> */}
        <OptionsDialog open={openDialog} onClose={() => setOpenDialog(false)} />
        <Routes>
          <Route path="rehearse" element={<Rehearse />} />
          <Route
            path="compose"
            element={
              <Compose
                onSave={(f) => {
                  setSaveFunc(f);
                  console.log(f);
                }}
              />
            }
          />
        </Routes>
        {/* <MusicNote/> */}
      </Box>
  );
}

export default App;
