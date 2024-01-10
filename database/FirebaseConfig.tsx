import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


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

// Initialize Firebase
// const FIREBASE_APP = initializeApp(firebaseConfig);

let FIREBASE_APP;
if (!getApps().length) {
  FIREBASE_APP = initializeApp(firebaseConfig);
} else {
  FIREBASE_APP = getApps()[0];
}

const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);
// export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_DATABASE, FIREBASE_AUTH }