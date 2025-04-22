
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJfJ5Nt95j1nNBMk9yo2ZPCCCwKH6x6Rk",
  authDomain: "uaaremployeehealthcare-80013.firebaseapp.com",
  projectId: "uaaremployeehealthcare-80013",
  storageBucket: "uaaremployeehealthcare-80013.firebasestorage.app",
  messagingSenderId: "78206841464",
  appId: "1:78206841464:web:68a0e6a3b2d7a17471738d",
  measurementId: "G-J943HNPBW2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
