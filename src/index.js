// GIVEN STUFF IN TEMPLATE
// // You can require libraries
const d3 = require('d3')
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

var sidebar = d3.select("#mySidebar");
sidebar
  .on("mouseenter", toggleSidebar)
  .on("mouseleave", toggleSidebar);

function toggleSidebar() {
  if (mini) {
    document.getElementById("mySidebar").style.width = "275px";
    mini = false;
  } else {
    document.getElementById("mySidebar").style.width = "85px";
    mini = true;
  }
}

var links = d3.selectAll(".tablink");
links.on("click", function () {
  openPage(this.id);
});

// Pages
function openPage(pageName) {
  var i, tabcontent;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById(pageName + "-tab").style.display = "block";
}
openPage("home");

// Horizontal Collapsible
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
