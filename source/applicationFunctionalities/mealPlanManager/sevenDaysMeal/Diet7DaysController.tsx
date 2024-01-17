import { ref, get } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';

export const Diet7DaysController = () => {

    // zakres gorny i dolny kalorii dania
    const lowerLimit = 0.9;
    const upperLimit = 1.1;

    // sprawdza danie w danym zakresie kalorii
    const isWithinCalorieRange = (mealCalories: number, targetCalories: number) =>
        mealCalories >= targetCalories * lowerLimit && mealCalories <= targetCalories * upperLimit;

    // wybiera losowy posilek
    const pickRandomMeal7Days = (mealOptions: Dish[], mealType: string): Dish | null => {
        if (mealOptions.length === 0) {
            return null;
        }
        const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
        return randomMeal;
    };

    // filtruje dania
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

    const pickMealsFor7Days = async () => {
        const weekPlan: { breakfast: Dish | null, dinner: Dish | null, supper: Dish | null }[] = [];

        // wybor posilkow na 7 dni
        for (let i = 0; i < 7; i++) {
            const dayPlan = {
                breakfast: null as Dish | null,
                dinner: null as Dish | null,
                supper: null as Dish | null
            };

            // Pobranie danych uzytkownika i niechcianych produktow
            const user = FIREBASE_AUTH.currentUser;
            if (!user) {
                console.log("Użytkownik nie jest zalogowany");
            }

            const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
                console.log("Brak danych użytkownika");
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

            // Pobieranie i filtracja posiłkow
            const response = await get(mealsRef);
            if (!response.exists()) {
                console.log("Brak danych o posiłkach");
                continue;
            }
            const data = response.val();

            // Filtracja i wybor posiłow
            dayPlan.breakfast = pickRandomMeal7Days(filterMeals7Days(data.breakfast, targetBreakfastCalories, unwantedProducts), 'breakfast');
            dayPlan.dinner = pickRandomMeal7Days(filterMeals7Days(data.dinner, targetDinnerCalories, unwantedProducts), 'dinner');
            dayPlan.supper = pickRandomMeal7Days(filterMeals7Days(data.supper, targetSupperCalories, unwantedProducts), 'supper');

            weekPlan.push(dayPlan);
        }

        return weekPlan;
    };

    return { pickMealsFor7Days };
};