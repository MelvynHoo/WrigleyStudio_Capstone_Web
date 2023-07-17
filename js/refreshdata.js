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
console.log("MY UUID for Refresh Data:  " + myData);

var limit = 10;
// Call the function ever 5 five seconds
function refreshData(){
  // do whatever you like here
  //console.log("execute refresh data, wait 7 seconds");
  updateData(limit);
  setTimeout(updateNotificationFunc, 8000);
  setTimeout(refreshData, 10000);
  //updateNotificationFunc();
}

// A way to let the user knows that this particular set of datas is going refresh within the time limit is being set on
function updateNotificationFunc(){
  //console.log("notification updated");
  var updateNotification = document.getElementById("updateNotification");
  //var updateNotificationContent = "Top 10 Leaderboard Ranking (Updating...)";
  setTimeout(() => {  updateNotification.innerHTML = `Top 10 Leaderboard Ranking (Updating)`; }, 0);
  setTimeout(() => {  updateNotification.innerHTML = `Top 10 Leaderboard Ranking (Updating.)`; }, 500);
  setTimeout(() => {  updateNotification.innerHTML = `Top 10 Leaderboard Ranking (Updating..)`; }, 1000);
  setTimeout(() => {  updateNotification.innerHTML = `Top 10 Leaderboard Ranking (Updating...)`; }, 1500);

  var updateStatisticNotfication = document.getElementById("updateStatisticNotfication");
  setTimeout(() => {  updateStatisticNotfication.innerHTML = `Your Statistics (Updating)`; }, 0);
  setTimeout(() => {  updateStatisticNotfication.innerHTML = `Your Statistics (Updating.)`; }, 500);
  setTimeout(() => {  updateStatisticNotfication.innerHTML = `Your Statistics (Updating..)`; }, 1000);
  setTimeout(() => {  updateStatisticNotfication.innerHTML = `Your Statistics (Updating...)`; }, 1500);

  //updateNotification.innerHTML = updateNotificationContent;
}
refreshData();

//This function allow the leaderboards to be refresh by deleting the old leaderboards and replacing it with the new leaderboards data, which will have to update data from firebase
function updateData(limit){
  
  //console.log("Data updated");
  const que = query(ref(db,"leaderBoards"),orderByChild("totalScore"),limitToLast(limit))
    
    //get the sorted leaderboard and reverse the to ascending order
    get(que).then((snapshot) => { //retrieve a snapshot of the data using a callback
      if (snapshot.exists()) {
        //if the data exist
        var lbList= [];
        snapshot.forEach((childSnapshot) => {
           lbList.push(childSnapshot.val());                   
        });

        var leaderBoardData = document.getElementById("leaderBoardData");
        var content = "";
        var removeContent = "";
        lbList.reverse()
        //console.log(lbList);
        var updateNotification = document.getElementById("updateNotification");
        var updateNotificationContent = "Top 10 Leaderboard Ranking";
        removeContent = `<tr>
        <th>Ranking</th>
        <th>Name</th>
        <th>Total Score</th>
        <th>Total Star</th>
        <th>Status</th>
        </tr>`
        updateNotificationContent = `Top 10 Leaderboard Ranking`

        var i = 1;
        //From the array of the leaderboard, print out each item of the top 10 user that is sorted by the total score.
        lbList.forEach((item) => {
          //console.log(`username of players found: ${item.noOfMoneyEarned}`);
          var status = "Offline";
          var username = "Unable to retrieved player name";
          var totalScore = "0";
          var totalStar = "0";

          if(item.status == true){
            status = '<td style="color:#00664B; font-weight: bold; ">Online</td>'
          }
          else{
            status = '<td style="color:#B10E0E; font-weight: bold; ">Offline</td>'
          }

          if(item.userName == null){
            username = "Unable to retrieved player name";
          }
          else{
            username = item.userName;
          }

          if(item.totalScore == null){
            totalScore = "0";
          }
          else{
            totalScore = item.totalScore;
          }

          if(item.totalStar == null){
            totalStar = "0";
          }
          else{
            totalStar = item.totalStar;
            //console.log("What the total star :" + totalStar);
          }

          content += `
          
          <tr>
          <td>${i++}</td>
          <td>${username}</td>
          <td>${totalScore}</td>
          <td>${totalStar}</td>
          ${status}
          </tr>
          `
          
        });
        
        leaderBoardData.innerHTML = removeContent;
        leaderBoardData.innerHTML += content;
        updateNotification.innerHTML = updateNotificationContent;
        //setTimeout(() => {  updateNotification.innerHTML = `Top 10 Leaderboard Ranking (Updating...)`; }, 5);
      }
      else {
      }
    });
// Get the leaderboards database from firebase and display again
get(leaderBoards).then((snapshot) => { //retrieve a snapshot of the data using a callback
  if (snapshot.exists()) {
    //if the data exist
    // Push the leaderboards data into an array
    var dashBoardList= [];
    snapshot.forEach((childSnapshot) => {
        dashBoardList.push(childSnapshot.val());                   
    });

    var overAllScore = document.getElementById("overAllScore");
    var overAllScoreContent = "";
    var overAllStar = document.getElementById("overAllStar");
    var overAllStarContent = "";
    // Reverse the order from big to small, to small to big
    dashBoardList.reverse()
    //console.log(dashBoardList);

    var totalStar = 0;
    var totalScore = 0;

    // From the array, look for the total star and score and add them up to find the overall score and star
    dashBoardList.forEach((item) => {
      //console.log(`username of players found: ${item.noOfMoneyEarned}`);
      if (item.totalStar == null)
      {
        totalStar += 0;
      }
      else
      {
        totalStar += item.totalStar;
      }

      if (item.totalScore == null)
      {
        totalScore += 0;
      }
      else
      {
        totalScore += item.totalScore;
      }
        //totalRegisteredUser = dashBoardList.length;
        
        overAllStarContent = `
        <p class="my-text-font3">${totalStar}</p>
        `
        overAllScoreContent = `
        <p class="my-text-font3">${totalScore}</p>
        `
    });
    overAllStar.innerHTML = overAllStarContent;
    overAllScore.innerHTML = overAllScoreContent;
  }
  else {
    //@TODO what if no data ?
  }
});

///PLAYER STATS
get(playerStats).then((snapshot) => { //retrieve a snapshot of the data using a callback
  if (snapshot.exists()) {
    //if the data exist
    
    try {
      //let's do something about it
      var playerName = document.getElementById("playerStatsUserName");
      var playerNamecontent = "";

      var playerStatsTotalScore = document.getElementById("playerStatsTotalScore");
      var playerStatsTotalScoreContent = "";

      var playerStatsTotalStar = document.getElementById("playerStatsTotalStar");
      var playerStatsTotalStarContent = "";

      var myStatus = document.getElementById("yourStatus");
      var myStatusContent = "";

      var updateStatisticNotfication = document.getElementById("updateStatisticNotfication");
      var updateStatisticNotficationContent = "Your Statistics";

      // For every players, search the UUID for the player that is logged into the website, can only display their stats
      snapshot.forEach((childSnapshot) => {
        //looping through each snapshot
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        //console.log("User key:" + childSnapshot.key);
        //console.log("Username:" + childSnapshot.child("userName").val());
        //console.log(`compare ${childSnapshot.key}:SUbyQ9LeZjb2MzjIKIC7wEWvxLW2`)

        let userKey = (childSnapshot.key).trim();

        if (userKey == myData) {

          ////display name
          //console.log(`username of playerStats found: ${childSnapshot.child("userName").val()}`);

          //adding data into 'content'
          playerNamecontent = `<td id="userName">
          ${childSnapshot.child("userName").val()}
          </td>`;

          //adding name to display name
          //content += `<p class = "username">
          //${childSnapshot.child("userName").val()}
          //</p>`;

          //adding data into 'content'
          playerStatsTotalScoreContent = `<td id="playerStatsTotalScore">
          ${childSnapshot.child("totalScore").val()}
          </td>`;
          
          //update our table content
          //highestScore.innerHTML = content;
        
          
          //adding data into 'content'
          playerStatsTotalStarContent = `<td id="playerStatsTotalStar">
          ${childSnapshot.child("totalStar").val()}
          </td>`;

          ////active status

          //console.log(`my status: ${childSnapshot.child("status").val()}`);
          var status = "Offline";
          if(childSnapshot.child("status").val() == true){
            status = 'Online'
          }
          else{
            status = 'Offline'
          }
          //adding data into 'content'
          myStatusContent = `
          ${status}
          `;
        }
      });
      //update our table content
      playerName.innerHTML = playerNamecontent;
      playerStatsTotalScore.innerHTML = playerStatsTotalScoreContent;
      playerStatsTotalStar.innerHTML = playerStatsTotalStarContent;
      myStatus.innerHTML = myStatusContent;
      updateStatisticNotfication.innerHTML = updateStatisticNotficationContent;

      
      
    } catch (error) {
      console.log("Error getPlayerData" + error);
    }
  }
  else
  {
    console.log("No playerstat" + error);
  }

});

}
