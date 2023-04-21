// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBun2yiHDiqdyRYLBh5lKtp8v65GQpYdA",
  authDomain: "sahmride-d9877.firebaseapp.com",
  databaseURL: "https://sahmride-d9877-default-rtdb.firebaseio.com",
  projectId: "sahmride-d9877",
  storageBucket: "sahmride-d9877.appspot.com",
  messagingSenderId: "380706018682",
  appId: "1:380706018682:web:6eb4a0300f5b68511c72c3",
  measurementId: "G-61PEFW7Q3Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app);
export const realtime = getDatabase(app);