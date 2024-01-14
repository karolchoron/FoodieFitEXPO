import { ref, get, update } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';

export const MealOfTheDayController = () => {
    const generateMealOfTheDay = async (): Promise<Dish | null> => {

        // zakres gorny i dolny kalorii dania
        const lowerLimit = 0.9;
        const upperLimit = 1.1;

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

    return { generateMealOfTheDay };
};