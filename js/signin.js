import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, updateProfile} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getDatabase, ref, get, child, set, update, onValue, orderByChild } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
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

////SIGN IN USER
//retrieve element from form
let SignInUser = document.getElementById("frmSignInUser");

//we create a button listener to listen when someone clicks
SignInUser.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //var displayname = document.getElementById("username").value;
    
    signInUser(email, password);
    //console.log("Sign In User: email" + email + "password" + password + "username" + displayname);
  });
  
  // This function allow the person to login into the website and it can also use the same credentialsbe for the game
  function signInUser(email, password){
    console.log("Sign in user in progress...")
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //var displayname = document.getElementById("username").value;
    
    // Using the auth, email and password to generate the UUID of the user
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
      //signedin
      const user = userCredential.user;
      const uid = user.uid;
      
      const authUser = auth.currentUser;
      const displayNameAuth = authUser.displayName;
      console.log("Checking Auth User: " + displayNameAuth);
      //console.log("Checking auth user:" + currentUser);
      //alert(typeof displayNameAuth)
      
      /*
      updateProfile(auth.currentUser, {
        //displayName: "Xiao Hu"
      }).then(() => {
        // Profile updated!
        const authUser = auth.currentUser;
        const displayNameAuth = authUser.displayName;
        console.log("Checking display user:" + displayNameAuth);
        console.log("Checking auth user:" + currentUser);
        alert(typeof displayNameAuth)
      }).catch((error) => {
        // An error occurred
        // ...
      });
      */

      // Saved the session storage of the user
      sessionStorage.setItem("UUID", uid);
      console.log("The user UUID: " + uid);
      
      //console.log("logging in user ... " + JSON.stringify(userCredential));
      console.log("User is now signed in ");
      console.log("Sign In User: Email - " + email + " Password - " + password);

      // Update the user status to be online, show that the player is online
      update(ref(db, "playerStats/" + uid),{
        status: true
      });
      update(ref(db, "leaderBoards/" + uid),{
        status: true
      });

      update(ref(db, "players/" + uid),{
        status: true
      });

      /*
      update(ref(db, "players/" + uid),{
        displayName: "Sally"
      });
      */
     // bring the user to the main page
      setTimeout(() => {window.location.href="index.html"}, 1000);
      
      //change page
      //setTimeout(() => {window.location.href="index.html"}, 1000);

      //update display name
      //UpdatePlayerDisplayName(displayname);
      //console.log(displayname);
      console.log("Login Completed")

    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
    });
}


