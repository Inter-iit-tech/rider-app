// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCBhRcn_eEiEeJTFNzydjXLcUynwD-988Q",
  authDomain: "tech-iit.firebaseapp.com",
  projectId: "tech-iit",
  storageBucket: "tech-iit.appspot.com",
  messagingSenderId: "147407323116",
  appId: "1:147407323116:web:19e6bed159190d27800ac9",
  measurementId: "G-EQPVZZ5QBH",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export default app;
