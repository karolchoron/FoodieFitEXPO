import React, { useState, useEffect, useContext } from 'react';
import { Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import alert from '../../../sharedUtils/Alert';
import { OneDayMealController } from './OneDayMealController';
import CaloriesContext from '../../../sharedUtils/CaloriesContext';
import styles from './OneDayMealStyles';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';

const OneDayMeal = () => {
    const [totalCalories, setTotalCalories] = useState(0);
    const { breakfast, dinner, supper, renderDishes, pickMealsBasedOnCalories } = OneDayMealController();
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

    useEffect(() => {
        pickMealsBasedOnCalories();
    }, []);

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

    // const renderDishes = (dishes: Record<string, Dish>, nameOfTheMeal: string) => (
    //     <View style={styles.mealsList}>

    //         <Text style={styles.mealTitle}>{"\n"}{nameOfTheMeal}</Text>
    //         {Object.entries(dishes).map(([dishName, dishDetails]) => {
    //             if (!dishDetails) return null; // Sprawdzenie, czy szczegóły dania są dostępne

    //             return (
    //                 <View style={styles.mealContainer} key={dishName}>
    //                     <Text style={styles.mealName}>
    //                         {dishDetails.name}
    //                     </Text>
    //                     <Text style={styles.mealDescription}>
    //                         {dishDetails.totalCalories} kalorii
    //                     </Text>
    //                     {dishDetails.products && (
    //                         <View style={styles.mealsList}>
    //                             <Text style={styles.mealDataFontDescription}>{'\n'}Skład dania:</Text>
    //                             <Text>{'\n'}</Text>
    //                             {Object.entries(dishDetails.products).map(([productName, productDetails]) => {
    //                                 if (!productDetails) return null; // Sprawdzenie, czy szczegóły produktu są dostępne

    //                                 return (
    //                                     <View style={styles.mealsList} key={productName}>
    //                                         <Text style={styles.productTitle}>
    //                                             {productDetails.name}
    //                                         </Text>
    //                                         <Text style={styles.productDescription}>
    //                                             {productDetails.quantity && !productDetails.weight && <Text>Ilość: {productDetails.quantity}</Text>}
    //                                             {!productDetails.quantity && productDetails.weight && <Text>Waga: {productDetails.weight} g</Text>}
    //                                             <Text>, {productDetails.calories} kcal</Text>
    //                                         </Text>
    //                                     </View>
    //                                 );
    //                             })}
    //                         </View>
    //                     )}
    //                 </View>
    //             );
    //         })}
    //     </View>
    // );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={styles.headerText}>JEDNODNIOWY PLAN DIETY</Text>
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={handlePressGenerateDietPlanButton}>
                        <Text style={styles.buttonText}>Wygeneruj jednodniowy plan diety</Text>
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

export default OneDayMeal;