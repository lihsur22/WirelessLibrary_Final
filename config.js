import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDzeZ3ixZ_elYanodtsa8Qr_S3EL7tN3GE",
    authDomain: "wi-li-52df9.firebaseapp.com",
    databaseURL : "https://wi-li-52df9.firebaseio.com",
    projectId: "wi-li-52df9",
    storageBucket: "wi-li-52df9.appspot.com",
    messagingSenderId: "955815803347",
    appId: "1:955815803347:web:d3eeec1494892830589726"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();