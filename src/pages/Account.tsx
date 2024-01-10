import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TextInput, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import alert from '../components/alert';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthorizationContext from '../components/AuthorizationContext';
import { UserSingOut, UserPasswordChange, DeleteAccount, UserNameChange, UserDietTypeChange } from '../components/AuthorizationManagement';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import { get, ref, remove, set, update, onValue, off } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};


const Account = ({ navigation }: Props) => {

    const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);

    const [textNewPassword, setNewPasswordText] = useState('');
    const [isNewPasswordFocused, setNewPasswordIsFocused] = useState(false);
    const newPasswordHandleFocus = () => setNewPasswordIsFocused(true);
    const newPasswordHandleBlur = () => setNewPasswordIsFocused(false);

    const [textOldPassword, setOldPasswordText] = useState('');
    const [isOldPasswordFocused, setOldPasswordIsFocused] = useState(false);
    const oldPasswordHandleFocus = () => setOldPasswordIsFocused(true);
    const oldPasswordHandleBlur = () => setOldPasswordIsFocused(false)

    const [textName, setName] = useState('');
    const [isNameFocused, setNameIsFocused] = useState(false);
    const nameHandleFocus = () => setNameIsFocused(true);
    const nameHandleBlur = () => setNameIsFocused(false)

    const [textLastName, setLastName] = useState('');
    const [isLastNameFocused, setLastNameIsFocused] = useState(false);
    const lastNameHandleFocus = () => setLastNameIsFocused(true);
    const lastNameHandleBlur = () => setLastNameIsFocused(false)

    const [dietTypeSelectedValue, setDietTypeSelectedValue] = useState("Klasyczna");

    // pobranie z bazy danych informacji o zapotrzebowaniu kalorycznym dla zalogowanego uzytkownika
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setDietTypeSelectedValue(userData.preferedTypeOfDiet);
                    } else {
                        console.log("Błąd, brak dostępnych danych");
                    }
                }).catch((error) => {
                    console.error("Błąd pobierania danych: ", error);
                });
            } else {
                console.log("Błąd, użytkownik nie jest zalogowany.");
            }
        });
    }, []);


    const handleDeleteAccount = () => {
        alert(
            "Usuń konto",
            "Czy na pewno chcesz usunąć konto? Zmiany będą nieodwracalne!",
            [
                {
                    text: "Nie",
                    style: "cancel"
                },
                {
                    text: "Tak", onPress: () => DeleteAccount({ navigation }, setUserLogged)
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.dataView}>
                    {/* <Text style={styles.headerText}>
                        {'\n'}KONTO
                    </Text> */}

                    <Text style={styles.contentText}>
                        Wprowadź dane, które chcesz zmienić
                    </Text>
                </View>

                <View style={styles.separator}></View>

                <View style={styles.dataView}>
                    <View>
                        {/* <Text style={styles.contentText}>
                            Nowe imie:
                        </Text> */}
                        <TextInput
                            value={textName}
                            onChangeText={setName}
                            onFocus={nameHandleFocus}
                            onBlur={nameHandleBlur}
                            placeholder="Wprowadź imie"
                            secureTextEntry={false}
                            style={styles.textInput}
                            placeholderTextColor={isNameFocused ? 'transparent' : 'grey'}
                        />
                    </View>

                    <Text>{'\n'}</Text>

                    <View>
                        {/* <Text style={styles.contentText}>
                            Nowe nazwisko:
                        </Text> */}
                        <TextInput
                            value={textLastName}
                            onChangeText={setLastName}
                            onFocus={lastNameHandleFocus}
                            onBlur={lastNameHandleBlur}
                            placeholder="Wprowadź nazwisko"
                            secureTextEntry={false}
                            style={styles.textInput}
                            placeholderTextColor={isLastNameFocused ? 'transparent' : 'grey'}
                        />
                    </View>

                    <Text>{'\n'}</Text>

                    <TouchableOpacity style={styles.button} onPress={() =>
                        UserNameChange(textName, textLastName)}>
                        <Text style={styles.buttonText}>Zmień imie i nazwisko</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator}></View>

                <View style={styles.dataView}>
                    <View>
                        {/* <Text style={styles.contentText}>
                            Aktualne hasło:
                        </Text> */}
                        <TextInput
                            value={textOldPassword}
                            onChangeText={setOldPasswordText}
                            onFocus={oldPasswordHandleFocus}
                            onBlur={oldPasswordHandleBlur}
                            placeholder="Wprowadź aktualne hasło"
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholderTextColor={isOldPasswordFocused ? 'transparent' : 'grey'}
                        />
                    </View>

                    <Text>{'\n'}</Text>

                    <View>
                        {/* <Text style={styles.contentText}>
                            Nowe hasło:
                        </Text> */}
                        <TextInput
                            value={textNewPassword}
                            onChangeText={setNewPasswordText}
                            onFocus={newPasswordHandleFocus}
                            onBlur={newPasswordHandleBlur}
                            placeholder="Wprowadź nowe hasło"
                            secureTextEntry={true}
                            style={styles.textInput}
                            placeholderTextColor={isNewPasswordFocused ? 'transparent' : 'grey'}
                        />
                    </View>

                    <Text>{'\n'}</Text>

                    <TouchableOpacity style={styles.button} onPress={() =>
                        UserPasswordChange(textOldPassword, textNewPassword)}>
                        <Text style={styles.buttonText}>Zmień hasło</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator}></View>

                <View style={styles.logOutAndDeleteView}>
                    <TouchableOpacity style={styles.button} onPress={() => UserSingOut({ navigation }, setUserLogged)}>
                        <Text style={styles.buttonText}>Wyloguj się</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonDelete} onPress={handleDeleteAccount}>
                        <Text style={styles.buttonDeleteText}>Usuń konto</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0eb',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },

    headerContentText: {
        fontWeight: 'bold',
        fontSize: 22,
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
        padding: 12,
        borderRadius: 30,
        width: 'auto',
    },

    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
    },

    buttonDelete: {
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 30,
        width: 'auto',
    },


    buttonDeleteText: {
        color: 'white',
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

    dataView: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    logOutAndDeleteView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    separator: {
        margin: 10,
        height: 2,
        width: "95%",
        backgroundColor: 'grey',
    },

    stylePicker: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
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
});

export default Account;