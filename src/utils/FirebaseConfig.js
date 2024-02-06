import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzCDnZWu3aUilIq1Q1s_X7W5dBeW3-qe4",
  authDomain: "hyfriend-app-60457.firebaseapp.com",
  projectId: "hyfriend-app-60457",
  storageBucket: "hyfriend-app-60457.appspot.com",
  messagingSenderId: "507430518486",
  appId: "1:507430518486:web:a7438818777fde4f5c9377",
  measurementId: "G-6HV0ZP6HVJ"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);