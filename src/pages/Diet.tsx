import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { get, ref, remove, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import database from '@react-native-firebase/database';
import logo from '../images/logo.png';
import alert from '../components/alert';
import { useDietManagement } from '../components/DietManagement';
import CaloriesContext from '../components/CaloriesContext';


interface Product {
    name: string;
    quantity: number;
    weight: number;
    calories: number;
}

interface Dish {
    name: string;
    totalCalories: number;
    products?: Record<string, Product>;
}

const Diet = () => {
    const [totalCalories, setTotalCalories] = useState(0);
    const { breakfast, dinner, supper, isDataLoaded, pickMealsBasedOnCalories } = useDietManagement();
    const [calories, setCalories] = useContext(CaloriesContext);
    const [caloriesPlanView, setCaloriesPlanView] = useState(false);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setCalories(userData.caloriesQuantity);
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

    useEffect(() => {
        pickMealsBasedOnCalories();
    }, []);

    useEffect(() => {
        // Obliczanie sumy kalorii dla śniadania, obiadu i kolacji
        let breakfastCalories = 0;
        let dinnerCalories = 0;
        let supperCalories = 0;

        if (breakfast) {
            breakfastCalories = Object.values(breakfast).reduce((acc, meal) => {
                return meal ? acc + meal.totalCalories : acc;
            }, 0);
        }

        if (dinner) {
            dinnerCalories = Object.values(dinner).reduce((acc, meal) => {
                return meal ? acc + meal.totalCalories : acc;
            }, 0);
        }

        if (supper) {
            supperCalories = Object.values(supper).reduce((acc, meal) => {
                return meal ? acc + meal.totalCalories : acc;
            }, 0);
        }

        setTotalCalories(breakfastCalories + dinnerCalories + supperCalories);
    }, [breakfast, dinner, supper]);

    const handlePressGenerateDietPlanButton = async () => {
        if (calories != 0) {
            // jezeli false to nie wyswietla dan, jezeli true to wyswietla. Czyli do wyswietlenia dan po klikneciu przycisku
            setCaloriesPlanView(true); 
            pickMealsBasedOnCalories();
        }
        else {
            alert("Uwaga", "Aby wygenerować plan diety należy najpierw obliczyć swoje zapotrzebowanie kaloryczne");
        }
    };

    const renderDishes = (dishes: Record<string, Dish>, nameOfTheMeal: string) => (
        <View style={styles.mealsList}>

            <Text style={styles.mealTitle}>{"\n"}{nameOfTheMeal}</Text>
            {Object.entries(dishes).map(([dishName, dishDetails]) => {
                if (!dishDetails) return null; // Sprawdzenie, czy szczegóły dania są dostępne

                return (
                    <View style={styles.mealContainer} key={dishName}>
                        <Text style={styles.mealName}>
                            {dishDetails.name}
                        </Text>
                        <Text style={styles.mealDescription}>
                            {dishDetails.totalCalories} kalorii
                        </Text>
                        {dishDetails.products && (
                            <View style={styles.mealsList}>
                                <Text style={styles.mealDataFontDescription}>{'\n'}Skład dania:</Text>
                                <Text>{'\n'}</Text>
                                {Object.entries(dishDetails.products).map(([productName, productDetails]) => {
                                    if (!productDetails) return null; // Sprawdzenie, czy szczegóły produktu są dostępne

                                    return (
                                        <View style={styles.mealsList} key={productName}>
                                            <Text style={styles.productTitle}>
                                                {productDetails.name}
                                            </Text>
                                            <Text style={styles.productDescription}>
                                                {productDetails.quantity && !productDetails.weight && <Text>Ilość: {productDetails.quantity}</Text>}
                                                {!productDetails.quantity && productDetails.weight && <Text>Waga: {productDetails.weight} g</Text>}
                                                <Text>, {productDetails.calories} kcal</Text>
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={styles.headerText}>PLAN DIETY</Text>
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={handlePressGenerateDietPlanButton}>
                        <Text style={styles.buttonText}>Wygeneruj plan diety</Text>
                    </TouchableOpacity>
                </View>

                <Text>{'\n'}</Text>

                {caloriesPlanView ? (
                    <>
                        <Text style={styles.TextYourCalories}>Twoje zapotrzebowanie kaloryczne: {calories}</Text>
                        <Text style={styles.TextYourCalories}>Suma dzisiejszych kalorii: {totalCalories}</Text>
                        {renderDishes(breakfast, "Śniadanie")}
                        {renderDishes(dinner, "Obiad")}
                        {renderDishes(supper, "Kolacja")}
                    </>
                ) : (
                    <Text style={styles.mealName}></Text>
                )}

            </ScrollView>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0eb',
        padding: 30,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionTextHeader: {
        fontWeight: 'normal',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },

    button: {
        alignItems: 'center',
        backgroundColor: 'lightgreen',
        padding: 12,
        borderRadius: 30,
        width: 'auto',
    },

    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },

    mealContainer: {
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        width: '90%',
    },
    mealTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },

    mealName: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },

    TextYourCalories: {
        fontSize: 16,
        textAlign: 'center',
        // fontWeight: 'bold',
        color: 'black',
    },

    mealDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
    },

    mealDataFontDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
    },

    productDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
    },

    productTitle: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },

    mealsList: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },

    separator: {
        margin: 10,
        height: 2,
        width: "95%",
        backgroundColor: 'grey',
    },

    buttonView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

});

export default Diet;