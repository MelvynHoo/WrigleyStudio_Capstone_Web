import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, child, set, onValue, orderByChild } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
//import {UpdatePlayerDisplayName} from "./firebase.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";


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

////SIGN UP NEW USER
//retrieve element from form
let CreateUser = document.getElementById("frmCreateUser");

//we create a button listener to listen when someone clicks
CreateUser.addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var displayname = document.getElementById("username").value;
  var gender = document.getElementById("inputGender").value;
  console.log("The gender" + gender)
  var age = document.getElementById("inputAge").value;
  console.log("The age" + age)
  createUser(email, password, displayname, gender, age);
  console.log("email" + email + "password" + password + "username" + displayname);

  
});

//create a new user based on email n password into Auth service
//user will get signed in
//userCredential is an object that gets
function createUser(email, password, displayname, gender, age) {
  console.log("Creating the user");

  
  // This creates the user and create a player data structure based on the user email, password, name, gender and age
  createUserWithEmailAndPassword(auth, email, password, displayname, gender, age)
    .then((userCredential) => {
      //signedin
      //const user = userCredential.user;
      const user = userCredential.user;
      //console.log("created user ... " + JSON.stringify(userCredential));
      console.log("User has been created ");

      
      //update display name
      //UpdatePlayerDisplayName();
      //console.log(displayname);

    // create the database from the website into firebase. Same way when create new user in the game
    var currentTimestamp = new Date().getTime();
    var playerData = {
      status: false,
      createdOn: currentTimestamp,
      email: email,
      lastLoggedIn: currentTimestamp,
      updatedOn: currentTimestamp,
      userName: displayname,
      displayName: displayname,
      gender: gender,
      age: age,
    };
    var playerStats = {
      createdOn: currentTimestamp,
      status: false,
      totalScore: 0, // change value for testing
      totalStar: 0, // change value for testing
      updatedOn: currentTimestamp,
      userName: displayname,
    };
    var leaderBoards = {
      totalScore: 0, // change value for testing
      totalStar: 0, // change value for testing
      status: false,
      updatedOn: currentTimestamp,
      userName: displayname,
    };
    var gameLevels = {
      userName: displayname,
      levelOneScore: 0, // change value for testing
      levelOneStar: 0, // change value for testing
      levelTwoScore: 0, // change value for testing
      levelTwoStar: 0, // change value for testing
      levelTwoInjuredSaved: 0, // change value for testing
      levelTwoObjectiveComplete: false, // change value for testing
      totalScore: 0, // change value for testing
      totalStar: 0, // change value for testing
    }
    var gameCompletion = {
      userName: displayname,
      levelOneCompletion: false, // change value for testing
      levelTwoCompletion: false, // change value for testing
      allLevelCompletion: false, // change value for testing
    }

    // When the user successfully sign up, the following data will be generate in the firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        console.log("The UID: " + uid)
        set(ref(db, `players/${uid}`), playerData);
        set(ref(db, `playerStats/${uid}`), playerStats);
        set(ref(db, `leaderBoards/${uid}`), leaderBoards);
        set(ref(db, `gameLevels/${uid}`), gameLevels);
        set(ref(db, `gameCompletion/${uid}`), gameCompletion);

        updateProfile(auth.currentUser, {
          displayName: displayname
        }).then(() => {
          const authUser = auth.currentUser;
          const displayNameAuth = authUser.displayName;
          console.log("Checking Auth User: " + displayNameAuth);
          //alert(typeof displayname) // displays "string"
        }).catch((error) => {
          // An error occurred
          // ...
        });

      } else {
        // User is signed out
        // ...
      }
    });

      //change page
      setTimeout(() => {window.location.href="login.html"}, 1000);
      //window.location.href="login.html";

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
    });


    //onValue(playerRef, (snapshot) =>{
    //  updatePlayerContent(snapshot);
    //})
}

/*ValidatePassword.bool (password){
  isValid = false;
  
  if (password != "" && password.length >= 6){
    isValid =true
  }
}*/

