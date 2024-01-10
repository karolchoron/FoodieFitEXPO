import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthorizationContext from '../components/AuthorizationContext';
import { UserDietTypeChange } from '../components/AuthorizationManagement';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import { get, ref, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

interface Ingredient {
    id: string;
    name: string;
    calories: number;
}

const DietPreferences = ({ navigation }: Props) => {

    const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);
    const [dietTypeSelectedValue, setDietTypeSelectedValue] = useState("Klasyczna");
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

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

        // pobieranie składników z bazy
        const ingredientsRef = ref(FIREBASE_DATABASE, 'ingredients');
        get(ingredientsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const fetchedIngredients = snapshot.val();
                // Konwersja obiektu na tablicę obiektów
                const ingredientsArray = Object.keys(fetchedIngredients).map(key => {
                    return {
                        id: key,
                        ...fetchedIngredients[key]
                    };
                });

                const ingredientNames = ingredientsArray.map(ingredient => ingredient.name);
                // console.log("Pobrane składniki:", ingredientNames); // Wypisywanie pobranych danych w konsoli
                // console.log("Pobrane składniki (tablica obiektów):", ingredientsArray);
                setIngredients(ingredientsArray);
            } else {
                console.log("Błąd, brak składników");
            }
        }).catch((error) => {
            console.error("Błąd pobierania składników: ", error);
        });
    }, []);

    // Pobranie z bazy danych informacji o preferencjach diety
    useEffect(() => {
        const fetchUserData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userId = user.uid;
                const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setDietTypeSelectedValue(userData.preferedTypeOfDiet);
                    setSelectedIngredients(userData.uwnatedProducts ? Object.keys(userData.uwnatedProducts) : []);
                } else {
                    console.log("Błąd, brak dostępnych danych");
                }
            } else {
                console.log("Błąd, użytkownik nie jest zalogowany.");
            }
        };

        fetchUserData();

        const fetchIngredients = async () => {
            const ingredientsRef = ref(FIREBASE_DATABASE, 'ingredients');
            const snapshot = await get(ingredientsRef);
            if (snapshot.exists()) {
                const fetchedIngredients = snapshot.val();
                const ingredientsArray = Object.keys(fetchedIngredients).map(key => {
                    return { id: key, ...fetchedIngredients[key] };
                });
                setIngredients(ingredientsArray);
            } else {
                console.log("Błąd, brak składników");
            }
        };

        fetchIngredients();
    }, []);


    // Obsługa wyboru składników STARY KOD
    // const handleSelectIngredient = (name: string) => {
    //     setSelectedIngredients(prevSelected => {
    //         if (prevSelected.includes(name)) {
    //             return prevSelected.filter(item => item !== name);
    //         } else {
    //             return [...prevSelected, name];
    //         }
    //     });
    // };

    // Obsługa wyboru składników
    const handleSelectIngredient = async (name: string) => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
            console.log("Użytkownik nie jest zalogowany");
            return;
        }

        await setSelectedIngredients(prevSelected => {
            const newSelected = prevSelected.includes(name) ?
                prevSelected.filter(item => item !== name) :
                [...prevSelected, name];

            // Aktualizuj listę niechcianych produktów w Firebase
            updateUnwantedProducts(user.uid, newSelected);
            return newSelected;
        });
    };

    // aktualizacja niechcianych skladnikow w bazie
    const updateUnwantedProducts = async (userId: string, products: string[]) => {
        const userRef = ref(FIREBASE_DATABASE, `users/${userId}/uwnatedProducts`);

        // Pobierz aktualną listę niechcianych produktów
        const currentProductsSnapshot = await get(userRef);
        const currentProducts = currentProductsSnapshot.exists() ? currentProductsSnapshot.val() : {};

        let updates: { [key: string]: any } = {};
        Object.keys(currentProducts).forEach(product => {
            if (!products.includes(product)) {
                updates[`${product}`] = null; // Ustawia wartosc na null, aby usunac produkt
            }
        });

        products.forEach(product => {
            if (!currentProducts[product]) {
                updates[`${product}`] = { name: product }; // Dodaje nowe produkty
            }
        });

        await update(userRef, updates);
    };

    const renderIngredient = ({ item }: { item: Ingredient }) => {
        const isSelected = selectedIngredients.includes(item.name);
        const backgroundColor = isSelected ? "red" : "lightgrey";

        return (
            <TouchableOpacity
                onPress={() => handleSelectIngredient(item.name)}
                style={[styles.ingredientItem, { backgroundColor }]}>
                <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View>
                <View style={styles.dataView}>
                    <Text style={styles.contentText}>
                        Wprowadź zmiany w preferencji swojej diety
                    </Text>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.dataView}>
                    <View>
                        <Text style={styles.contentText}>{'\n'}TYP DIETY</Text>
                        <Picker
                            mode="dropdown"
                            selectedValue={dietTypeSelectedValue}
                            style={styles.stylePicker}
                            onValueChange={(dietTypeValue, dietTypeIndex) => setDietTypeSelectedValue(dietTypeValue)}>
                            <Picker.Item label="Klasyczna" value="Klasyczna" />
                            <Picker.Item label="Wegetariańska" value="Wegetarianska" />
                        </Picker>
                    </View>
                    <Text>{'\n'}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => UserDietTypeChange(dietTypeSelectedValue)}>
                        <Text style={styles.buttonText}>Zmień typ diety</Text>
                    </TouchableOpacity>
                    <Text>{'\n'}</Text>
                </View>
                <View style={styles.separator}></View>
            </View>
            <Text style={styles.contentText}>
                Wybierz składniki, które chcesz {'\n'}
                wykluczyć ze swoich posiłków: {"\n"}
            </Text>
            <FlatList
                data={ingredients}
                renderItem={renderIngredient}
                keyExtractor={(item) => item.id}
                extraData={selectedIngredients}
            />
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
        // borderBottomWidth: 1,
        borderBottomWidth: 0,
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
    ingredientItem: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
    },
});

export default DietPreferences;