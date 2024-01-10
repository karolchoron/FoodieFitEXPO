import React, { useState, useContext, useEffect } from 'react';
import { } from 'react-native';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, } from 'react-native';
// import { NativeRouter, Route, Link, Routes } from 'react-router-native';
import { NavigationContainer } from "@react-navigation/native";
import { NavigationFunctions, NotLoggedStackNavigation, TabNavigation, LoggedHomeDrawerNavigation } from './src/components/Navigation/Navigation';
import './database/FirebaseConfig';
import 'react-native-gesture-handler'; // potrzebny do Drawer - side menu
import AuthorizationContext from './src/components/AuthorizationContext';
import CaloriesContext from './src/components/CaloriesContext';

const App = () => {
  const [isUserLogged, setUserLogged] = useState(false);
  const [calories, setCalories] = useState("0");

  return (
    <AuthorizationContext.Provider value={[isUserLogged, setUserLogged]}>
      <CaloriesContext.Provider value={[calories, setCalories]}>
        <NavigationContainer>
          {/* <NotLoggedStackNavigation /> */}
          < NotLoggedStackNavigation/>
        </NavigationContainer>
      </CaloriesContext.Provider>
    </AuthorizationContext.Provider>
  )
}

export default App;