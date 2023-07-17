import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, query, child, set, onValue, orderByChild, limitToLast} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

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
//const leaderboard = ref(db, "leaderboards");


//Retrieve from login
var myData = sessionStorage.getItem('UUID');
console.log("MY UUID for Leaderboard:  " + myData);

var limit = 10;
// The function below to getting the leaderbaords datasbase from fireabase
  getLB(limit);
  function getLB(limit = 10){
     //q = get(leaderboard).then(orderByChild("noOfMoneyEarned"));
     // Sort the leaderboard by the total score of the players and limit the amoount to 10.
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
        lbList.reverse()
        //console.log(lbList);

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
            status = '<td style="color:#B10E0E; font-weight: bold;">Offline</td>'
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
        leaderBoardData.innerHTML += content;
        /*
        try {
          //let's do something about it
          var overLeaderBoard = document.getElementById("leaderBoardData");
          var content = "";
          snapshot.forEach((childSnapshot) => 
            //looping through each snapshot
            console.log(`username of players found: ${childSnapshot.child("userName").val()}`);
            content += `<tr>
            <td>${childSnapshot.child("userName").val()} </td>
            <td>${childSnapshot.child("userName").val()}</td>
            <td>${childSnapshot.child("noOfMoneyEarned").val()}</td>
            <td>${childSnapshot.child("noOfboxDelivered").val()}</td>
            </tr>`;                                
          });
          overLeaderBoard.innerHTML = content;
        } catch (error) {
          console.log("Error getPlayerData" + error);
        }
        */
      }
      else {
        //@TODO what if no data ?
      }
    });
  }
/*
  function AddAllItemsToTable(leaderboard)
  {
    leaderboard.reverse();
    console.log(leaderboard);
    var overLeaderBoard = document.getElementById("leaderBoardData");
    var content, index1, index2, index3, index4 = "";
    for (let i = 0; i++; index1 in leaderboard.i) {
      
      content += "<td>"+ leaderboard.i[index1].noOfMoneyEarned + "</td>";
    }
    console.log(content);
    overLeaderBoard.innerHTML = content;
  }
  function GetCurrentUser(){
    return user;
  }
  */