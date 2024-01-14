import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { Text, View } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import styles from './OneDayMealStyles';
import alert from '../../../sharedUtils/Alert';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';

export const OneDayMealController = () => {
    const [breakfast, setBreakfast] = useState<Record<string, Dish>>({});
    const [dinner, setDinner] = useState<Record<string, Dish>>({});
    const [supper, setSupper] = useState<Record<string, Dish>>({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const pickMealsBasedOnCalories = async () => {
        // zakres gorny i dolny kalorii dania
        const lowerLimit = 0.9;
        const upperLimit = 1.1;

        const isWithinCalorieRange = (mealCalories: number, targetCalories: number) =>
            mealCalories >= targetCalories * lowerLimit && mealCalories <= targetCalories * upperLimit;

        const pickRandomMeal = (mealOptions: Dish[], mealType: string): Record<string, Dish> => {
            const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
            return { [mealType]: randomMeal };
        };

        try {
            // Pobranie aktualnie zalogowanego użytkownika
            const user = FIREBASE_AUTH.currentUser;
            if (!user) {
                console.log("Użytkownik nie jest zalogowany");
                return null;
            }

            // Pobranie preferowanego typu diety użytkownika
            const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
                console.log("Brak danych użytkownika");
                return null;
            }
            const userData = userSnapshot.val();
            const userDietType = userData.preferedTypeOfDiet;

            // Pobranie niechcianych produktow, czyli takich ktorych uzytkownik nie chce miec w posiłkach:
            const unwantedProducts = userData.uwnatedProducts ? Object.keys(userData.uwnatedProducts) : [];

            // pobranie kalorii uzytkownika z bazy danych
            const userCaloriesQuantity = userData.caloriesQuantity;

            // na sniadanie oraz kolacje 30% dziennego zapotrzebowania kalorycznego. Na obiad 40% zapotrzebowania
            const targetBreakfastCalories = userCaloriesQuantity * 0.30;
            const targetDinnerCalories = userCaloriesQuantity * 0.40;
            const targetSupperCalories = userCaloriesQuantity * 0.30;

            // Wybranie typu diety do generowania posiłków
            let mealsRef;
            if (userDietType == "Klasyczna") {
                mealsRef = ref(FIREBASE_DATABASE, '/dishes/all');
            } else {
                mealsRef = ref(FIREBASE_DATABASE, '/dishes/wegetarian');
            }

            const filterMeals = (mealsData: Record<string, Dish>, targetCalories: number) => {
                return Object.values(mealsData)
                    .filter(meal => isWithinCalorieRange(meal.totalCalories, targetCalories))
                    .filter(meal => {
                        // Najpierw sprawdza, czy 'products' istnieje w 'meal'
                        if (!meal.products) {
                            return false; // Jeśli 'products' nie istnieje, filtruj danie
                        }

                        // Sprawdzanie, czy w danym daniu NIE ma produktu o nazwie 'excludedProductName'
                        const productNames = Object.values(meal.products).map(product => product.name);
                        return !unwantedProducts.some(unwanted => productNames.includes(unwanted));
                    });
            };

            const response = await get(mealsRef);
            if (response.exists()) {
                const data = response.val();
                const breakfastData = data.breakfast;
                const dinnerData = data.dinner;
                const supperData = data.supper;

                const breakfastOptions = filterMeals(breakfastData, targetBreakfastCalories);
                setBreakfast(pickRandomMeal(breakfastOptions, 'breakfast'));

                const dinnerOptions = filterMeals(dinnerData, targetDinnerCalories);
                setDinner(pickRandomMeal(dinnerOptions, 'dinner'));

                const supperOptions = filterMeals(supperData, targetSupperCalories);
                setSupper(pickRandomMeal(supperOptions, 'supper'));

                setIsDataLoaded(true);
            } else {
                setIsDataLoaded(false);
                alert("Brak danych!");
            }
        } catch (error) {
            setIsDataLoaded(false);
            alert("Błąd pobierania danych!");
        }
    };

    const renderDishes = (dishes: Record<string, Dish>, nameOfTheMeal: string) => (
        <View style={styles.mealsList}>

            <Text style={styles.mealTitle}>{"\n"}{nameOfTheMeal}</Text>
            {Object.entries(dishes).map(([dishName, dishDetails]) => {
                if (!dishDetails) return null; // Sprawdzenie czy szczegoly dania sa dostepne

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
                                    if (!productDetails) return null; // Sprawdzenie czy szczegoly produktu są dostepne

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

    return { breakfast, dinner, supper, isDataLoaded, renderDishes, pickMealsBasedOnCalories };
};