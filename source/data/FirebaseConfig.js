import { getDatabase } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Konfiguracja poswiadczen do bazy Firebase (projekt usuniety)
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX",
  measurementId: "XXX",
  databaseURL: "XXX",
};

// Inicializacja Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
// const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_AUTH = getAuth();

// const FIREBASE_DATABASE = getDatabase(FIREBASE_APP);
const FIREBASE_DATABASE = getDatabase();

export { FIREBASE_APP, FIREBASE_DATABASE, FIREBASE_AUTH }

// INFORMACJA BAZA DANYCH
// STRUKTURA BAZY DANYCH NOSQL FIREBASE REALTIMEDATABSE:
// + FIREBASE AUTHENTICATION

// /dishes/classic/breakfast
// /dishes/classic/dinner
// /dishes/classic/supper
// /dishes/wegetarian/breakfast
// /dishes/wegetarian/dinner
// /dishes/wegetarian/supper
// /users/id/caloriesQuantity
// /users/id/id
// /users/id/dateOfGenerateTheDayDish
// /users/id/idOfGeneratedTheDayDish
// /users/id/lastName
// /users/id/name
// /users/id/preferedTypeOfDiet

// PRZYKLAD:
// {
//   "dishes": {
//     "classic": {
//       "breakfast": [
//         null,
//         {
//           "id": 1,
//           "name": "Kanapki z Serem i Szynką",
//           "products": {
//             "bulka": {
//               "calories": 300,
//               "name": "Bułka",
//               "weight": 100
//             },
//             "ser": {
//               "calories": 200,
//               "name": "Ser",
//               "quantity": 2
//             },
//             "szynka": {
//               "calories": 150,
//               "name": "Szynka",
//               "quantity": 2
//             }
//           },
//           "totalCalories": 650
//         },
// 		[....]
		
// "users": {
//     "xxxxxxardeasdwqasdasdsa": {
//       "caloriesQuantity": 0,
//       "dateOfGenerateTheDayDish": "",
//       "id": "ur9HxuyuhNYVzdaYhRDI3ib1yIv1",
//       "idOfGeneratedTheDayDish": "",
//       "lastName": "Kowalski",
//       "name": "Jan",
//       "preferedTypeOfDiet": "Klasyczna"
//     },
// 	[...]