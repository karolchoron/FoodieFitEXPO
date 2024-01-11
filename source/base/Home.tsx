import React from 'react';
import { Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../navigation/NavigationControll';
import styles from './HomeStyles';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  const navigationFunctions = NavigationFunctions({ navigation });

  return (
    <SafeAreaView style={styles.container}>

      <Image source={require('../../assets/images/logo.png')} style={styles.image} />

      <Text style={styles.headerText}>
        FoodieFit
      </Text>

      <Text style={styles.contentText}>
        {'\n'}{'\n'}Dzień dobry!{'\n'}{'\n'}
        Zarejestruj się lub zaloguj aby cieszyć się {'\n'} korzystaniem z aplikacji FoodieFit!
        {'\n'}{'\n'}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={navigationFunctions.goToLogin}>
          <Text style={styles.buttonText}>Logowanie</Text>
        </TouchableOpacity>

        <Text>{'\n'}</Text>

        <TouchableOpacity style={styles.button} onPress={navigationFunctions.goToRegistration}>
          <Text style={styles.buttonText}>Rejestracja</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default Home;