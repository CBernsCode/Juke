import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDnVeEhbUmGQntlMZKSGkUpDgnV8gBRM60",
  authDomain: "juke-23cdd.firebaseapp.com",
  databaseURL: "https://juke-23cdd.firebaseio.com",
  projectId: "juke-23cdd",
  storageBucket: "juke-23cdd.appspot.com",
  messagingSenderId: "629443389415"
};


export default firebase.initializeApp(config).database();

export const sessionRef = firebase.database().ref("/sessions")