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

// Set new default font family and font color to mimic Bootstrap's default styling
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
console.log("MY UUID for Pie Chart: " + myData);

// RefreshData that allow the data to be refresh every 20 seconds to a new data from the firebase.
function refreshData(){
    // do whatever you like here
    //console.log("execute refresh data, wait 7 seconds");
    UpdatePieChart();
    setTimeout(updateNotificationFunc, 18000);
    setTimeout(refreshData, 20000);
    //updateNotificationFunc();
}

// A way to let the user knows that this particular set of datas is going refresh within the time limit is being set on
function updateNotificationFunc(){
    //console.log("notification updated");
    var updateNotification = document.getElementById("updateNotificationPieChart");
    //var updateNotificationContent = "Top 10 Leaderboard Ranking (Updating...)";
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Who Completed The Levels (Updating)`; }, 0);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Who Completed The Levels (Updating.)`; }, 500);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Who Completed The Levels (Updating..)`; }, 1000);
    setTimeout(() => {  updateNotification.innerHTML = `No. of Players Who Completed The Levels (Updating...)`; }, 1500);
    setTimeout(() => {  $('#myPieChart').remove(); $('#myAddPieChart').append('<canvas id="myPieChart"><canvas>');}, 1990);
    //updateNotification.innerHTML = updateNotificationContent;
  }

refreshData();
//UpdatePieChart();
// This enable us to show the Pie chart to show the No. of Players Who Completed The Levels, To enable the user to see how many has completed the levels or all the levels.
function UpdatePieChart(){
    get(gameCompletion).then((snapshot) => { //retrieve a snapshot of the data using a callback
        if (snapshot.exists()) {
          //if the data exist
          var gameCompletionList= [];
          snapshot.forEach((childSnapshot) => {
            gameCompletionList.push(childSnapshot.val());                   
          });
  
          //var overAllScore = document.getElementById("overAllScore");
          //var overAllScoreContent = "";
          //var overAllStar = document.getElementById("overAllStar");
          //var overAllStarContent = "";
          gameCompletionList.reverse()
  
            var updateNotification = document.getElementById("updateNotificationPieChart");
            var updateNotificationContent = "No. of Players Who Completed The Levels";

            // To store the number of players who has completed the levels
            var seaRegion = 0;
            var forestRegion = 0;
            var cityRegion = 0;
            var industrialRegion = 0;
  
            // This check for every user who has completed the levels, it will count up the levels by 1
          gameCompletionList.forEach((item) => {
            if (item.seaRegion == true)
            {
              seaRegion += 1;
            }
            else
            {
                seaRegion += 0;
            }
  
            if (item.forestRegion == true)
            {
                forestRegion += 1;
            }
            else
            {
                forestRegion += 0;
            }

            if (item.cityRegion == true)
            {
                cityRegion += 1;
            }
            else
            {
                cityRegion += 0;
            }
            if (item.industrialRegion == true)
            {
                industrialRegion += 1;
            }
            else
            {
                industrialRegion += 0;
            }

          });

          // Pie Chart Example (This came from the bootstrap template that shows the dynamic pie chart in the website)
            var ctx = document.getElementById("myPieChart");
            var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["Sea Region", "Forest Region", "City Region", "Industrial Region"],
                datasets: [{
                data: [seaRegion, forestRegion, cityRegion, industrialRegion],
                backgroundColor: ['#1E40A4', '#005C18', '#B10E0E', '#cf7702'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#db1111', '#df7f02'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                },
                legend: {
                display: false
                },
                cutoutPercentage: 80,
            },
            });

            updateNotification.innerHTML = updateNotificationContent;
        }
        else {
          //@TODO what if no data ?
        }
      });
}


