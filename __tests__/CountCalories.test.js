import { CountCalories } from '../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';

// TEST AAA
// Arrange - Przygotwanie
// Act - Dzialanie
// Assert - Aseracja (Sprawdzanie)

describe('CountCalories function', () => {
  it('should correctly calculate the caloric needs', () => {

    // ARRANGE
    const age = 24;
    const weight = 75;
    const height = 180;
    const sex = 'Mezczyzna';
    const activityLevel = 'sredniaAktywnosc';
    const dietGoal = 'utrzymacWage';

    // ACT
    const mockSetCalories = jest.fn();

    // Wywołanie funkcji CountCalories z przykładowymi danymi i mockiem setCalories
    CountCalories(age, weight, height, sex, activityLevel, dietGoal, mockSetCalories);

    // ASSERT
    const expectedCalories = 2564; // Wartosc oczekiwana
    expect(mockSetCalories).toHaveBeenCalledWith(expectedCalories);
  });
});
