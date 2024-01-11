import React, { useState, useContext } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { RootStackParamList } from '../../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthorizationContext from '../../sharedUtils/AuthorizationContext';
import { RegisterUser } from './RegisterController';
import { Picker } from '@react-native-picker/picker';
import styles from './RegistrationStyles';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};

const Registration = ({ navigation }: Props) => {
  const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);

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

export default Registration;