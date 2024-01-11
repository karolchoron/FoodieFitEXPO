import React, { useEffect, useState, useContext } from 'react';
import { Platform, Keyboard } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegistrationPage from '../accountManager/register/Registration';
import LoginPage from '../accountManager/login/Login';
import AboutPage from '../about/About';
import HomePage from '../base/Home';
import LoggedHomePage from '../mealPlanManager/mealOfTheDay/LoggedHome';
import CaloriesCalculationPage from '../dietManager/caloriesCalculation/CaloriesCalculation';
import AccountPage from '../accountManager/manageDataAccount/Account';
import DietPreferencesPage from '../dietManager/dietPersonalisation/DietPreferences';
import DietPage from '../mealPlanManager/oneDayMeal/Diet';
import AuthorizationContext from '../sharedUtils/AuthorizationContext';
import Diet7DaysPage from '../mealPlanManager/sevenDaysMeal/Diet7Days';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

const NavigationFunctions = ({ navigation }: Props) => {
    const goToLogin = () => {
        navigation.navigate('Login');
    };

    const goToRegistration = () => {
        navigation.navigate('Registration');
    };

    const goToHome = () => {
        navigation.navigate('Home');
    };

    return { goToLogin, goToRegistration, goToHome };
};

const NotLoggedStackNavigation = () => {
    return (
        <SafeAreaProvider>
            <Stack.Navigator initialRouteName="Home" >
                <Stack.Screen name="LoggedHomeDrawerNavigation" component={LoggedHomeDrawerNavigation} options={{
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
                            initialRouteName="LoggedHome"
                            screenOptions={{
                                tabBarStyle: {
                                    backgroundColor: 'lightgrey',
                                },
                            }}
                        >
                            <TopTab.Screen name="Diet" component={DietPage}
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

                            <TopTab.Screen name="LoggedHome" component={LoggedHomePage}
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
                        <BottomTab.Navigator initialRouteName="LoggedHome"
                            screenOptions={{
                                tabBarStyle: isKeyboardVisible ? { display: 'none' } : {backgroundColor: 'lightgrey'},
                            }} >

                            <BottomTab.Screen name="Diet" component={DietPage} options={{
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

                            < BottomTab.Screen name="LoggedHome" component={LoggedHomePage} options={{
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

const LoggedHomeDrawerNavigation = () => {
    return (
        <SafeAreaProvider>
            <Drawer.Navigator initialRouteName="TabNavigation">
                < Drawer.Screen name="TabNavigation" component={TabNavigation} options={{
                    headerStyle: {
                        backgroundColor: 'lightgrey',
                    },
                    headerTitle: "",
                    drawerLabel: 'Główny panely',
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

export { NavigationFunctions, NotLoggedStackNavigation, TabNavigation, LoggedHomeDrawerNavigation };