import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { RootStackParamList } from '../../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationFunctions } from '../../navigation/Navigation';
import AuthorizationContext from '../../sharedUtils/AuthorizationContext';
import { RegisterUser } from '../AuthorizationManagement';
import { Picker } from '@react-native-picker/picker';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Registration = ({ navigation }: Props) => {
  const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);
  const navigationFunctions = NavigationFunctions({ navigation });

  const [textEmail, setEmailText] = useState('');
  const [textPassword, setPasswordText] = useState('');
  const [textUserName, setUserNameText] = useState('');
  const [textUserLastName, setUserLastNameText] = useState('');

  // ukrycie tekstu po kliknieciu w texfield email lub haslo
  const [isEmailFocused, setEmailIsFocused] = useState(false);
  const emailHandleFocus = () => setEmailIsFocused(true);
  const emailHandleBlur = () => setEmailIsFocused(false);

  const [isPasswordFocused, setPasswordIsFocused] = useState(false);
  const passwordHandleFocus = () => setPasswordIsFocused(true);
  const passwordHandleBlur = () => setPasswordIsFocused(false);

  const [isUserNameFocused, setUserNameIsFocused] = useState(false);
  const userNameHandleFocus = () => setUserNameIsFocused(true);
  const userNameHandleBlur = () => setUserNameIsFocused(false);

  const [isUserLastNameFocused, setUserLastNameIsFocused] = useState(false);
  const userLastNameHandleFocus = () => setUserLastNameIsFocused(true);
  const userLastNameHandleBlur = () => setUserLastNameIsFocused(false);
  const [dietTypeSelectedValue, setDietTypeSelectedValue] = useState("Klasyczna");

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View>
          <Text style={styles.contentText}>{'\n'}Wybierz preferowany typ diety:</Text>
          <Picker
            mode="dropdown"
            selectedValue={dietTypeSelectedValue}
            style={styles.stylePicker}
            onValueChange={(dietTypeValue, dietTypeIndex) => setDietTypeSelectedValue(dietTypeValue)}>
            <Picker.Item label="Klasyczna" value="Klasyczna" />
            <Picker.Item label="Wegetariańska" value="Wegetarianska" />
          </Picker>
        </View>
        <View style={styles.separator}></View>
        <Text>{'\n'}</Text>
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

        <View>
          <TextInput
            value={textUserName}
            onChangeText={setUserNameText}
            onFocus={userNameHandleFocus}
            onBlur={userNameHandleBlur}
            placeholder="Wprowadź imie"
            keyboardType='default'
            style={styles.textInput}
            placeholderTextColor={isUserNameFocused ? 'transparent' : 'grey'}
          />
        </View>

        <Text>{'\n'}</Text>

        <View>
          <TextInput
            value={textUserLastName}
            onChangeText={setUserLastNameText}
            onFocus={userLastNameHandleFocus}
            onBlur={userLastNameHandleBlur}
            placeholder="Wprowadź nazwisko"
            keyboardType='default'
            style={styles.textInput}
            placeholderTextColor={isUserLastNameFocused ? 'transparent' : 'grey'}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => RegisterUser({ navigation }, textEmail, textPassword, textUserName, textUserLastName, dietTypeSelectedValue, setUserLogged)}>
          <Text style={styles.buttonText}>Zarejestruj się</Text>
        </TouchableOpacity>
      </ScrollView >
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0eb',
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

  textInput: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    fontWeight: 'normal',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
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

  mainViewStyles: {
    overflowY: 'scroll',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  stylePicker: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    // borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: 250,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
    fontWeight: 'normal',
    fontSize: 20,
    backgroundColor: '#f0f0eb',
  },
  separator: {
    margin: 10,
    height: 2,
    width: "95%",
    backgroundColor: 'grey',
  },

});


export default Registration;