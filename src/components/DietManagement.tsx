import { useState, useContext } from 'react';
import { ref, get, update } from 'firebase/database';
import alert from '../components/alert';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import CaloriesContext from './CaloriesContext';

interface Product {
    name: string;
    quantity: number;
    weight: number;
    calories: number;
}

interface Dish {
    id: number;
    name: string;
    dietType: string;
    totalCalories: number;
    products?: Record<string, Product>;
}

export const useDietManagement = () => {
    const [calories] = useContext(CaloriesContext);
    const [theDayDish, setTheDayDish] = useState<Record<string, Dish>>({});
    const [breakfast, setBreakfast] = useState<Record<string, Dish>>({});
    const [dinner, setDinner] = useState<Record<string, Dish>>({});
    const [supper, setSupper] = useState<Record<string, Dish>>({});
    const [breakfast7, set7Breakfast] = useState<Record<string, Dish>>({});
    const [dinner7, set7Dinner] = useState<Record<string, Dish>>({});
    const [supper7, set7Supper] = useState<Record<string, Dish>>({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [mealOfTheDay, setMealOfTheDay] = useState<Record<string, Dish>>({});

    const generateMealOfTheDay = async (): Promise<Dish | null> => {

        // zakres gorny i dolny kalorii dania
        const lowerLimit = 0.85;
        const upperLimit = 1.25;

        const pickRandomMeal = (mealOptions: Dish[]): Dish | null => {
            if (mealOptions.length === 0) return null;
            return mealOptions[Math.floor(Math.random() * mealOptions.length)];
        }

        const isWithinCalorieRange = (mealCalories: number, targetCalories: number) =>
            mealCalories >= targetCalories * lowerLimit && mealCalories <= targetCalories * upperLimit;

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
            let userDietType = userData.preferedTypeOfDiet;
            let userMealID = userData.idOfGeneratedTheDayDish;
            const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
            let mealsRef;
            // niechcaine produkty z listy bazy danych
            const unwantedProducts = userData.uwnatedProducts ? Object.keys(userData.uwnatedProducts) : [];

            // Jezeli data jest pusta (oznacza to, ze uzytkownik dopiero co zostal utworzony)
            // jezeli data jest pusta albo jezeli data jest inna niz aktualna data
            // to wtedy program generuje danie dnia
            // jezeli aktualna data jest taka sama jak data generowania dania
            // to program pobiera danie z bazy danych o id ktore jest w bazie danych
            // i zwraca te danie
            if (userData.dateOfGenerateTheDayDish == "" || userData.dateOfGenerateTheDayDish != currentDate) {
                // wybranie typu diety do generowania
                if (userDietType == "klasyczna") {
                    mealsRef = ref(FIREBASE_DATABASE, '/dishes/all/dinner');
                }
                else {
                    mealsRef = ref(FIREBASE_DATABASE, '/dishes/wegetarian/dinner');
                }

                const response = await get(mealsRef);
                if (!response.exists()) {
                    console.log("Brak danych!");
                    return null;
                }

                // pobranie kalorii uzytkownika z bazy danych
                const userCaloriesQuantity = userData.caloriesQuantity;

                let targetDinnerCalories = 0;
                // Przy pierwszym logowaniu nie ma danych odnosnie obliczonych kalorii. 
                // Dlatego pierwsze danie dnia bazuje na przyblizonej wartosci = 2500 kalorii na dzien.
                // Kolejne dania dnia sa generowane na podstawie obliczonych kalorii.
                if (userCaloriesQuantity == 0) {
                    targetDinnerCalories = 2200 * 0.40;
                }
                else {
                    //  Na obiad 40% zapotrzebowania kalorycznego
                    targetDinnerCalories = userCaloriesQuantity * 0.40;
                }

                const dinnerData: Record<string, Dish> = response.val();
                // filtorwanie dania zeby nie zawieralo niechcianych produktow
                const dinnerOptions = Object.values(dinnerData)
                    .filter(meal => isWithinCalorieRange(meal.totalCalories, targetDinnerCalories))
                    .filter(meal => {
                        if (!meal.products) {
                            return false;
                        }
                        const productNames = Object.values(meal.products).map(product => product.name);
                        return !unwantedProducts.some(unwanted => productNames.includes(unwanted));
                    });

                // tutaj generuje randomowe danie dnia i uzupelnia dane w bazie, ze juz danie na ten dzien zostalo wygenerowane
                const selectedDish = pickRandomMeal(dinnerOptions);
                if (selectedDish) {
                    // Aktualizacja id dania oraz daty dania dnia
                    update(userRef, { dateOfGenerateTheDayDish: currentDate });
                    update(userRef, { idOfGeneratedTheDayDish: selectedDish.id });

                    // zwaraca wygenerowane danie dnia
                    return selectedDish;
                } else {
                    console.log("Bład w wygenerowaniu dania.");
                    return null;
                }
            }
            else {
                // jezeli aktualna data jest taka sama jak data w bazie, to pobiera dane o ID wygenerowanego dania z bazy
                // potem pobiera danie z bazy
                // i zwraca
                if (userDietType === "klasyczna") {
                    mealsRef = ref(FIREBASE_DATABASE, `/dishes/all/dinner`);
                } else {
                    mealsRef = ref(FIREBASE_DATABASE, `/dishes/wegetarian/dinner`);
                }

                const response = await get(mealsRef);
                if (!response.exists()) {
                    console.log("Brak danych!");
                    return null;
                }

                const dinnerData: Record<string, Dish> = response.val();
                const specificDish = dinnerData[userMealID];

                return specificDish; // Zwraca obiekt typu Dish - czyli pobrane Danie z bazy danych
            }

        } catch (error) {
            console.error("Błąd pobierania danych:", error);
            return null;
        }
    };


    const pickMealsBasedOnCalories = async () => {

        // zakres gorny i dolny kalorii dania
        const lowerLimit = 0.85;
        const upperLimit = 1.25;

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
    }

    const pickMealsFor7Days = async () => {
        const weekPlan: { breakfast: Dish | null, dinner: Dish | null, supper: Dish | null }[] = [];

        for (let i = 0; i < 7; i++) {
            // Dla każdego dnia tygodnia wybieramy posiłki
            const dayPlan = {
                breakfast: null as Dish | null,
                dinner: null as Dish | null,
                supper: null as Dish | null
            };

            // Pobranie danych użytkownika i niechcianych produktów (zakładając, że ta logika pozostaje taka sama)
            const user = FIREBASE_AUTH.currentUser;
            if (!user) {
                alert("user nie zalogowany")
                console.log("Użytkownik nie jest zalogowany");
                continue; // Przechodzimy do następnego dnia, jeśli użytkownik nie jest zalogowany
            }

            const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
                console.log("Brak danych użytkownika");
                continue; // Przechodzimy do następnego dnia, jeśli brak danych użytkownika
            }
            const userData = userSnapshot.val();
            const userDietType = userData.preferedTypeOfDiet;
            const unwantedProducts = userData.unwantedProducts ? Object.keys(userData.unwantedProducts) : [];

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

            // Pobieranie i filtracja posiłków
            const response = await get(mealsRef);
            if (!response.exists()) {
                console.log("Brak danych o posiłkach");
                continue; // Przechodzimy do następnego dnia, jeśli brak danych o posiłkach
            }
            const data = response.val();

            // Filtracja i wybór posiłków
            dayPlan.breakfast = pickRandomMeal7Days(filterMeals7Days(data.breakfast, targetBreakfastCalories, unwantedProducts), 'breakfast');
            dayPlan.dinner = pickRandomMeal7Days(filterMeals7Days(data.dinner, targetDinnerCalories, unwantedProducts), 'dinner');
            dayPlan.supper = pickRandomMeal7Days(filterMeals7Days(data.supper, targetSupperCalories, unwantedProducts), 'supper');

            weekPlan.push(dayPlan);
        }

        return weekPlan;
    };

    // Funkcje pomocnicze (zakładając, że pozostają bez zmian)
    const isWithinCalorieRange = (mealCalories: number, targetCalories: number) =>
        mealCalories >= targetCalories * 0.85 && mealCalories <= targetCalories * 1.25;

    const pickRandomMeal7Days = (mealOptions: Dish[], mealType: string): Dish | null => {
        if (mealOptions.length === 0) {
            return null;
        }
        const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
        return randomMeal; // Zakładamy, że randomMeal jest typu Dish
    };

    const filterMeals7Days = (mealsData: Record<string, Dish>, targetCalories: number, unwantedProducts: string[]): Dish[] => {
        return Object.values(mealsData)
            .filter(meal => isWithinCalorieRange(meal.totalCalories, targetCalories))
            .filter(meal => {
                // Sprawdzanie, czy posiłek zawiera niechciane produkty
                if (!meal.products) return true;

                const productNames = Object.values(meal.products).map(product => product.name);
                return !unwantedProducts.some(unwanted => productNames.includes(unwanted));
            });
    };

    return { theDayDish, breakfast, dinner, supper, breakfast7, dinner7, supper7, isDataLoaded, pickMealsBasedOnCalories, generateMealOfTheDay, pickMealsFor7Days, mealOfTheDay };
};