import React, { useState } from 'react';
import { } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { NotLoggedStackNavigation } from './source/navigation/NavigationStackControll';
import './source/data/FirebaseConfig';
import 'react-native-gesture-handler';
import AuthorizationContext from './source/other/AuthorizationContext';
import CaloriesContext from './source/other/CaloriesContext';

const App = () => {
  const [isUserLogged, setUserLogged] = useState(false);
  const [calories, setCalories] = useState("0");

  return (
    <AuthorizationContext.Provider value={[isUserLogged, setUserLogged]}>
      <CaloriesContext.Provider value={[calories, setCalories]}>
        <NavigationContainer>
          < NotLoggedStackNavigation />
        </NavigationContainer>
      </CaloriesContext.Provider>
    </AuthorizationContext.Provider>
  )
}

export default App;