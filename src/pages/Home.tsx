import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import logo from '../../assets/images/logo.png';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../components/Navigation/Navigation';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Home = ({ navigation }: Props) => {
  const navigationFunctions = NavigationFunctions({ navigation });

  return (
    <SafeAreaView style={styles.container}>

      <Image source={logo} style={styles.image} />

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
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },

  button: {
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    margin: 10,
    padding: 12,
    borderRadius: 30,
    width: 'auto',
  },

  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});


export default Home;