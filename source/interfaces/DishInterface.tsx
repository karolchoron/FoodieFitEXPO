interface Dish {
    id: number;
    name: string;
    dietType: string;
    totalCalories: number;
    products?: Record<string, Product>;
}