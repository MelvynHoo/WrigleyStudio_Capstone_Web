import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase, ref, get, query, child, set, onValue, orderByChild, limitToLast, update} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWPBqmkD1lnl2wJBQoFaatqMGnYchyuWA",
  authDomain: "cp-wrigleystudio.firebaseapp.com",
  databaseURL: "https://cp-wrigleystudio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cp-wrigleystudio",
  storageBucket: "cp-wrigleystudio.appspot.com",
  messagingSenderId: "1065509125979",
  appId: "1:1065509125979:web:38ceea7070a601add4a47e"
};

// Set new default font family and font color to mimic Bootstrap's default styling (Comes from the BootStrap template)
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

//Working with Auth
const auth = getAuth();
const user = auth.CurrentUser;
const leaderBoards = ref(db, "leaderBoards");
const players = ref(db,"players");
const playerStats = ref(db,"playerStats");
const gameLevels = ref(db, "gameLevels");
const gameCompletion = ref(db, "gameCompletion");

//Retrieve from login
var myData = sessionStorage.getItem('UUID');
console.log("MY UUID for Line Chart:  " + myData);

//Number format from the bootstrap template for the graph
function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// RefreshData that allow the data to be refresh every 20 seconds to a new data from the firebase.
function refreshData(){
    // do whatever you like here
    //console.log("execute refresh data, wait 7 seconds");
    UpdateTimeChart();
    setTimeout(updateNotificationFunc, 18000);
    setTimeout(refreshData, 20000);
    //updateNotificationFunc();
}

// A way to let the user knows that this particular set of datas is going refresh within the time limit is being set on
function updateNotificationFunc(){
    //console.log("notification updated");
    var updateNotification = document.getElementById("updateNotificationLineChart");
    //var updateNotificationContent = "Top 10 Leaderboard Ranking (Updating...)";
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Attaining Their Best Scores (Updating)`; }, 0);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Attaining Their Best Scores (Updating.)`; }, 500);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Attaining Their Best Scores (Updating..)`; }, 1000);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Attaining Their Best Scores (Updating...)`; }, 1500);
    setTimeout(() => {  $('#myAreaChart').remove(); $('.chartjs-size-monitor').remove(); $('#myAddAreaChart').append('<canvas id="myAreaChart"><canvas>');}, 1990);
    //$('#myAreaChart').remove(); // this is my <canvas> element
    //$('.chartjs-size-monitor').remove();
    //$('#myAddAreaChart').append('<canvas id="myAreaChart"><canvas>');
    //updateNotification.innerHTML = updateNotificationContent;
  }

refreshData();

// This enable us to show the graph chart to show the No. of Players that have attain their highest socres, in a way the users can see a bellcurve of the
// average of where the users is at.
function UpdateTimeChart(){
    get(leaderBoards).then((snapshot) => { //retrieve a snapshot of the data using a callback
        if (snapshot.exists()) {
          //if the data exist
          var leaderBoardsList= [];
          snapshot.forEach((childSnapshot) => {
            leaderBoardsList.push(childSnapshot.val());                   
          });
  
          //var overAllScore = document.getElementById("overAllScore");
          //var overAllScoreContent = "";
          //var overAllStar = document.getElementById("overAllStar");
          //var overAllStarContent = "";
          leaderBoardsList.reverse()

            var updateNotification = document.getElementById("updateNotificationLineChart");
            var updateNotificationContent = "No. of Players Attaining Their Best Scores";
  
            // The variable store the count of the scores of each players
            var NoOfPlayerfor0 = 0;
            var NoOfPlayerfor100 = 0;
            var NoOfPlayerfor200 = 0;
            var NoOfPlayerfor300 = 0;
            var NoOfPlayerfor400 = 0;
            var NoOfPlayerfor500 = 0;
            var NoOfPlayerfor600 = 0;
            var NoOfPlayerfor700 = 0;
            var NoOfPlayerfor800 = 0;
            var NoOfPlayerfor900 = 0;
            var NoOfPlayerfor1000 = 0;
            var NoOfPlayerfor1001 = 0;
          
          leaderBoardsList.forEach((item) => {
            //console.log(item.totalScore);
            // The if else statement below allow us to categorize the players scores
            if (item.totalScore <= 0)
            {
                NoOfPlayerfor0+= 1;
            }
            else if (item.totalScore < 100)
            {
                NoOfPlayerfor100+= 1;
            }
  
            else if (item.totalScore < 200)
            {
                NoOfPlayerfor200+= 1;
            }
            else if (item.totalScore < 300)
            {
                NoOfPlayerfor300+= 1;
            }

            else if (item.totalScore < 400)
            {
                NoOfPlayerfor400+= 1;
            }
            else if (item.totalScore < 500)
            {
                NoOfPlayerfor500 += 1;
            }
            else if (item.totalScore < 600)
            {
                NoOfPlayerfor600+= 1;
            }
  
            else if (item.totalScore < 700)
            {
                NoOfPlayerfor700 += 1;
            }
            else if (item.totalScore < 800)
            {
                NoOfPlayerfor800 += 1;
            }

            else if (item.totalScore < 900)
            {
                NoOfPlayerfor900 += 1;
            }
            else if (item.totalScore < 1000)
            {
                NoOfPlayerfor1000 += 1;
            }

            else if (item.totalScore >= 1000)
            {
                NoOfPlayerfor1001 += 1;
            }

            

          });


          // Area Chart Example (This came from the bootstrap template that shows the dynamic graph in the website)
            var ctx = document.getElementById("myAreaChart");
            var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["0", "<100", "<200", "<300", "<400", "<500", "<600", "<700", "<800", "<900", "<1000", "≥1000"],
                datasets: [{
                label: "No. Of Players",
                lineTension: 0.3,
                backgroundColor: "rgba(56, 88, 184, 0.05)",
                borderColor: "#1E40A4",
                pointRadius: 3,
                pointBackgroundColor: "#1E40A4",
                pointBorderColor: "#1E40A4",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: [NoOfPlayerfor0, NoOfPlayerfor100, NoOfPlayerfor200, NoOfPlayerfor300, NoOfPlayerfor400, NoOfPlayerfor500, NoOfPlayerfor600, NoOfPlayerfor700, NoOfPlayerfor800, NoOfPlayerfor900, NoOfPlayerfor1000, NoOfPlayerfor1001],
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
                },
                scales: {
                xAxes: [{
                    time: {
                    unit: 'date'
                    },
                    gridLines: {
                    display: false,
                    drawBorder: false
                    },
                    ticks: {
                    maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                    
                    callback: function(value, index, values) {
                        return '' + number_format(value);
                    }
                    },
                    gridLines: {
                    color: "rgb(186, 186, 187)",
                    zeroLineColor: "rgb(186, 186, 187)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                    }
                }],
                },
                legend: {
                display: false
                },
                tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#0B0B0F",
                titleMarginBottom: 10,
                titleFontColor: '#0B0B0F',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function(tooltipItem, chart) {
                    var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                    return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    }
                }
                }
            }
            });

            updateNotification.innerHTML = updateNotificationContent;

        }
        else {
          //@TODO what if no data ?
        }
      });
}
