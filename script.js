let ultData;
let currData;

let grossChart;

let bubbleChart;

let bullet1;
let bullet2;
let bullet3;
let bullet4;

let pieGraph;

let seasonGraphh;

// import { csv, sum } from 'd3';

function addDistributors() {
  daySelect = document.getElementById("selectStudio");
  daySelect.options[daySelect.options.length] = new Option("Text 1", "Value1");
}

function formatMoneyNum(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "M", "B", "T"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

function formatMoneyNum2(labelValue) {
  // Nine Zeroes for Billions
  const FIXED_NUM = 2;
  return Math.abs(Number(labelValue)).toFixed(FIXED_NUM) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(FIXED_NUM) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(FIXED_NUM) + "M"
    : // Three Zeroes for Thousands
    (Math.abs(Number(labelValue)) >= 1.0e3).toFixed(FIXED_NUM)
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(FIXED_NUM) + "K"
    : Math.abs(Number(labelValue)).toFixed(FIXED_NUM);
}

function clearContent(inputStudio) {
  document.getElementById("numberOfFilms").innerHTML = "";
  document.getElementById("gross").innerHTML = "";
  document.getElementById("totalGross").innerHTML = "";
  document.getElementById("maxTitle").innerHTML = "";
  document.getElementById("maxGross").innerHTML = "";
  document.getElementById("maxDate").innerHTML = "";
  document.getElementById("maxTheater").innerHTML = "";

  document.getElementById("maxTitle").innerHTML = "";
  document.getElementById("maxStudio").innerHTML = "";

  for (var i = 0, len = 9; i < len; i++) {
    document.getElementById(`movie${i + 1}`).innerHTML = "";
  }

  grossChart = Highcharts.chart("grossChart", {
    title: {
      text: "Box Office Gross of U.S. Films from " + inputStudio + " not found",
    },
  });

  Highcharts.chart("seasonGraph", {
    chart: {
      type: "column",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
  });

  bubbleChart = Highcharts.chart("bubbleChart", {
    chart: {
      type: "packedbubble",
      height: "100%",
    },
    title: {
      text:
        "Top 50 Grossing Films by Season from " + inputStudio + " not found",
    },
  });

  pieGraph = Highcharts.chart("pieGraph", {
    title: {
      text: "",
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
  });
}

function changeContent(inputStudio) {
  let gross = d3.sum(currData, (d) => d.gross);
  let totalGross = d3.sum(currData, (d) => d.total_gross);

  document.getElementById("numberOfFilms").innerHTML = currData.length;
  document.getElementById("gross").innerHTML = "$" + formatMoneyNum(gross);
  document.getElementById("totalGross").innerHTML =
    "$" + formatMoneyNum(totalGross);

  var maxFilm = currData[d3.maxIndex(currData, (d) => d.gross)];

  // var hm = d3.ascending(currData)

  console.log("this is maxfilm", maxFilm);
  // console.log(maxFilm)

  document.getElementById("maxTitle").innerHTML = maxFilm.title;
  document.getElementById("maxGross").innerHTML =
    "$" + maxFilm.gross.toFixed(0);
  // document.getElementById('maxTotalGross').innerHTML = maxFilm.total_gross
  document.getElementById("maxDate").innerHTML = maxFilm.date;
  document.getElementById("maxTheater").innerHTML = maxFilm.theaters;

  document.getElementById("maxTitle").innerHTML = maxFilm.title;
  document.getElementById("maxStudio").innerHTML = maxFilm.studio;

  // key:  AIzaSyBn4U6uShA0sEoV-RQkXzsOo050fCwg4UQ

  let mapYear = d3
    .rollups(
      currData,
      (v) => d3.sum(v, (d) => d.gross),
      (d) => d.year
    )
    .reverse();

  console.log("map year");
  console.log(mapYear);
  let arrayYears = [];
  let myArray = [];
  for (var i = 0, len = mapYear.length; i < len; i++) {
    myArray.push(mapYear[i][1]);
    arrayYears.push(mapYear[i][0]);
  }

  arrayYears.sort();
  console.log(arrayYears);

  grossChart = Highcharts.chart("grossChart", {
    title: {
      text: "Box Office Gross of U.S. Films from " + inputStudio,
    },

    subtitle: {
      //   text: ''
    },
    yAxis: {
      title: {
        text: "Gross (USD) ",
      },
      labels: {
        formatter: function () {
          return "$" + this.axis.defaultLabelFormatter.call(this);
        },
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: arrayYears,

      title: {
        text: "Year",
      },
    },

    tooltip: {
      pointFormatter: function () {
        var value;
        value = "$ " + this.y;

        return (
          '<span style="color:' +
          this.series.color +
          '">' +
          this.series.name +
          "</span>: <b>" +
          value +
          "</b><br />"
        );
      },
    },

    // legend: {
    //     layout: 'vertical',
    //     align: 'right',
    //     verticalAlign: 'middle'
    // },

    plotOptions: {
      series: {},
    },

    series: [
      {
        name: inputStudio,
        data: myArray,
        color: "#e23046",
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });

  var topData = currData
    .slice()
    .sort((a, b) => d3.descending(a.gross, b.gross))
    .slice(0, 50);

  let bubbleData = d3.groups(topData, (d) => d.season);

  let tempBubble = [];

  // console.log(bubbleData)

  for (var i = 0; i < bubbleData.length; i++) {
    hm = bubbleData[i][1];

    let storeBubble = {};

    storeBubble.name = bubbleData[i][0];

    const resultArray = hm.map((elm) => ({
      name: elm.title,
      value: elm.gross,
    }));

    storeBubble.data = resultArray;

    let season = bubbleData[i][0];

    if (season === "Fall") {
      storeBubble.color = "#f08a0e";
    } else if (season === "Summer") {
      storeBubble.color = "#064d69";
    } else if (season === "Spring") {
      storeBubble.color = "#edbed4";
    } else if (season === "Winter") {
      storeBubble.color = "#ccd7db";
    } else if (season === "Holiday Season") {
      storeBubble.color = "#e23046";
    }

    tempBubble.push(storeBubble);
  }

  tempBubble.push({
    name: "dummy series",
    data: [{ x: 6, y: 6, z: 6 }],
    showInLegend: false,
    color: "transparent",
    enableMouseTracking: false,
  });

  bubbleChart = Highcharts.chart("bubbleChart", {
    chart: {
      type: "packedbubble",
      height: "100%",
    },
    title: {
      text: "Top 50 Grossing Films by Season",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      pointFormat: "<b>{point.name}:   $</b> {point.value}",
    },
    plotOptions: {
      packedbubble: {
        minSize: "10%",
        maxSize: "80%",
        zMin: 0,
        zMax: 1000000000,
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: true,
          parentNodeLimit: true,
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          filter: {
            property: "y",
            operator: ">",
            value: 250,
          },
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "normal",
          },
        },
      },
    },
    series: tempBubble,
  });

  getBulletGraphs(currData);

  var topFilmsByGross = currData.sort((a, b) =>
    d3.descending(a.gross, b.gross)
  );

  var top10 = [
    topFilmsByGross[0],
    topFilmsByGross[1],
    topFilmsByGross[2],
    topFilmsByGross[3],
    topFilmsByGross[4],
    topFilmsByGross[5],
    topFilmsByGross[6],
    topFilmsByGross[7],
    topFilmsByGross[8],
    topFilmsByGross[9],
  ];

  for (var i = 0, len = 9; i < len; i++) {
    const title = top10[i]?.title;

    if (title) {
      document.getElementById(`movie${i + 1}`).innerHTML = i + 1 + ". " + title;
    }
  }

  console.log(top10);
}

function getSeasonGraph(currData, currentYear) {
  let previousYearData = currData.filter(function (d) {
    return d.year == currentYear - 1;
  });

  let recentYearData = currData.filter(function (d) {
    return d.year == currentYear;
  });

  let seasonData = d3.rollups(
    currData,
    (v) => v.length,
    (d) => d.season
  );
  var data = {};
  data[currentYear] = seasonData;

  let seasonPreviousData = d3.rollups(
    previousYearData,
    (v) => v.length,
    (d) => d.season
  );
  var dataHm = {};
  dataHm[currentYear - 1] = seasonPreviousData;

  var countries = [
    {
      name: "Spring",
      flag: "https://uxwing.com/wp-content/themes/uxwing/download/nature-and-environment/flower-plant-icon.svg",
      color: "#edbed4",
    },
    {
      name: "Summer",
      flag: "https://uxwing.com/wp-content/themes/uxwing/download/weather/sun-icon.png",
      color: "#064d69",
    },
    {
      name: "Fall",
      flag: "https://uxwing.com/wp-content/themes/uxwing/download/nature-and-environment/maple-leaf-icon.png",
      color: "#f08a0e",
    },
    {
      name: "Winter",
      flag: "https://uxwing.com/wp-content/themes/uxwing/download/weather/cooling-icon.svg",
      color: "#ccd7db",
    },
    {
      name: "Holiday Season",
      flag: "https://uxwing.com/wp-content/themes/uxwing/download/weather/christmas-snowman-icon.svg",
      color: "#e23046",
    },
  ];

  var countriess = {
    Spring: {
      name: "Spring",
      flag: "https://www.flaticon.com/svg/static/icons/svg/3171/3171070.svg",
      color: "#edbed4",
    },
    Summer: {
      name: "Summer",
      flag: "https://www.flaticon.com/svg/static/icons/svg/1086/1086426.svg",
      color: "#064d69",
    },
    Fall: {
      name: "Fall",
      flag: "https://www.flaticon.com/svg/static/icons/svg/3093/3093858.svg",
      color: "#f08a0e",
    },
    Winter: {
      name: "Winter",
      flag: "https://www.flaticon.com/svg/static/icons/svg/2942/2942988.svg",
      color: "#ccd7db",
    },
    "Holiday Season": {
      name: "Holiday Season",
      flag: "https://www.flaticon.com/svg/static/icons/svg/2113/2113467.svg",
      color: "#e23046",
    },
  };

  function getSeasonData(data) {
    return data.map(function (country, i) {
      let season = country[0];

      let content = countriess[season];

      console.log();
      console.log(content["flag"]);
      console.log();

      console.log(country[0]);
      console.log(country[1]);

      return {
        name: content["name"],
        y: country[1],
        color: content["color"],
      };
    });
  }

  seasonGraphh = Highcharts.chart("seasonGraph", {
    chart: {
      type: "column",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Films released Per Season",
    },
    plotOptions: {
      series: {
        grouping: false,
        borderWidth: 0,
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      headerFormat:
        '<span style="font-size: 15px">{point.point.name}</span><br/>',
      pointFormat: " <b>{point.y} films </b><br/>",
    },
    xAxis: {
      type: "category",
      max: 4,
      labels: {
        useHTML: true,
        animate: true,
        formatter: function () {
          var value = this.value,
            output;

          countries.forEach(function (country) {
            if (country.name === value) {
              output = country.flag;
            }
          });

          return (
            '<span><img src="' +
            output +
            '" style="width: 40px; height: 40px;"/><br></span>'
          );
        },
      },
    },
    yAxis: [
      {
        title: {
          text: "# of films",
        },
        showFirstLabel: false,
      },
    ],
    series: [
      {
        name: currentYear,
        id: "main",
        color: "#064d69",
        dataSorting: {
          enabled: true,
        },
        // dataSorting: {
        //     enabled: true,
        //     matchByName: true
        // },
        // dataLabels: [{
        //     enabled: true,
        //     inside: true,
        //     style: {
        //         fontSize: '16px'
        //     }
        // }],
        data: data[currentYear],
      },
    ],
    exporting: {
      allowHTML: true,
    },
  });

  let pieWinterData = currData.filter(function (d) {
    return d.season == "Winter";
  });
  let pieWinter = d3.sum(pieWinterData, (d) => d.gross);

  let pieFallData = currData.filter(function (d) {
    return d.season == "Fall";
  });
  let pieFall = d3.sum(pieFallData, (d) => d.gross);

  let pieSpringData = currData.filter(function (d) {
    return d.season == "Spring";
  });
  let pieSpring = d3.sum(pieSpringData, (d) => d.gross);

  let pieSummerData = currData.filter(function (d) {
    return d.season == "Summer";
  });
  let pieSummer = d3.sum(pieSummerData, (d) => d.gross);

  let pieHolidayData = currData.filter(function (d) {
    return d.season == "Holiday Seasons";
  });
  let pieHoliday = d3.sum(pieHolidayData, (d) => d.gross);

  // Build the chart
  let pieGraph = Highcharts.chart("pieGraph", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Gross by Season",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Season",
        colorByPoint: true,
        data: [
          {
            name: "Summer",
            y: pieSummer,
            color: "#064d69",

            sliced: true,
            selected: true,
          },
          {
            name: "Winter",
            y: pieWinter,
            color: "#ccd7db",
          },
          {
            name: "Fall",
            y: pieFall,
            color: "#f08a0e",
          },
          {
            name: "Spring",
            y: pieSpring,
            color: "#edbed4",
          },
          {
            name: "Holiday Season",
            y: pieHoliday,
            color: "#e23046",
          },
        ],
      },
    ],
  });
}

// if (season === 'Fall') {
//     storeBubble.color = '#f08a0e'
// }
// else if (season === 'Summer') {
//     storeBubble.color = '#064d69'
// }
// else if (season === 'Spring') {
//     storeBubble.color = '#edbed4'
// }
// else if (season === 'Winter') {
//     storeBubble.color = '#ccd7db'
// }
// else if (season === 'Holiday Season') {
//     storeBubble.color = '#e23046'
// }

function getArrayOfTickers(currData) {
  let mostRecentYear = d3.max(currData, (d) => d.year);
  let previousYearData = currData.filter(function (d) {
    return d.year == mostRecentYear - 1;
  });

  let recentYearData = currData.filter(function (d) {
    return d.year == mostRecentYear;
  });

  let dataTicker = d3.mean(recentYearData, (d) => d.gross);

  let goalTicker = d3.mean(previousYearData, (d) => d.gross);

  let firstTicker = goalTicker * 0.3;
  let secondTicker = goalTicker * 0.5 + goalTicker;

  console.log("firstTicker is " + firstTicker);
  console.log("secondTicker is " + secondTicker);
  console.log("goalTicker is " + goalTicker);
  console.log("actualTicker is " + dataTicker);
  return [firstTicker, secondTicker, dataTicker, goalTicker, mostRecentYear];
}

function getSumTickers(currData) {
  let mostRecentYear = d3.max(currData, (d) => d.year);
  let previousYearData = currData.filter(function (d) {
    return d.year == mostRecentYear - 1;
  });

  let recentYearData = currData.filter(function (d) {
    return d.year == mostRecentYear;
  });

  let dataTicker = d3.sum(recentYearData, (d) => d.gross);

  let goalTicker = d3.sum(previousYearData, (d) => d.gross);

  let firstTicker = goalTicker * 0.3;
  let secondTicker = goalTicker * 0.5 + goalTicker;

  console.log("firstTicker is " + firstTicker);
  console.log("secondTicker is " + secondTicker);
  console.log("goalTicker is " + goalTicker);
  console.log("actualTicker is " + dataTicker);
  return [firstTicker, secondTicker, dataTicker, goalTicker, mostRecentYear];
}

function getArrayOfTickersTotalGross(currData) {
  let mostRecentYear = d3.max(currData, (d) => d.year);
  let previousYearData = currData.filter(function (d) {
    return d.year == mostRecentYear - 1;
  });

  let recentYearData = currData.filter(function (d) {
    return d.year == mostRecentYear;
  });

  let dataTicker = d3.mean(recentYearData, (d) => d.total_gross);

  let goalTicker = d3.mean(previousYearData, (d) => d.total_gross);

  let firstTicker = goalTicker * 0.3;
  let secondTicker = goalTicker * 0.1 + goalTicker;

  // console.log("firstTicker is " + firstTicker )
  // console.log("secondTicker is " + secondTicker )
  // console.log("goalTicker is " + goalTicker )
  // console.log("actualTicker is " + dataTicker )
  return [firstTicker, secondTicker, dataTicker, goalTicker, mostRecentYear];
}

function getArrayOfTickersSumTotalGross(currData) {
  let mostRecentYear = d3.max(currData, (d) => d.year);
  let previousYearData = currData.filter(function (d) {
    return d.year == mostRecentYear - 1;
  });

  let recentYearData = currData.filter(function (d) {
    return d.year == mostRecentYear;
  });

  let dataTicker = d3.sum(recentYearData, (d) => d.total_gross);

  let goalTicker = d3.sum(previousYearData, (d) => d.total_gross);

  let firstTicker = goalTicker * 0.3;
  let secondTicker = goalTicker * 0.1 + goalTicker;

  // console.log("firstTicker is " + firstTicker )
  // console.log("secondTicker is " + secondTicker )
  // console.log("goalTicker is " + goalTicker )
  // console.log("actualTicker is " + dataTicker )
  return [firstTicker, secondTicker, dataTicker, goalTicker, mostRecentYear];
}

function getBulletGraphs(currData) {
  let grossTickers = getArrayOfTickers(currData);
  let totalGrossTickers = getArrayOfTickersTotalGross(currData);
  let sumTotalGrossTickers = getArrayOfTickersSumTotalGross(currData);
  let sumGrossTickers = getSumTickers(currData);

  let mostRecentYear = grossTickers[4];

  getSeasonGraph(currData, mostRecentYear);
}

function changeStudio(inputStudio) {
  console.log(inputStudio);
  if (inputStudio === "all distributors") {
    currData = ultData;
  } else {
    currData = ultData.filter(function (d) {
      return d["studio"] === inputStudio;
    });
  }

  console.log(currData);

  if (currData.length == 0) {
    alert(
      "Sorry, " +
        inputStudio +
        " is not a valid distributor, please search for another in the list."
    );

    clearContent(inputStudio);
  } else {
    let startDate = document.getElementById("startDate").innerHTML;
    let endDate = document.getElementById("endDate").innerHTML;

    checkData = currData.filter(function (d) {
      return d.date >= startDate;
    });
    checkData = checkData.filter(function (d) {
      return d.date <= endDate;
    });

    currData = checkData;

    if (currData.length == 0) {
      // alert("Sorry, " + inputStudio + " does not have data from " + dateStart + " to " + dateEnd + " Please choose a different range of dates")
      clearContent(inputStudio);
    } else {
      changeContent(inputStudio);
    }

    // :))))
  }
}

function changeLineChart(inputStudio) {}

document.addEventListener("DOMContentLoaded", function (event) {
  var dt_from = "1977/05/25";
  var dt_to = "2023/08/01";

  $(".slider-time").html(dt_from);
  $(".slider-time2").html(dt_to);
  var min_val = Date.parse(dt_from) / 1000;
  var max_val = Date.parse(dt_to) / 1000;

  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }
  function formatDT(__dt) {
    var year = __dt.getFullYear();
    var month = zeroPad(__dt.getMonth() + 1, 2);
    var date = zeroPad(__dt.getDate(), 2);
    return year + "-" + month + "-" + date + " ";
  }

  //svptodo
  function dateStartInputHandler(e) {
    console.log(e.target.value);

    $(".slider-time").html(e.target.value);

    // var dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
    // $(".slider-time2").html(formatDT(dt_cur_to));

    // let studio = document.getElementById("selectStudio").value;
    changeStudio(studio);
  }


  // :)
  $("#slider-range").slider({
    range: true,
    min: min_val,
    max: max_val,
    step: 10,
    values: [min_val, max_val],
    slide: function (e, ui) {
      var dt_cur_from = new Date(ui.values[0] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
      $(".slider-time").html(formatDT(dt_cur_from));

      var dt_cur_to = new Date(ui.values[1] * 1000); //.format("yyyy-mm-dd hh:ii:ss");
      $(".slider-time2").html(formatDT(dt_cur_to));

      let studio = document.getElementById("selectStudio").value;
      changeStudio(studio);
    },
  });
});

window.onload = function () {
  function studioListener() {
    let inputStudio = this.value;

    var list = document.getElementById("movieInput");

    list.value = "";

    changeStudio(inputStudio);
  }

  let eStudio = document.getElementById("selectStudio");
  eStudio.addEventListener("change", studioListener);

  function movieListener() {
    console.log("hm");

    var val = this.value;

    console.log("val is ", val);

    const inputStudio = ultData.filter(function (d) {
      return d.title == val;
    })[0];

    if (inputStudio) {
      changeStudio(inputStudio.studio);

      var list = document.getElementById("selectStudio");

      list.value = inputStudio.studio;
    } else {
      console.log("sad", inputStudio, val);
    }

    console.log("this is input studio, ", inputStudio);
    // changeStudio(inputStudio);
  }

  let eMovie = document.getElementById("movieInput");
  eMovie.addEventListener("change", movieListener);

  function startDateListener() {
    console.log("changing date ");

    let studio = document.getElementById("selectStudio").value;
    changeStudio(studio);
  }

  var sliderDiv = document.getElementById("slider-range");
  sliderDiv.addEventListener("change", startDateListener);

  d3.csv("./moviesData.csv").then((data) => {
    // to make sure max returns correct
    data.forEach(function (d) {
      d.date = d.date;
      d.total_gross = d.total_gross;
      d.gross = parseInt(d.gross);
    });

    const total = d3.sum(data, (d) => d.theaters);
    ultData = data;

    const films = d3.group(ultData, (d) => d.studio);

    //  const films = d3.rollup(ultData, v => v.length, d => d.studio)

    console.log("hey");
    console.log(films);

    var topFilmsByGross = ultData.sort((a, b) =>
      d3.descending(a.totalGross, b.totalGross)
    );

    var movieList = document.getElementById("selectMovi");

    console.log("movie list", movieList);
    ultData.forEach(function (item) {
      var option = document.createElement("option");
      option.label = item.studio;
      option.value = item.title;
      movieList.appendChild(option);
    });

    let studioOptions = [...new Set(topFilmsByGross.map((d) => d.studio))];

    var list = document.getElementById("selecStudio");
    var option = document.createElement("option");
    option.value = "all distributors";
    list.appendChild(option);
    studioOptions.forEach(function (item) {
      var option = document.createElement("option");
      option.value = item;
      list.appendChild(option);
    });

    console.log("studio added");

    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },

      colors: [
        "#058DC7",
        "#50B432",
        "#ED561B",
        "#DDDF00",
        "#24CBE5",
        "#64E572",
        "#FF9655",
        "#FFF263",
        "#6AF9C4",
      ],
    });

    // STEP 1: start off with everything 'ALL'
    changeStudio("all distributors");

    // o = d3.group(data, d => d.studio)
    // console.log(o)

    // d3.group().key(function (d) {
    //     return d.studio;
    // })
    //     .rollup(function (leaves) {
    //         return d3.sum(leaves, function (d) {
    //             return d.gross;
    //         });
    //     }).entries(data)
    //     .map(function (d) {
    //         o = { studio: d.key, gross: d.values };
    // console.log(o)
    //     });
  });
};
