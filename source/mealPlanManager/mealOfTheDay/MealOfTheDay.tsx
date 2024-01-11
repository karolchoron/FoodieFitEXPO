import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Image } from 'react-native';
import { useDietManagement } from '../DietManagement';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../data/FirebaseConfig';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './mealOfTheDayStyles';
import '../../interfaces/ProductInterface';
import '../../interfaces/DishInterface';

const MealOfTheDay = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserName(userData.name);
          } else {
            console.log("Brak danych");
          }
        }).catch((error) => {
          console.error("Błąd pobierania danych: ", error);
        });
      } else {
        console.log("Użytkownik nie jest zalogowany");
      }
    });
  }, []);

  const [mealOfTheDay, setMealOfTheDay] = useState<Dish | null>(null);
  const { generateMealOfTheDay } = useDietManagement();

  useEffect(() => {
    generateMealOfTheDay().then(dish => {
      if (dish) {
        setMealOfTheDay(dish);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Image source={require('../../../assets/images/logo.png')} style={styles.image} />

      <Text style={styles.headerText}>
        FoodieFit
      </Text>

      <View style={styles.textContainer}>
        <Text style={styles.contentText}>
          Dzień dobry {userName}!
          {'\n'}
          {'\n'}Zgłodniałeś? Co powiesz na...
        </Text>
      </View>

      <View style={styles.mealContainer}>
        <Text style={styles.mealText}>
          {/* {mealOfTheDay?.name || 'Błąd ładowania danych.'}*/}
          {mealOfTheDay?.name}
        </Text>

        <Text style={styles.contentText}>
          {/* {mealOfTheDay?.totalCalories || 'Błąd ładowania danych.'} kcal */}
          {mealOfTheDay?.totalCalories} kcal
        </Text>

        <Text style={styles.contentText}>
          {'\n'}FoodieFit życzy smacznego!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MealOfTheDay;