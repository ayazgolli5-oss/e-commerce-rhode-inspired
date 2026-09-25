// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLkSwjEpGmnWvkRZ7eoIby_IKZWItEbB8",
  authDomain: "rhode-project.firebaseapp.com",
  projectId: "rhode-project",
  storageBucket: "rhode-project.firebasestorage.app",
  messagingSenderId: "482592278810",
  appId: "1:482592278810:web:030473aa3ec705baaf84a3",
  measurementId: "G-RL06HN0LYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
