const d3 = require("d3");

const keyboard = require("./keyboard.js");
const envelope = require("./envelope.js");
const midik = require("./midi.js");
const pitch = require("./pitch.js");

// Sidebar
var mini = true;

function toggleSidebar() {
  if (mini) {
    d3.select("#mySidebar").style("width", "275px");
    mini = false;
  } else {
    d3.select("#mySidebar").style("width", "85px");
    mini = true;
  }
}

// Pages
var haveKeyboard = [
  "home",
  "oscillators",
  "envelopes",
  "filters"
]
function openPage(pageName) {
  d3.selectAll(".tabcontent").style("display", "none");
  d3.select("#" + pageName + "-tab").style("display", "block");
  if (haveKeyboard.includes(pageName))
    d3.select("#keyboard-container").style("display", "block");
  else
    d3.select("#keyboard-container").style("display", "none");
}

document.addEventListener("DOMContentLoaded", function() {
  var sidebar = d3.select("#mySidebar");
  sidebar
    .on("mouseenter", toggleSidebar)
    .on("mouseleave", toggleSidebar);

  var links = d3.selectAll(".tablink");
  links.on("click", function() {
    openPage(this.id);
  });

  // get url and open the relevant page if possible
  let path = window.location.href;
  let page = path.substring(path.lastIndexOf("#") + 1);
  openPage(page);

  // Horizontal Collapsible
  d3.selectAll(".accordion")
    .on("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
});
