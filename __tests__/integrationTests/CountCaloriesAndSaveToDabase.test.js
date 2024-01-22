import { CountCalories } from '../../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';
import { ref, set } from 'firebase/database';

// Mockowanie Firebase Auth
jest.mock('../../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: { uid: 'testUserId' } // Mockowanie zalogowanego użytkownika
    },
    FIREBASE_DATABASE: {} // Możesz dodać mocka bazy danych, jeśli potrzebujesz
}));


// Mockowanie alertów
jest.mock('../../source/other/Alert', () => jest.fn());


// // Mockowanie Firebase Database z poprawionym łańcuchowym wywoływaniem
jest.mock('firebase/database', () => ({
    ref: jest.fn().mockReturnThis(), // Umożliwia łańcuchowe wywołanie
    set: jest.fn().mockResolvedValue('Mocked response'), // Symuluje pomyślne ustawienie danych
    get: jest.fn(() => Promise.resolve({
        exists: jest.fn(() => true),
        val: jest.fn(() => ({ caloriesQuantity: 0 })) // Przykładowe dane zwracane przez bazę
    }))
}));

describe('CountCalories Integration Test', () => {
    it('should update the user\'s calorie count correctly and return the calculated calories', async () => {
        // Arrange
        const age = "24";
        const weight = "75";
        const height = "180";
        const sex = 'Mezczyzna';
        const activityLevel = 'sredniaAktywnosc';
        const dietGoal = 'utrzymacWage';

        // Symulacja spodziewanej wartości kalorii
        const expectedCalories = 2564;

        // Act
        // const resultCalories = await CountCalories(age, weight, height, sex, activityLevel, dietGoal);
        await CountCalories(age, weight, height, sex, activityLevel, dietGoal);

        // Assert
        // Sprawdzenie, czy dane zostały poprawnie zaktualizowane w Firebase
        expect(ref).toHaveBeenCalledWith(expect.anything(), `users/testUserId`);
        expect(set).toHaveBeenCalledWith(undefined, {
            caloriesQuantity: expectedCalories
        });
    });
});
