// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_37_XzhtdP_XuBe4WhXgVg3O2NoJ3XfU",
  authDomain: "saylani-hackathon-usman.firebaseapp.com",
  projectId: "saylani-hackathon-usman",
  storageBucket: "saylani-hackathon-usman.appspot.com",
  messagingSenderId: "867740898670",
  appId: "1:867740898670:web:b2facc74b9a535dc601d7f",
  measurementId: "G-BH2J2P79LX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { analytics, firestore };