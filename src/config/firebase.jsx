// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFBIQQOpLN3PIdrBrC0-vRcCv3dqRK40Q",
    authDomain: "inventory-management-sys-a2ac5.firebaseapp.com",
    projectId: "inventory-management-sys-a2ac5",
    storageBucket: "inventory-management-sys-a2ac5.firebasestorage.app",
    messagingSenderId: "1079327400123",
    appId: "1:1079327400123:web:0159b381f2f61e4fb3c99e",
    measurementId: "G-P1SPCRJ61Y"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


