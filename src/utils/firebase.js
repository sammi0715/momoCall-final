// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "momocall.firebaseapp.com",
  databaseURL: "https://momocall-default-rtdb.firebaseio.com",
  projectId: "momocall",
  storageBucket: "momocall.appspot.com",
  messagingSenderId: "179153261388",
  appId: "1:179153261388:web:7936e0732579b355af35e9",
  measurementId: "G-X76J3G62JR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
