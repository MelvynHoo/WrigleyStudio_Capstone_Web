import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, query, child, set, onValue, orderByChild, limitToLast, update} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

// The web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1Nte-TSWCBRUYXUvx2ZIP7_IMLbxshTQ",
  authDomain: "dda-wrigleystudio-y2s2-ip.firebaseapp.com",
  databaseURL: "https://dda-wrigleystudio-y2s2-ip-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dda-wrigleystudio-y2s2-ip",
  storageBucket: "dda-wrigleystudio-y2s2-ip.appspot.com",
  messagingSenderId: "1048521337977",
  appId: "1:1048521337977:web:53224d4d694c8672ea38a8"
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
            var allLevelCompletion = 0;
            var levelOneCompletion = 0;
            var levelTwoCompletion = 0;
  
            // This check for every user who has completed the levels, it will count up the levels by 1
          gameCompletionList.forEach((item) => {
            if (item.levelOneCompletion == true)
            {
              levelOneCompletion += 1;
            }
            else
            {
                levelOneCompletion += 0;
            }
  
            if (item.levelTwoCompletion == true)
            {
                levelTwoCompletion += 1;
            }
            else
            {
                levelTwoCompletion += 0;
            }

            if (item.allLevelCompletion == true)
            {
                allLevelCompletion += 1;
            }
            else
            {
                allLevelCompletion += 0;
            }

          });

          // Pie Chart Example (This came from the bootstrap template that shows the dynamic pie chart in the website)
            var ctx = document.getElementById("myPieChart");
            var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["Level One", "Level Two", "All Level"],
                datasets: [{
                data: [levelOneCompletion, levelTwoCompletion, allLevelCompletion],
                backgroundColor: ['#1E40A4', '#005C18', '#B10E0E'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#db1111'],
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


