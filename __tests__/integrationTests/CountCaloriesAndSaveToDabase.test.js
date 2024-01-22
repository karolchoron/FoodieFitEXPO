import { CountCalories } from '../../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';
import { ref, set } from 'firebase/database';

// Mockowanie Firebase Auth
jest.mock('../../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: { uid: 'testUserId' } // Mockowanie zalogowanego użytkownika
    },
    FIREBASE_DATABASE: {}
}));

// Mockowanie alertow
jest.mock('../../source/other/Alert', () => jest.fn());

// // Mockowanie Firebase Database
jest.mock('firebase/database', () => ({
    ref: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue('Mocked response'), // Symuluje pomyslne ustawienie danych
    get: jest.fn(() => Promise.resolve({
        exists: jest.fn(() => true),
        val: jest.fn(() => ({ caloriesQuantity: 1500 })) // Przykladowe dane zwracane przez baze
    }))
}));

describe('CountCalories Integration Test', () => {
    it('should update the user\'s calorie count correctly and return the calculated calories', async () => {
        // GIVEN
        const age = "24";
        const weight = "75";
        const height = "180";
        const sex = 'Mezczyzna';
        const activityLevel = 'sredniaAktywnosc';
        const dietGoal = 'utrzymacWage';

        // Symulacja spodziewanej wartości kalorii
        const expectedCalories = 2564;

        // WHEN
        await CountCalories(age, weight, height, sex, activityLevel, dietGoal);

        //THEN
        // Sprawdzenie, czy dane zostaly poprawnie zaktualizowane w bazie danych Firebase
        expect(ref).toHaveBeenCalledWith(expect.anything(), `users/testUserId`);
        expect(set).toHaveBeenCalledWith(undefined, {
            caloriesQuantity: expectedCalories
        });
    });
});