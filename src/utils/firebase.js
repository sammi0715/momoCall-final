
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "momocall.firebaseapp.com",
    databaseURL: "https://momocall-default-rtdb.firebaseio.com",
    projectId: "momocall",
    storageBucket: "momocall.appspot.com",
    messagingSenderId: "179153261388",
    appId: "1:179153261388:web:7936e0732579b355af35e9",
    measurementId: "G-X76J3G62JR"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp };
