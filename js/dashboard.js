import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase, ref, get, query, child, set, onValue, orderByChild, limitToLast} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

//Working with Auth
const auth = getAuth();
const user = auth.CurrentUser;
const leaderboard = ref(db, "leaderBoards");
const players = ref(db,"players")


//Retrieve from login
var myData = sessionStorage.getItem('UUID');
console.log("MY UUID for Dashboard:  " + myData);

// This function allow us to display and calculate the overall score and stars from the firebase database.
// In addition, getting how many active users and registered user in the game and website
getDashBoard();
function getDashBoard(){
  //Get the players database from firebase
    //const leaderboard = query(ref(db,"leaderboards"))
    get(players).then((snapshot) => { //retrieve a snapshot of the data using a callback
        if (snapshot.exists()) {
          //if the data exist
          var userList= [];
          snapshot.forEach((childSnapshot) => {
            userList.push(childSnapshot.val());                   
          });
  
            var noOfActiveUser = document.getElementById("noOfActiveUser");
            var noOfActiveUserContent = "";
            var noRegisterUser = document.getElementById("noOfRegisteredUser");
            var noRegisterUserContent = "";
            
            userList.reverse()
            //console.log(userList);
            // To store the amount of the active users and registered user
            var totalActiveUser = 0;
            var totalRegisteredUser = 0;

            // From the player data structure, count the amount of user is store in players
            totalRegisteredUser = userList.length;
            noRegisterUserContent = `
            <p class="my-text-font3">${totalRegisteredUser}</p>
            `   
            userList.forEach((item) => {

            // If the status of the player is true, the player is online and add the count of it as 1
            if(item.status == true)
            {
                totalActiveUser++
                noOfActiveUserContent = `
            <p class="my-text-font3">${totalActiveUser}</p>
            `
            }
          });
          noOfActiveUser.innerHTML = noOfActiveUserContent;
          noRegisterUser.innerHTML = noRegisterUserContent;
        }
        else {
          //@TODO what if no data ?
        }
      });
  
    // Get the pleaderboards database from firebase
    get(leaderboard).then((snapshot) => { //retrieve a snapshot of the data using a callback
      if (snapshot.exists()) {
        //if the data exist, then do
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

        // Storing the overall total star and score
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
  }