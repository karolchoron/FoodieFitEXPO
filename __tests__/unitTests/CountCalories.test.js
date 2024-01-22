import { CountCalories } from '../../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';

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

    // Wywołanie funkcji CountCalories z przykładowymi danymi
    const resultCalories = CountCalories(age, weight, height, sex, activityLevel, dietGoal);

    // ASSERT
    const expectedCalories = 2564; // Wartosc oczekiwana
    expect(resultCalories).toBe(expectedCalories);
  });
});