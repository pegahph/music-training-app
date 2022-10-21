import * as ml5 from "ml5";
import * as teoria from "teoria";

export class MicSound {
  constructor(setIndex, stop, onNewNote) {
    this.audioContext = new AudioContext();
    this.soundModel =
      "https://teachablemachine.withgoogle.com/models/1RWFTPMS2/";
    this.classifier = ml5.soundClassifier(this.soundModel + "model.json");
    this.pitch = null;
    this.soundType = "noise";
    this.playedNote = null;
    this.currentNote = null;
    this.currentElement = null;
    this.setIndex = setIndex;
    this.onNewNote = onNewNote;
    this.currentPosition = 0;
    this.isLoading = true;
    this.stop = stop;
    console.log("constructor");
    this.initialize();
  }
  async initialize() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.resumeAudioContext();
  }
  resumeAudioContext() {
    this.audioContext.resume().then(() => {
      this.startListening();
    });
  }
  startListening() {
    this.classifier.classify(this.detectSoundType);
    if (this.stream) {
      this.pitch = ml5.pitchDetection(
        "/models/pitch-detection/crepe",
        this.audioContext,
        this.stream,
        this.modelLoaded
      );
    }
  }
  modelLoaded = () => {
    console.log("loaded!");
    this.isLoading = false;
    if (!this.stop) {
      this.startGetPitch();
    }
  };
  detectSoundType = (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    this.soundType = results[0].label;
  };
  freqToMidi(f) {
    const mathlog2 = Math.log(f / 440) / Math.log(2);
    const n = Math.round(12 * mathlog2) + 49;
    return n;
  }
  startGetPitch = () => {
    this.pitch.getPitch((err, frequency) => {
      if (frequency) {
        if (this.soundType === "Piano" || this.soundType === "Guitar") {
          let playedNote = teoria.note(
            teoria.note.fromFrequency(frequency).note.coord
          );
          this.playedNote = playedNote.scientific();
          // this.playedNote = playedNote.name() + playedNote.accidentals() + playedNote.octave();
          // console.log(this.playedNote);
          if (this.onNewNote) {
            this.playedNote = this.playedNote.slice(0, this.playedNote.length-1) + (parseInt(this.playedNote[this.playedNote.length -1]) -2)
            this.onNewNote(teoria.note.fromString(this.playedNote).helmholtz());
          } else if (this.currentNote && this.currentPosition) {
            this.checkNote();
          }
        }
      } else {
        // console.log("No pitch detected");
      }
      if (!this.stop) {
        if (this.currentElement) {
          this.startGetPitch();
        } else {
          setTimeout(() => {
            this.startGetPitch();
          }, 1000);
        }
      } else {
        console.log("stop getting pitch!");
        return;
      }
    });
  };
  checkNote = () => {
    console.log("current position", this.currentPosition);
    console.log("played note", this.playedNote);
    console.log("current note", this.currentNote);
    if (this.currentNote === this.playedNote) {
      this.currentPosition.style.fill = "green";
      // this.setIndex(this.currentPosition + 1);
      return true;
    } else {
      this.currentPosition.style.fill = "red";
      return false;
    }
  };
  setCurrentNote = (note) => {
    this.currentNote = note;
  };
  setCurrentElement = (element) => {
    this.currentElement = element;
  };
  setCurrentPosition = (position) => {
    this.currentPosition = position;
  };
  setNewPosition = (note, element, position) => {
    this.currentNote = note;
    this.currentElement = element;
    this.currentPosition = position;
    setTimeout(() => {
      this.startGetPitch();
    }, 3000);
  };
  stopListening = () => {
    this.stop = true;
  };
  resumeListening = () => {
    this.stop = false;
    this.startGetPitch();
  };
}
