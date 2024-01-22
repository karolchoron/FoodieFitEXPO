import { CountCalories } from '../../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';

describe('CountCalories function', () => {
  it('should correctly calculate the caloric needs', () => {

    const age = 24;
    const weight = 75;
    const height = 180;
    const sex = 'Mezczyzna';
    const activityLevel = 'sredniaAktywnosc';
    const dietGoal = 'utrzymacWage';

    // Wywołanie funkcji CountCalories z przykladowymi danymi
    const resultCalories = CountCalories(age, weight, height, sex, activityLevel, dietGoal);

    // Wartosc oczekiwana
    const expectedCalories = 2564;
    expect(resultCalories).toBe(expectedCalories);
  });
});