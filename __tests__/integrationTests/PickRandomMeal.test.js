import { pickRandomMeal7Days } from '../../source/applicationFunctionalities/mealPlanManager/sevenDaysMeal/Diet7DaysController';

describe('pickRandomMeal7Days', () => {
    // Przygotowanie przykładowych danych posiłków
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
        // Symulacja wywołania funkcji wielokrotnie, aby sprawdzić, czy możemy otrzymać różne posiłki
        const results = new Set();
        const iterations = 50; // Wielokrotne wywołania, aby zwiększyć szansę na różnorodność
        for (let i = 0; i < iterations; i++) {
            const result = pickRandomMeal7Days(meals, 'breakfast');
            results.add(result.id);
        }
        // Sprawdzenie, czy funkcja zwróciła więcej niż jeden unikalny posiłek
        expect(results.size).toBeGreaterThan(1);
    });
});
