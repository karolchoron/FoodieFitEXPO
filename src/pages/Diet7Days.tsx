import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { get, ref} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import alert from '../components/alert';
import { useDietManagement } from '../components/DietManagement';
import CaloriesContext from '../components/CaloriesContext';

interface Product {
    name: string;
    quantity: number;
    weight: number;
    calories: number;
}

interface Dish {
    id: number;
    name: string;
    dietType: string;
    totalCalories: number;
    products?: Record<string, Product>;
}

interface DayPlan {
    breakfast: Dish | null;
    dinner: Dish | null;
    supper: Dish | null;
}

const Diet7Days = () => {

    const { pickMealsFor7Days } = useDietManagement();
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

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0eb',
        padding: 30,
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },
    descriptionTextHeader: {
        fontWeight: 'normal',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },

    descriptionDaysHeaderText: {
        fontWeight: '700',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },

    button: {
        alignItems: 'center',
        backgroundColor: 'lightgreen',
        padding: 12,
        borderRadius: 30,
        width: 'auto',
    },

    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    mealContainer: {
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        width: '90%',
    },
    mealTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },

    mealName: {
        fontSize: 17,
        textAlign: 'center',
        // fontWeight: 'bold',
        color: 'black',
    },

    mealDescription: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black',
    },

    mealDataFontDescription: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
    },

    productDescription: {
        fontSize: 18,
        textAlign: 'center',
        color: 'black',
    },

    productTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },

    mealsList: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },

    horizontalLine: {
        width: '99%',
        height: 2,
        backgroundColor: 'black',
        marginVertical: 10,
    },

    buttonView: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    dayPlan: {
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    mealTypeText: {
        fontSize: 16,
        marginTop: 5,
        color: 'black',
        fontWeight: 'bold',
    },

    caloriesQuantityOfTheDayText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 5,
        color: 'black',
    },

    mealText: {
        fontSize: 16,
        marginTop: 5,
        color: 'black',
    },

    separator: {
        margin: 10,
        height: 2,
        width: "95%",
        backgroundColor: 'grey',
    },
});

export default Diet7Days;