import { pickMealsFor7Days } from '../../source/applicationFunctionalities/mealPlanManager/sevenDaysMeal/Diet7DaysController';
import { get } from 'firebase/database';

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
}));


jest.mock('../../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: { uid: 'testUserId' }
    },
    FIREBASE_DATABASE: {},
}));


jest.mock('../../source/other/Alert', () => jest.fn());

get.mockImplementation((queryRef) => {
    if (queryRef) {
        return Promise.resolve({
            exists: () => true,
            val: () => mockMealData,
        });
    } else {
        return Promise.resolve({
            exists: () => false,
        });
    }
});

// Symulacja danych zwracanych przez Firebase Database
const mockMealData = {
    breakfast: { /* Dane śniadań */ },
    dinner: { /* Dane obiadów */ },
    supper: { /* Dane kolacji */ },
};

// Symulacja odpowiedzi Firebase Database
get.mockImplementation((ref) => Promise.resolve({
    exists: () => true,
    val: () => mockMealData,
}));


jest.mock('firebase/database', () => ({
    ref: jest.fn(),
    get: jest.fn((ref) => {
        // Symulacja danych użytkownika
        if (ref.toString().endsWith('/users/testUserId')) {
            return Promise.resolve({
                exists: () => true,
                val: () => ({
                    preferedTypeOfDiet: 'Klasyczna',
                    caloriesQuantity: 2500,
                    unwantedProducts: {}, // Dodaj symulację niechcianych produktów, jeśli to konieczne
                }),
            });
        }

        // Symulacja danych o posiłkach
        if (ref.toString().includes('/dishes/classic')) {
            return Promise.resolve({
                exists: () => true,
                val: () => ({
                    breakfast: { /* Symulacja danych śniadań */ },
                    dinner: { /* Symulacja danych obiadów */ },
                    supper: { /* Symulacja danych kolacji */ },
                }),
            });
        }
        return Promise.reject(new Error('Nieznana referencja'));
    }),
}));

describe('Diet7DaysController', () => {
    it('generates a 7-day meal plan based on user preferences', async () => {
        const mealPlan = await pickMealsFor7Days();

        console.log(mealPlan);

        expect(mealPlan).toHaveLength(7); // Sprawdza, czy plan posiłków zawiera wygenerowane posilki na 7 dni
    });
});
