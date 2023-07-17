import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, child, set, update, push, onValue, orderByChild} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
//import {email, password, displayname} from "./signin";
//import {email, password, displayname} from "./signup";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const playerRef = ref(db, "players");
const playerStats = ref(db, "playerStats");
const leaderboard = ref(db, "leaderBoards");

//Retrieve from login
var myData = sessionStorage.getItem('UUID');
console.log("MY UUID for Firebase: " + myData);

var limit = 1;

// Ability for the user to delete the player statistics
let deletePlayerStat = document.getElementById("deleteData");
deletePlayerStat.addEventListener("click",  UpdatePlayerStats);
 
//UpdatePlayerStats();
var currentTimestamp = new Date().getTime();

//This function will reset all the value into 0 and the levels back to false. 
// Hence this will effectively reset the player progress and the player will have to play again to continue.
function UpdatePlayerStats(){
  
  if (myData == null)
  {
    console.log("No UUID to delete");
    setTimeout(() => {window.location.href="index.html"}, 1000);
  }
  else
  {
    console.log("Deleting you statistic")
    update(ref(db, "playerStats/" + myData),{
      totalScore: 0,
      totalStar: 0,
      updatedOn: currentTimestamp
    });
    update(ref(db, "leaderBoards/" + myData),{
      totalScore: 0,
      totalStar: 0,
      updatedOn: currentTimestamp
    });
    update(ref(db, "gameCompletion/" + myData),{
      allLevelCompletion: false,
      levelOneCompletion: false,
      levelTwoCompletion: false
    });
    update(ref(db, "gameLevels/" + myData),{
      totalScore: 0,
      totalStar: 0,
      levelOneScore: 0,
      levelOneStar: 0,
      levelTwoScore: 0,
      levelTwoStar: 0,
      levelTwoInjuredSaved: 0,
      levelTwoObjectiveComplete: 0,
    });
    setTimeout(() => {window.location.href="index.html"}, 1000);
  }
  
}

//Get player data
getPlayerData(limit = 1);
function getPlayerData() {
  //const playerRef = ref(db, "players");
  //PlayerRef is declared at the top using a constant
  //get(child(db,`players/`))

  //e.preventDefault();
  //playerRef is declared at the top using a constant
  //const playerRef = ref(db, "players");
  //get(child(db,`players/`))

  // Get the players data from the firebase
  get(playerRef).then((snapshot) => { //retrieve a snapshot of the data using a callback
    if (snapshot.exists()) {
      //if the data exist
      try {
        //let's do something about it
        var playerUsername = document.getElementById("playerUserName");
        var content = `<p class ="name" style="color:white; font-weight: bold;"> *No player Name
        </p>`;

        var playerGender = document.getElementById("playerGender");
        var playerGenderContent = "";

        var playerAge = document.getElementById("playerAge");
        var playerAgeContent = "";

        // For every players, search the UUID for the player that is logged into the website, can only display their stats
        snapshot.forEach((childSnapshot) => {
          //looping through each snapshot
          //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
          //console.log("User key:" + childSnapshot.key);
          //console.log("Username:" + childSnapshot.child("userName").val());
          //console.log(`compare ${childSnapshot.key}:SUbyQ9LeZjb2MzjIKIC7wEWvxLW2`)
          let userKey = (childSnapshot.key).trim();
          if (userKey == myData) {
            console.log(`Username of player found: ${childSnapshot.child("userName").val()}`);
            
            content = `<p class ="name" style="font-weight: bold; color:white;"> Welcome Back,
            ${childSnapshot.child("userName").val()}
            </p>`;

            //adding data into 'content'
            playerGenderContent += `<td id="playerGender">
            ${childSnapshot.child("gender").val()}
            </td>`;

            //adding data into 'content'
            playerAgeContent += `<td id="playerAge">
            ${childSnapshot.child("age").val()}
            </td>`;
          }
        });
        //update our table content
        playerUsername.innerHTML = content;
        playerAge.innerHTML = playerAgeContent;
        playerGender.innerHTML = playerGenderContent;
      } catch (error) {
        console.log("Error getPlayerData" + error);
      }
    }
    else {
      console.log("No players" + error);
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
        var myStatusContent ="";

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
            console.log(`Username of playerStats found: ${childSnapshot.child("userName").val()}`);

            //adding data into 'content'
            playerNamecontent += `<td id="userName">
            ${childSnapshot.child("userName").val()}
            </td>`;

            //adding name to display name
            //content += `<p class = "username">
            //${childSnapshot.child("userName").val()}
            //</p>`;

            //adding data into 'content'
            playerStatsTotalScoreContent += `<td id="playerStatsTotalScore">
            ${childSnapshot.child("totalScore").val()}
            </td>`;
            
            //update our table content
            //highestScore.innerHTML = content;
          
            
            //adding data into 'content'
            playerStatsTotalStarContent += `<td id="playerStatsTotalStar">
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
            myStatusContent+= `
            ${status}
            `;
          }
        });
        //update our table content
        playerName.innerHTML = playerNamecontent;
        playerStatsTotalScore.innerHTML = playerStatsTotalScoreContent;
        playerStatsTotalStar.innerHTML = playerStatsTotalStarContent;
        myStatus.innerHTML = myStatusContent;
  
        
        
      } catch (error) {
        console.log("Error getPlayerData" + error);
      }
    }
    else
    {
      console.log("No playerstat" + error);
    }

  });
  
  /* OLD ONE
  get(playerRef)
    .then((snapshot) => {//retrieve a snapshot of the data using a callback
      if (snapshot.exists()) {//if the data exist
        try {
          //let's do something about it
          var content = "";
          snapshot.forEach((childSnapshot) => {//looping through each snapshot
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array / forEach
            console.log("GetPlayerData: childkey " + childSnapshot.key);
            console.log(`Node : ${JSON.stringify(childSnapshot)}`);
            console.log(`Node Active: ${childSnapshot.child("active").val()}`);
          });
        } catch (error) {
          console.log("Error getPlayerData" + error);
        }
      }
    });
 */
}//end getPlayerData

// update current user
function GetCurrentUser(){
  return user;
}

// Clear the session Storage that store the UUID of the player and update the status to false to become offline.
// Then redirect them to the login screen.
let logout = document.getElementById("LogOutBTN");
logout.addEventListener("click",  LogOut);
function LogOut(){
  if (myData == null)
  {
    sessionStorage.clear();
  }
  if (myData != null)
  {

    update(ref(db, "playerStats/" + myData),{
      status: false
    });
    update(ref(db, "leaderBoards/" + myData),{
      status: false
    });
  
    update(ref(db, "players/" + myData),{
      status: false
    });
  }
  sessionStorage.clear();
  setTimeout(() => {window.location.href="login.html"}, 1000);
}


