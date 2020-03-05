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

function getEnvelopeCurve(envl, callback) {
  const n = envl.attack + envl.decay + envl.release;
  const params = envl.get();

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

  getEnvelopeCurve(envl, function(points) {
    // Set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60};
    var width = 460 - margin.left - margin.right;
    var height = 150 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    var svg = d3.select("#envelope-viz")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // TODO: x limit should be updated dynamically
    var length = envl.attack + envl.decay + envl.release;
    var x = d3.scaleLinear().domain([0, points.length]).range([0, width]);
    var y = d3.scaleLinear().domain([1, 0]).range([0, height]);
    var line = d3.line()
	.x((d, i) => x(i))
	.y(d => y(d))

    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", line(points));
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