import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDJXTr5mTIIWv3h0Ew-g8_m5LdDsDX6sZQ",
    authDomain: "itra-7823f.firebaseapp.com",
    databaseURL: "https://itra-7823f.firebaseio.com",
    projectId: "itra-7823f",
    storageBucket: "itra-7823f.appspot.com",
    messagingSenderId: "202242653826",
    appId: "1:202242653826:web:31cde786fd5933e21ffe9b",
    measurementId: "G-6G0FRM6351"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  const storage = firebase.storage();

  export {
      storage, firebase as default
  }