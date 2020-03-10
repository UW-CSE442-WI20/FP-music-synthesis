import * as Tone from 'tone';
import * as d3 from 'd3';

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
function openPage(pageName) {
  d3.selectAll(".tabcontent").style("display", "none");
  d3.select("#" + pageName + "-tab").style("display", "block");
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
