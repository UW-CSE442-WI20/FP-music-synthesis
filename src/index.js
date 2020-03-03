import * as Tone from "tone";
const d3 = require('d3')

// Sidebar
var mini = true;

function toggleSidebar() {
  if (mini) {
    document.getElementById("mySidebar").style.width = "275px";
    mini = false;
  } else {
    document.getElementById("mySidebar").style.width = "85px";
    mini = true;
  }
}

// Pages
function openPage(pageName) {
  var i, tabcontent;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById(pageName + "-tab").style.display = "block";
}

function getEnvelopeCurve(t, callback) {
  const n = t.attack + t.decay + t.release;
  const params = t.get();

  // Simulate envelope to get curve data
  Tone.Offline(() => {
    const dummy = new Tone.Envelope;
    dummy.set(params);
    dummy.attack *= 1, dummy.decay *= 1, dummy.release *= 1;
    dummy.toMaster();
    dummy.triggerAttack(.001);
    dummy.triggerRelease(1 * (dummy.attack + dummy.decay + .01) + .001);
  }, 1 * (n + .01) + .002).then(function(d) {
    var points = d.toArray(0);
    callback(points);
  });
}

function initEnvelope() {
  var envl = new Tone.Envelope().toMaster();

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#envelope-viz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // TODO: x limit should be updated dynamically
  var length = envl.attack + envl.decay + envl.release;
  var xAxis = d3.scaleLinear().range([0, length]);
  var yAxis = d3.scaleLinear().range([0, 1]);
  var line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveLinear)

  getEnvelopeCurve(envl, function(points) {
    console.log(points);
  });
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

  openPage("home");

  // Horizontal Collapsible
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }

  // Envelope
  initEnvelope();
});
