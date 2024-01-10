import React, { useContext, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import alert from './alert';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import { get, ref, remove, set, update, onValue, off } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CountCalories = (textAge: string, textWeight: string, textGrowth: string, sexSelectedValue: string, activitySelectedValue: string, dietPurposeSelectedValue: string, setCalories: any) => {
    let countedCaloriesDemand = 0;
    const age = parseFloat(textAge);
    const weight = parseFloat(textWeight);
    const growth = parseFloat(textGrowth);

    if (isNaN(age) || isNaN(weight) || isNaN(growth)) {
        alert('Błąd', 'Proszę wprowadzić poprawne dane.');
    }
    else {

        if (sexSelectedValue === 'kobieta') {
            countedCaloriesDemand = 665.1 + (9.567 * weight) + (1.85 * growth) - (4.68 * age);
        } else {
            countedCaloriesDemand = 66.47 + (13.7 * weight) + (5 * growth) - (6.76 * age);
        }

        switch (activitySelectedValue) {
            case "znikomaAktywnosc":
                countedCaloriesDemand = countedCaloriesDemand * 1.4;
                break;

            case "niskaAktywnosc":
                countedCaloriesDemand = countedCaloriesDemand * 1.5;
                break;

            case "sredniaAktywnosc":
                countedCaloriesDemand = countedCaloriesDemand * 1.6;
                break;

            case "wysokaAktywnosc":
                countedCaloriesDemand = countedCaloriesDemand * 1.7;
                break;

            case "bardzoWysokaAktywnosc":
                countedCaloriesDemand = countedCaloriesDemand * 1.8;
                break;
            default:

                countedCaloriesDemand = countedCaloriesDemand * 1.6;
                break;
        }

        switch (dietPurposeSelectedValue) {
            case "schudnac":
                countedCaloriesDemand = countedCaloriesDemand * 0.9;
                break;

            case "utrzymacWage":
                countedCaloriesDemand = countedCaloriesDemand * 1;
                break;

            case "przytyc":
                countedCaloriesDemand = countedCaloriesDemand * 1.1;
                break;

            default:
                countedCaloriesDemand = countedCaloriesDemand * 1;
                break;
        }

        let finalCalories = parseFloat(countedCaloriesDemand.toFixed(0));
        setCalories(finalCalories);

        const user = FIREBASE_AUTH.currentUser;

        if (user) {
            const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    // Aktualizacja istniejących danych
                    set(userRef, {
                        ...snapshot.val(),
                        caloriesQuantity: finalCalories,
                    }).then(() => {
                        alert('Zaktualizowano dane', `Twoje zapotrzebowanie kaloryczne wynosi: ${finalCalories}`);
                    }).catch((error) => {
                        alert('Wystąpił błąd podczas aktualizacji danych: ' + error.message);
                    });
                } else {
                    // Dodawanie nowych danych
                    set(userRef, {
                        caloriesQuantity: finalCalories,
                    }).then(() => {
                        alert('Zaktualizowano dane', `Twoje zapotrzebowanie kaloryczne wynosi: ${finalCalories}`);

                    }).catch((error) => {
                        alert('Wystąpił błąd podczas zapisywania danych: ' + error.message);
                    });
                }
            }).catch((error) => {
                alert('Wystąpił błąd podczas pobierania danych: ' + error.message);
            });
        } else {
            alert('Nie zalogowano użytkownika.');
        }
    }
};

export { CountCalories };