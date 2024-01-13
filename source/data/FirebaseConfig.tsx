import { getDatabase } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Konfiguracja poswiadczen do bazy Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHZKDh7o6KBQXpd1XmJHPQov9B0THIj2c",
  authDomain: "foodiefit-2f8e3.firebaseapp.com",
  projectId: "foodiefit-2f8e3",
  storageBucket: "foodiefit-2f8e3.appspot.com",
  messagingSenderId: "811770449362",
  appId: "1:811770449362:web:c34b7fb25aaf8572eecc0b",
  measurementId: "G-VD9K68JK5H",
  databaseURL: "https://foodiefit-2f8e3-default-rtdb.europe-west1.firebasedatabase.app",
};

// Inicializacja Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_DATABASE, FIREBASE_AUTH }