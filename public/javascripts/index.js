var typing = new Typed(".text", {
  strings: ["", "INNOVATE", "BUILD", "EXECUTE", " EXCEED"],
  typeSpeed: 100,
  backSpeed: 40,
  loop: true,
});

var navi = document.querySelector("#hui");
navi.addEventListener("click", function () {
  console.log("hjuihuihuh");
  window.open("/logout", "_self");
});

am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  {
    User: "Present",
    days: 25,
  },
  {
    User: "Absent",
    days: 5,
  },
];

chart.innerRadius = am4core.percent(40);
chart.depth = 120;

chart.legend = new am4charts.Legend();

var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "days";
series.dataFields.depthValue = "days";
series.dataFields.category = "User";
series.slices.template.cornerRadius = 5;
series.colors.step = 3;


// Add JavaScript to redirect mobile and tablet users to a different page
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  window.location.href = "/mobile-page"; 
}


const currentDateElement = document.getElementById('currentDate');

// Get the current date and format it
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);

currentDateElement.innerText = formattedDate;