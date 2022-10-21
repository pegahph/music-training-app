import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";

const OptionsDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const optionBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    m: 2,
  };
  const imageStyle = {
    borderRadius: "0",
    height: "90px",
    width: "90px",
    mb: 2,
  };
  return (
    <Dialog open={open}>
      <DialogTitle align="center">
        Hi Welcome to Musician Trip! <br /> What do you want to do?
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="outlined" sx={optionBtnStyle} onClick={() => {onClose();navigate("/compose")}}>
            <Avatar src="/music_staff_compose_paper.webp" sx={imageStyle} />
            <Typography>Compose a music</Typography>
          </Button>
          <Button variant="outlined" sx={optionBtnStyle} onClick={() => {onClose();navigate("/rehearse")}}>
            <Avatar src="/rehearse.jpg" sx={imageStyle} />
            <Typography>Rehearse a song</Typography>
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OptionsDialog;
