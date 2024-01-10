import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Button } from 'react-native';
import logo from '../images/logo.png';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../components/Navigation/Navigation';
import { useDietManagement } from '../components/DietManagement';
import alert from '../components/alert';
import database from '@react-native-firebase/database';
import CaloriesContext from '../components/CaloriesContext';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import { get, ref, remove, set, update, onValue, off } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface Product {
  name: string;
  quantity: number;
  weight: number;
  calories: number;
}

interface Dish {
  name: string;
  dietType: string;
  totalCalories: number;
  products?: Record<string, Product>;
}

const LoggedHome = () => {
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

      <Image source={logo} style={styles.image} />

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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f0f0eb',
  },
  image: {
    width: 200,
    height: 200,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000',
    textAlign: 'center',
  },
  contentText: {
    fontWeight: 'normal',
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },

  mealText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },

  mealDataFontDescription: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },
  productTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },

  mealContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    margin: 10,
    borderTopWidth: 2,
    borderColor: 'grey',
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
    margin: 10,
  },

});

export default LoggedHome;