import { CountCalories } from '../../source/applicationFunctionalities/dietManager/caloriesCalculation/CaloriesController';

describe('CountCalories function', () => {
  it('should correctly calculate the caloric needs', () => {

    // GIVEN
    const age = 24;
    const weight = 75;
    const height = 180;
    const sex = 'Mezczyzna';
    const activityLevel = 'sredniaAktywnosc';
    const dietGoal = 'utrzymacWage';
    const expectedCalories = 2564;

    // WHEN
    const resultCalories = CountCalories(age, weight, height, sex, activityLevel, dietGoal);

    // THEN
    expect(resultCalories).toBe(expectedCalories);
  });
});