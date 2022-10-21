import { useRef, useEffect, useState } from "react";
import Embed from "flat-embed";
import {MicSound} from "../utils/MicSound";
// import {getNoteDetails} from "./utils/EmbedUtils";


function Flat() {
  const container = useRef(null);
  const soundStream = new MicSound();
  let currentMeasureUuid = null;
  let embed;
  const initializedEmbed = () => {
    embed = new Embed(container.current, {
      score: "56ae21579a127715a02901a6",
      // height: "100%",
      embedParams: {
        appId: "59e7684b476cba39490801c2",
        controlsPosition: "top",
        branding: false,     
      },

    });
    embed.on("cursorPosition",getCursorPosition)
    // embed.on('noteDetails', getNoteDetails);
  }

  const getNoteDetails = (position) => {
    embed.getNoteDetails().then(function (measure) {
      let currentNote = measure.pitches[0]
      console.log(currentNote.step + currentNote.octave.toString());
      soundStream.setCurrentNote(currentNote.step + currentNote.octave.toString())
      if(soundStream.ready){
        soundStream.getPitch(currentMeasureUuid)
      }
    });
  };
  const getCursorPosition = () => {
    embed.getCursorPosition().then((position) => {
      currentMeasureUuid = position.measureUuid;    
      console.log(position);
      // position: {
      //     "partIdx": 0,
      //     "staffIdx": 1,
      //     "voiceIdxInStaff": 0,
      //     "measureIdx": 2,
      //     "noteIdx": 1
      // }
    });
  }
  useEffect(() => {
    initializedEmbed(); 
  }, []);

  return (
    <>
      <div id="embed-container" ref={container}></div>
    </>
  );
}

export default Flat;
