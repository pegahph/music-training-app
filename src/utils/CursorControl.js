const getNote = (currentNote) => {
  let note;
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

function useCursorControl(soundStream) {
  var self = this;
  self.onStart = function () {
    if (soundStream) {
      soundStream.resumeListening();
    }

    var svg = document.querySelector("#paper svg");
    var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("class", "abcjs-cursor");
    cursor.setAttributeNS(null, "x1", 0);
    cursor.setAttributeNS(null, "y1", 0);
    cursor.setAttributeNS(null, "x2", 0);
    cursor.setAttributeNS(null, "y2", 0);
    svg.appendChild(cursor);
  };
  self.beatSubdivisions = 2;
  self.onEvent = function (ev) {
    if (ev.measureStart && ev.left === null) return; // this was the second part of a tie across a measure line. Just ignore it.

    var lastSelection = document.querySelectorAll(
      "#paper svg .abcjs-note_selected"
    );
    for (var k = 0; k < lastSelection.length; k++){
      lastSelection[k].classList.remove("abcjs-note_selected");
      if (!soundStream) {
        lastSelection[k].style.fill = "black";
      }
    }

    // var el = document.querySelector(".feedback").innerHTML = "<div class='label'>Current Note:</div>" + JSON.stringify(ev, null, 4);
    for (var i = 0; i < ev.elements.length; i++) {
      var note = ev.elements[i];
      let currentNote = note[0].firstChild.dataset.name;
      if (currentNote.includes("accidentals")) {
        currentNote = note[0].children[1].dataset.name;
      }
      soundStream && soundStream.setCurrentNote(getNote(currentNote));
      for (var j = 0; j < note.length; j++) {
        if (soundStream) {
          soundStream.setCurrentPosition(note[j]);
        }
        note[j].classList.add("abcjs-note_selected");
        note[j].style.fill = soundStream ? "red" : "blue";
      }
    }

    var cursor = document.querySelector("#paper svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", ev.left - 2);
      cursor.setAttribute("x2", ev.left - 2);
      cursor.setAttribute("y1", ev.top);
      cursor.setAttribute("y2", ev.top + ev.height);
    }
  };
  self.onFinished = function () {
    soundStream.stopListening();
    var els = document.querySelectorAll("svg .abcjs-note_selected");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove("abcjs-note_selected");
    }
    var cursor = document.querySelector("#paper svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", 0);
      cursor.setAttribute("x2", 0);
      cursor.setAttribute("y1", 0);
      cursor.setAttribute("y2", 0);
    }
  };
}

export default useCursorControl;
