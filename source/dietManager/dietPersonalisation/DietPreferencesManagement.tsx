import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../data/FirebaseConfig';
import { get, ref, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import alert from '../../sharedUtils/alert';
import styles from './DietPreferencesStyles';
import '../../interfaces/IngredientInterface';

export const DietPreferencesManagement = () => {
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

    const UserDietTypeChange = (newDietTypeSelectedValue: string) => {
        const user = FIREBASE_AUTH.currentUser;
    
        if (user) {
            const userId = user.uid;
    
            // Aktualizacja preferowanego typu diety w bazie
            const updates: { [key: string]: any } = {};
            updates['/users/' + userId + '/preferedTypeOfDiet'] = newDietTypeSelectedValue;
    
            update(ref(FIREBASE_DATABASE), updates).then(() => {
                alert("Preferowany typ diety został zmieniony");
    
            }).catch((error) => {
                alert("Wystąpił błąd podczas zmiany preferowanego typu diety.");
            });
        } else {
            alert("Nie można zmienić preferowanego typu diety", "Użytkownik nie jest zalogowany.");
        }
    };

    return { dietTypeSelectedValue, setDietTypeSelectedValue, ingredients, selectedIngredients, renderIngredient, handleSelectIngredient , UserDietTypeChange};
};
