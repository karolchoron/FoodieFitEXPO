import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../components/Navigation/Navigation';
import AuthorizationContext from '../components/AuthorizationContext';
import { UserLogin } from '../components/AuthorizationManagement';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Login = ({ navigation }: Props) => {

  const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);
  const navigationFunctions = NavigationFunctions({ navigation });

  const [textEmail, setEmailText] = useState('');
  const [textPassword, setPasswordText] = useState('');

  // ukrycie tekstu po kliknieciu w texfield email lub haslo
  const [isEmailFocused, setEmailIsFocused] = useState(false);
  const emailHandleFocus = () => setEmailIsFocused(true);
  const emailHandleBlur = () => setEmailIsFocused(false);

  const [isPasswordFocused, setPasswordIsFocused] = useState(false);
  const passwordHandleFocus = () => setPasswordIsFocused(true);
  const passwordHandleBlur = () => setPasswordIsFocused(false);

  return (
    <SafeAreaView style={styles.container}>

      {/* TODO 
      MOZE DODAJ OPCJE "ZAPOMNIAŁEM HASŁA
      */}

      <Text style={styles.contentText}>
        Wprowadź swoje dane{'\n'}
        aby się zalogować:
        {'\n'}{'\n'}
      </Text>

      <View>
        <TextInput
          value={textEmail}
          onChangeText={setEmailText}
          onFocus={emailHandleFocus}
          onBlur={emailHandleBlur}
          placeholder="Wprowadź e-mail"
          keyboardType='email-address'
          style={styles.textInput}
          placeholderTextColor={isEmailFocused ? 'transparent' : 'grey'}
        />
      </View>

      <Text>{'\n'}</Text>

      <View>
        <TextInput
          value={textPassword}
          onChangeText={setPasswordText}
          onFocus={passwordHandleFocus}
          onBlur={passwordHandleBlur}
          placeholder="Wprowadź hasło"
          secureTextEntry={true}
          style={styles.textInput}
          placeholderTextColor={isPasswordFocused ? 'transparent' : 'grey'}
        />
      </View>
      <Text>{'\n'}</Text>
      <TouchableOpacity style={styles.button} onPress={() => UserLogin({ navigation }, textEmail, textPassword, setUserLogged)}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>
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

  textInput: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    fontWeight: 'normal',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },

  contentText: {
    fontWeight: 'normal',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  separator: {
    margin: 10,
    height: 2,
    width: "95%",
    backgroundColor: 'grey',
  },
});


export default Login;