// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a00ae.firebaseapp.com",
  projectId: "mern-estate-a00ae",
  storageBucket: "mern-estate-a00ae.appspot.com",
  messagingSenderId: "1067748394252",
  appId: "1:1067748394252:web:e7f5519cebb509acdd3529",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
