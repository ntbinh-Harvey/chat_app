import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAXxuq6xTemrSpZ9Q1_EHlOA1Axf4joUSo",
  authDomain: "chat-application-37557.firebaseapp.com",
  projectId: "chat-application-37557",
  storageBucket: "chat-application-37557.appspot.com",
  messagingSenderId: "448401421505",
  appId: "1:448401421505:web:e2d9d9826b35dd1c365040",
  databaseURL: "https://chat-application-37557-default-rtdb.asia-southeast1.firebasedatabase.app",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const database = firebase.database();
export { firebase, firestore, auth, database };
