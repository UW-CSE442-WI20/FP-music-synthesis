// GIVEN STUFF IN TEMPLATE
// // You can require libraries
// const d3 = require('d3')
//
// // You can include local JS files:
// const MyClass = require('./my-class');
// const myClassInstance = new MyClass();
// myClassInstance.sayHi();
//
//
// // You can load JSON files directly via require.
// // Note this does not add a network request, it adds
// // the data directly to your JavaScript bundle.
// const exampleData = require('./example-data.json');
//
//
// // Anything you put in the static folder will be available
// // over the network, e.g.
// d3.csv('carbon-emissions.csv')
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
//   })

// Sidebar
var mini = true;

function toggleSidebar() {
    if (mini) {
        console.log("opening sidebar");
        document.getElementById("mySidebar").style.width = "275px";
        this.mini = false;
    } else {
        console.log("closing sidebar");
        document.getElementById("mySidebar").style.width = "85px";
        this.mini = true;
    }
}

// Pages
function openPage(pageName) {
  console.log
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(pageName).style.display = "block";
}


async function getEnvelopeCurve(t) {
  const n = t.attack + t.decay + t.release;
  const params = t.get();

  // Simulate envelope to get curve data
  const points = await Tone.Offline(() => {
    const dummy = new Tone.Envelope;
    dummy.set(params);
    dummy.attack *= 1, dummy.decay *= 1, dummy.release *= 1;
    dummy.toMaster();
    dummy.triggerAttack(.001);
    dummy.triggerRelease(1 * (dummy.attack + dummy.decay + .01) + .001);
  }, 1 * (n + .01) + .002);

  return points.toArray(0);
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
  line = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.value))
    .curve(d3.curveLinear)

  getEnvelopeCurve(envl).then(function(d) {
    // TODO: Push these points to a plot
    console.log(points);
  });
}

$(document).ready(function() {
  document.getElementById("defaultOpen").click();

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
