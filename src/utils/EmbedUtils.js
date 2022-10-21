import Embed from "flat-embed";

export const getNoteDetails = (embed) => {
  embed.onNoteDetails().then(function (measure) {
    console.log(measure);
  });
};
