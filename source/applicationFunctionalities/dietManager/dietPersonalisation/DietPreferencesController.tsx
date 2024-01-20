import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import { get, ref, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import alert from '../../../other/Alert';
import styles from './DietPreferencesStyles';
import '../../../interfaces/ProductInterface';

export const DietPreferencesController = () => {
    const [dietTypeSelectedValue, setDietTypeSelectedValue] = useState("Klasyczna");
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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
                        return null;
                        // console.log("Błąd, brak dostępnych danych");
                    }
                }).catch((error) => {
                    console.error(error);
                    return null;
                });
            } else {
                return null;
                //console.log("Błąd, użytkownik nie jest zalogowany.");
            }
        });

        // pobieranie składnikow z bazy
        const productsRef = ref(FIREBASE_DATABASE, 'products');
        get(productsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const fetchedProducts = snapshot.val();
                // Konwersja obiektu na tablice obiektow
                const productsArray = Object.keys(fetchedProducts).map(key => {
                    return {
                        id: key,
                        ...fetchedProducts[key]
                    };
                });

                setProducts(productsArray);
            } else {
                return null;
                // console.log("Błąd, brak składników");
            }
        }).catch((error) => {
            console.error(error);
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
                    setSelectedProducts(userData.uwnatedProducts ? Object.keys(userData.uwnatedProducts) : []);
                } else {
                    return null;
                    // console.log("Błąd, brak dostępnych danych");
                }
            } else {
                return null;
                // console.log("Błąd, użytkownik nie jest zalogowany.");
            }
        };

        fetchUserData();

        const fetchProducts = async () => {
            const productsRef = ref(FIREBASE_DATABASE, 'products');
            const snapshot = await get(productsRef);
            if (snapshot.exists()) {
                const fetchedProducts = snapshot.val();
                const productsArray = Object.keys(fetchedProducts).map(key => {
                    return { id: key, ...fetchedProducts[key] };
                });
                setProducts(productsArray);
            } else {
                console.log("Błąd, brak składników");
            }
        };

        fetchProducts();
    }, []);

    // aktualizacja niechcianych skladnikow w bazie
    const updateUnwantedProducts = async (userId: string, products: string[]) => {
        const userRef = ref(FIREBASE_DATABASE, `users/${userId}/uwnatedProducts`);

        // Pobierz aktualną listę niechcianych produktów
        const currentProductsSnapshot = await get(userRef);
        const currentProducts = currentProductsSnapshot.exists() ? currentProductsSnapshot.val() : {};

        // Usun niechciany produkt z bazy
        let updates: { [key: string]: any } = {};
        Object.keys(currentProducts).forEach(product => {
            if (!products.includes(product)) {
                updates[`${product}`] = null; // Ustawia wartosc na null, aby usunac produkt
            }
        });

        // Dodaj niechciany produkt do bazy
        products.forEach(product => {
            if (!currentProducts[product]) {
                updates[`${product}`] = { name: product }; // Dodaje nowe produkty
            }
        });

        await update(userRef, updates);
    };

    // Obsługa wyboru składników
    const handleSelectProduct = async (name: string) => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) {
            //console.log("Użytkownik nie jest zalogowany");
            return null;
        }

        await setSelectedProducts(prevSelected => {
            const newSelected = prevSelected.includes(name) ?
                prevSelected.filter(item => item !== name) :
                [...prevSelected, name];

            // Aktualizuj liste niechcianych produktow w Firebase
            updateUnwantedProducts(user.uid, newSelected);
            return newSelected;
        });
    };

    const renderProduct = ({ item }: { item: Product }) => {
        const isSelected = selectedProducts.includes(item.name);
        const backgroundColor = isSelected ? "red" : "lightgrey";

        return (
            <TouchableOpacity
                onPress={() => handleSelectProduct(item.name)}
                style={[styles.productItem, { backgroundColor }]}>
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

    return { dietTypeSelectedValue, setDietTypeSelectedValue, products, selectedProducts, renderProduct, handleSelectProduct, UserDietTypeChange };
};