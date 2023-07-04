import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase app
const firebaseConfig = {
    apiKey: "AIzaSyBpaY7Ds0ypV7P6yJocAARhQqSDqcZnKJs",
    authDomain: "baraglaaim.firebaseapp.com",
    databaseURL:
      "https://baraglaaim-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "baraglaaim",
    storageBucket: "baraglaaim.appspot.com",
    messagingSenderId: "941901960409",
    appId: "1:941901960409:web:7bf3e5793bbed7753adac8",
    measurementId: "G-8GJP6EDXGZ",
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);