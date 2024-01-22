import { pickRandomMeal7Days } from '../../source/applicationFunctionalities/mealPlanManager/sevenDaysMeal/Diet7DaysController';

describe('pickRandomMeal7Days', () => {

    // Przygotowanie przykladowych danych posilkow
    const meals = [
        { id: '1', name: 'Posiłek 1', type: 'breakfast' },
        { id: '2', name: 'Posiłek 2', type: 'dinner' },
        { id: '3', name: 'Posiłek 3', type: 'supper' }
    ];

    it('returns null if no meal options are provided', () => {
        const result = pickRandomMeal7Days([], 'breakfast');
        expect(result).toBeNull();
    });

    it('returns a meal object when meal options are provided', () => {
        const result = pickRandomMeal7Days(meals, 'breakfast');
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('type');
    });

    it('returns a random meal from the provided meal options', () => {
        // Symulacja wywolania funkcji wielokrotnie, aby sprawdzic czy losuje rozne posilki
        const results = new Set();

        const iterations = 50;
        for (let i = 0; i < iterations; i++) {
            const result = pickRandomMeal7Days(meals, 'breakfast');
            results.add(result.id);
        }
        // Sprawdzenie czy funkcja zwrocila więcej niż jeden unikalny posilek
        expect(results.size).toBeGreaterThan(1);
    });
});
