import React, { useEffect, useState, useContext } from 'react';
import { Image, Platform, Keyboard } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../sharedUtils/Types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RegistrationPage from '../applicationFunctionalities/accountManager/register/Registration';
import MealOfTheDayPage from '../applicationFunctionalities/mealPlanManager/mealOfTheDay/MealOfTheDay';
import CaloriesCalculationPage from '../applicationFunctionalities/dietManager/caloriesCalculation/CaloriesCalculation';
import AccountPage from '../applicationFunctionalities/accountManager/manageDataAccount/Account';
import DietPreferencesPage from '../applicationFunctionalities/dietManager/dietPersonalisation/DietPreferences';
import OneDayMealPage from '../applicationFunctionalities/mealPlanManager/oneDayMeal/OneDayMeal';
import Diet7DaysPage from '../applicationFunctionalities/mealPlanManager/sevenDaysMeal/Diet7Days';
import LoginPage from '../applicationFunctionalities/accountManager/login/Login';
import AuthorizationContext from '../sharedUtils/AuthorizationContext';
import AboutPage from '../applicationFunctionalities/about/About';
import HomePage from '../applicationFunctionalities/base/Home';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const NotLoggedStackNavigation = () => {
    return (
        <SafeAreaProvider>
            <Stack.Navigator initialRouteName="Home" >
                <Stack.Screen name="MealOfTheDayDrawerNavigation" component={MealOfTheDayDrawerNavigation} options={{
                    headerShown: false,
                }} />

                <Stack.Screen name="Home" component={HomePage} options={{
                    headerShown: false,
                }} />

                <Stack.Screen name="Login" component={LoginPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitle: "LOGOWANIE",
                    headerTitleAlign: 'center',
                }} />

                <Stack.Screen name="Registration" component={RegistrationPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitle: "REJESTRACJA",
                    headerTitleAlign: 'center',
                }} />
            </Stack.Navigator>
        </SafeAreaProvider >
    );
};

const TabNavigation = () => {

    const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    //Listeners - do schowania menu nawigacji, gdy klawiatura jest wyswietlona i pokazaniu gdy klawiatury nie ma na ekranie
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide', () => {
                setKeyboardVisible(false);
            }
        );

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <>
                {Platform.OS === 'web' ? (
                    <>
                        <TopTab.Navigator
                            initialRouteName="MealOfTheDay"
                            screenOptions={{
                                tabBarStyle: {
                                    backgroundColor: 'lightgrey',
                                },
                            }}
                        >
                            <TopTab.Screen name="OneDayMeal" component={OneDayMealPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Plan diety',

                                    tabBarIcon: () =>
                                        <Image
                                            source={require('../../assets/images/diet.png')}
                                            style={{ width: 30, height: 30 }}
                                        />
                                }} />

                            <TopTab.Screen name="MealOfTheDay" component={MealOfTheDayPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Strona główna',
                                    tabBarIcon: () =>
                                        <Image
                                            source={require('../../assets/images/home.png')}
                                            style={{ width: 30, height: 30 }}
                                        />
                                }} />

                            <TopTab.Screen name="Diet7Days" component={Diet7DaysPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Tygodniowy plan',
                                    tabBarIcon: () =>
                                        <Image
                                            source={require('../../assets/images/diet7days.png')}
                                            style={{ width: 30, height: 30 }}
                                        />
                                }} />
                        </TopTab.Navigator>
                    </>
                ) : (
                    <>
                        <BottomTab.Navigator initialRouteName="MealOfTheDay"
                            screenOptions={{
                                tabBarStyle: isKeyboardVisible ? { display: 'none' } : { backgroundColor: 'lightgrey' },
                            }} >

                            <BottomTab.Screen name="OneDayMeal" component={OneDayMealPage} options={{
                                headerStyle: {
                                    backgroundColor: 'lightgrey',
                                },
                                headerTitle: "",
                                headerShown: false,
                                tabBarLabel: 'Plan diety',
                                tabBarIcon: () =>
                                    <Image
                                        source={require('../../assets/images/diet.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                            }} />

                            < BottomTab.Screen name="MealOfTheDay" component={MealOfTheDayPage} options={{
                                headerStyle: {
                                    backgroundColor: 'lightgrey',
                                },
                                headerTitle: "",
                                headerShown: false,
                                tabBarLabel: 'Strona główna',
                                tabBarIcon: () =>
                                    <Image
                                        source={require('../../assets/images/home.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                            }} />

                            <BottomTab.Screen name="Diet7Days" component={Diet7DaysPage} options={{
                                headerStyle: {
                                    backgroundColor: 'lightgrey',
                                },
                                headerTitle: "",
                                headerShown: false,
                                tabBarLabel: 'Tygodniowy plan',
                                tabBarIcon: () =>
                                    <Image
                                        source={require('../../assets/images/diet7days.png')}
                                        style={{ width: 30, height: 30 }}
                                    />
                            }} />
                        </BottomTab.Navigator>
                    </>
                )}
            </>
        </SafeAreaProvider >
    );
};

const MealOfTheDayDrawerNavigation = () => {
    return (
        <SafeAreaProvider>
            <Drawer.Navigator initialRouteName="TabNavigation">
                < Drawer.Screen name="TabNavigation" component={TabNavigation} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitle: "",
                    drawerLabel: 'Główny panely',
                    headerTitleAlign: 'center',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/backbutton.png')}
                            style={{ width: 30, height: 30 }}
                        />
                }} />

                <Drawer.Screen name="CaloriesCalculation" component={CaloriesCalculationPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: "KALKULATOR KALORII",
                    drawerLabel: 'Kalkulator kalorii',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/caloriescalculation.png')}
                            style={{ width: 30, height: 30 }}
                        />
                }} />

                <Drawer.Screen name="DietPreferences" component={DietPreferencesPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: "PREFERENCJE DIETY",
                    drawerLabel: 'Preferencje diety',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/preference.png')}
                            style={{ width: 30, height: 30 }}
                        />
                }} />

                <Drawer.Screen name="Account" component={AccountPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: "KONTO",
                    drawerLabel: 'Konto',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/account.png')}
                            style={{ width: 30, height: 30 }}
                        />
                }} />

                <Drawer.Screen name="About" component={AboutPage} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: "INFORMACJE",
                    drawerLabel: 'Informacje',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/about.png')}
                            style={{ width: 30, height: 30 }}
                        />,
                }} />

                {/* < Drawer.Screen name="LogOut" component={HomePage} options={{
                    headerTitle: "",
                    headerShown: false,
                    drawerLabel: 'Wyloguj się',
                    drawerIcon: () =>
                        <Image
                            source={require('../../assets/images/logout.png')}
                            style={{ width: 30, height: 30 }}
                        />,
                }} /> */}

            </Drawer.Navigator>
        </SafeAreaProvider >
    );
};

export { NotLoggedStackNavigation, TabNavigation, MealOfTheDayDrawerNavigation };