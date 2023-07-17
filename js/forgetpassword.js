import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
//import { getDatabase, ref, get, child, set, onValue, orderByChild } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
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
//const db = getDatabase();

const auth = getAuth();
let ForgetPassword = document.getElementById("frmForgetPassword");

ForgetPassword.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    
    forgetPassword(email);
  });

// Forget password to send email
function forgetPassword(email)
{
    console.log("Forget password...")
    //var email = document.getElementById("email").value;
    console.log("email info:" + email)
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Sending email to reset password")
      alert('Password reset link has been sent to your email')
      
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

  