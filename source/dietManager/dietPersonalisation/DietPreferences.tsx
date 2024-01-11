import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
import { UserDietTypeChange } from './DietPreferencesController';
import { Picker } from '@react-native-picker/picker';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../data/FirebaseConfig';
import { get, ref, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import '../../interfaces/IngredientInterface';
import styles from './DietPreferencesStyles';

const DietPreferences = () => {
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

        // pobieranie składnikow z bazy
        const ingredientsRef = ref(FIREBASE_DATABASE, 'ingredients');
        get(ingredientsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const fetchedIngredients = snapshot.val();
                // Konwersja obiektu na tablice obiektow
                const ingredientsArray = Object.keys(fetchedIngredients).map(key => {
                    return {
                        id: key,
                        ...fetchedIngredients[key]
                    };
                });

                const ingredientNames = ingredientsArray.map(ingredient => ingredient.name);
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

            // Aktualizuj liste niechcianych produktow w Firebase
            updateUnwantedProducts(user.uid, newSelected);
            return newSelected;
        });
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

export default DietPreferences;