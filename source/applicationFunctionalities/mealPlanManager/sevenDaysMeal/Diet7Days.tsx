import React, { useState, useEffect, useContext } from 'react';
import { Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { get, ref} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import alert from '../../../other/Alert';
import { Diet7DaysController} from './Diet7DaysController';
import CaloriesContext from '../../../other/CaloriesContext';
import styles from './Diet7DaysStyles';
import '../../../interfaces/ProductInterface';
import '../../../interfaces/DishInterface';
import '../../../interfaces/DayPlanInterface';

const Diet7Days = () => {
    const { pickMealsFor7Days } = Diet7DaysController();
    const [weeklyDietPlan, setWeeklyDietPlan] = useState<DayPlan[]>([]);
    const [calories, setCalories] = useContext(CaloriesContext);
    const [caloriesPlanView, setCaloriesPlanView] = useState(false);

    // pobranie danych o aktualnie zalogowanym uzytkowniku - podczas procesu logowania
    // po to, aby dane byly aktualne - np. ilosc obliczonych kalorii przez uzytkownika
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                const userId = user.uid;
                const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setCalories(userData.caloriesQuantity);
                    } else {
                        console.log("Błąd, brak dostępnych danych");
                    }
                }).catch((error) => {
                    console.error("Błąd pobierania danych: ", error);
                });
            } else {
                console.log("Błąd, użytkownik nie jest zalogowany.");
            }
        });
    }, []);

    // Funkcja do obliczania sumy kalorii dla danego dnia
    const calculateDailyCalories = (dayPlan: DayPlan): number => {
        let total = 0;
        if (dayPlan.breakfast) total += dayPlan.breakfast.totalCalories;
        if (dayPlan.dinner) total += dayPlan.dinner.totalCalories;
        if (dayPlan.supper) total += dayPlan.supper.totalCalories;
        return total;
    };

    // Funkcja do obslugi przycisku "Generuj diete na 7 dni"
    const handlePressGenerateWeekDietPlanButton = async () => {
        if (calories != 0) {
            const plan = await pickMealsFor7Days();
            setWeeklyDietPlan(plan);
            // jezeli false to nie wyswietla dan, jezeli true to wyswietla. Czyli do wyswietlenia dan po klikneciu przycisku
            setCaloriesPlanView(true);
        }
        else {
            alert("Uwaga", "Aby wygenerować plan diety należy najpierw obliczyć swoje zapotrzebowanie kaloryczne");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.button} onPress={handlePressGenerateWeekDietPlanButton}>
                    <Text style={styles.buttonText}>Wygeneruj dietę na 7 dni</Text>
                </TouchableOpacity>

                <Text>{'\n'} </Text>

                {caloriesPlanView ? (
                    <>
                        {weeklyDietPlan.map((dayPlan, index) => (
                            <View key={index} style={styles.dayPlan}>
                                <Text style={styles.dayTitle}>DZIEŃ {index + 1}</Text>

                                <Text style={styles.caloriesQuantityOfTheDayText}>
                                    <Text style={styles.mealTypeText}>Łącznie: </Text>
                                    {calculateDailyCalories(dayPlan)} kalorii
                                </Text>

                                <Text style={styles.mealText}>
                                    <Text style={styles.mealTypeText}>Śniadanie: </Text>
                                    {dayPlan.breakfast ? `${dayPlan.breakfast.name} - ${dayPlan.breakfast.totalCalories} kalorii` : "Brak śniadania"}
                                </Text>
                                <Text style={styles.mealText}>
                                    <Text style={styles.mealTypeText}>Obiad: </Text>
                                    {dayPlan.dinner ? `${dayPlan.dinner.name} - ${dayPlan.dinner.totalCalories} kalorii` : "Brak obiadu"}
                                </Text>
                                <Text style={styles.mealText}>
                                    <Text style={styles.mealTypeText}>Kolacja: </Text>
                                    {dayPlan.supper ? `${dayPlan.supper.name} - ${dayPlan.supper.totalCalories} kalorii` : "Brak kolacji"}
                                </Text>
                                <View style={styles.separator}></View>
                            </View>
                        ))}
                    </>
                ) : (
                    <>
                        <View></View>
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Diet7Days;