import React, { useState, useContext } from 'react';
import {Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import styles from './LoginStyles';
import { RootStackParamList } from '../../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../../navigation/NavigationControll';
import AuthorizationContext from '../../sharedUtils/AuthorizationContext';
import { UserLogin } from './LoginController';

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

export default Login;