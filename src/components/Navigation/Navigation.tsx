import React, { Component, useEffect, useState, useContext } from 'react';
import { Platform, Keyboard, TextInput, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RegistrationPage from '../../pages/Registration';
import LoginPage from '../../pages/Login';
import AboutPage from '../../pages/About';
import HomePage from '../../pages/Home';
import LoggedHomePage from '../../pages/LoggedHome';
import CaloriesCalculationPage from '../../pages/CaloriesCalculation';
import AccountPage from '../../pages/Account';
import DietPreferencesPage from '../../pages/DietPreferences';
import DietPage from '../../pages/Diet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from 'react-native';
import Icons from '../Icons';
import alert from '../alert';
import AuthorizationContext from '../AuthorizationContext';
import Diet7DaysPage from '../../pages/Diet7Days';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

// TODO ROZBIJ TO NA KILKA PLIKOW MOZE BEDZIE CYZTELNIEJ

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
            <>
                {Platform.OS === 'web' ?
                    (
                        <>
                            <Stack.Navigator initialRouteName="Home" >
                                <Stack.Screen name="LoggedHomeDrawerNavigation" component={LoggedHomeDrawerNavigation} options={{
                                    headerShown: false,
                                }} />

                                <Stack.Screen name="Home" component={HomePage} options={{
                                    headerShown: false,
                                }} />

                                <Stack.Screen name="Login" component={LoginPage} options={{
                                    headerShown: false,
                                }} />

                                <Stack.Screen name="Registration" component={RegistrationPage} options={{
                                    headerShown: false,
                                }} />

                            </Stack.Navigator>
                        </>
                    ) : (
                        <>
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
                                    // headerTitle: "",
                                }} />

                                <Stack.Screen name="Registration" component={RegistrationPage} options={{
                                     headerStyle: {
                                        backgroundColor: 'lightgrey',
                                    },
                                    headerTitle: "REJESTRACJA",
                                    // headerTitle: "",
                                }} />
                            </Stack.Navigator>
                        </>
                    )}
            </>
        </SafeAreaProvider >
    );
};

const TabNavigation = () => {

    const [isUserLogged, setUserLogged] = useContext(AuthorizationContext);
    const icons = Icons();
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
                        <TopTab.Navigator initialRouteName="LoggedHome">
                            {/* <TopTab.Screen name="About" component={AboutPage}
                                    options={{
                                        tabBarLabelStyle: {
                                            fontSize: 20,
                                        },
                                        tabBarLabel: 'Informacje',
                                        tabBarIcon: () => <icons.InformationIcon />,
                                    }} />

                                <TopTab.Screen name="Account" component={AccountPage}
                                    options={{
                                        tabBarLabelStyle: {
                                            fontSize: 20,
                                        },
                                        tabBarLabel: 'Konto',
                                        tabBarIcon: () => <icons.AccountIcon />,
                                    }} />

                                <TopTab.Screen name="CaloriesCalculation" component={CaloriesCalculationPage}
                                    options={{
                                        tabBarLabelStyle: {
                                            fontSize: 20,
                                        },
                                        tabBarLabel: 'Kalkulator kalorii',
                                        tabBarIcon: () => <icons.CaloriesCalculatorIcon />,
                                    }} /> 
                            

                            <TopTab.Screen name="Diet" component={DietPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Plan diety',
                                    tabBarIcon: () => <icons.DietIcon />,
                                }} />

                            <TopTab.Screen name="LoggedHome" component={LoggedHomePage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Strona główna',
                                    tabBarIcon: () => <icons.HomeIcon />,
                                }}
                            />

                            <TopTab.Screen name="Diet7Days" component={Diet7DaysPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Tygodniowy plan',
                                    tabBarIcon: () => <icons.Icon7Days />,
                                }} />
                                */}

                            <TopTab.Screen name="Diet" component={DietPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Plan diety',
                                    tabBarIcon: () => <icons.DietIcon />,
                                }} />

                            <TopTab.Screen name="LoggedHome" component={LoggedHomePage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Strona główna',
                                    tabBarIcon: () => <icons.HomeIcon />,
                                }}
                            />

                            <TopTab.Screen name="Diet7Days" component={Diet7DaysPage}
                                options={{
                                    tabBarLabelStyle: {
                                        fontSize: 20,
                                    },
                                    tabBarLabel: 'Tygodniowy plan',
                                    tabBarIcon: () => <icons.Icon7Days />,
                                }} />

                        </TopTab.Navigator>
                    </>
                ) : (
                    <>
                        <BottomTab.Navigator initialRouteName="LoggedHome"
                            screenOptions={{
                                tabBarStyle: isKeyboardVisible ? { display: 'none' } : {},
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
                                        source={require('../../images/diet.png')}
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
                                        source={require('../../images/home.png')}
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
                                        source={require('../../images/diet7days.png')}
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
                            source={require('../../images/backbutton.png')}
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
                            source={require('../../images/caloriescalculation.png')}
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
                            source={require('../../images/preference.png')}
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
                            source={require('../../images/account.png')}
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
                            source={require('../../images/about.png')}
                            style={{ width: 30, height: 30 }}
                        />,
                }} />

                {/* < Drawer.Screen name="LogOut" component={HomePage} options={{
                    headerTitle: "",
                    headerShown: false,
                    drawerLabel: 'Wyloguj się',
                    drawerIcon: () =>
                        <Image
                            source={require('../../images/logout.png')}
                            style={{ width: 30, height: 30 }}
                        />,
                }} /> */}

            </Drawer.Navigator>
        </SafeAreaProvider >
    );
};

export { NavigationFunctions, NotLoggedStackNavigation, TabNavigation, LoggedHomeDrawerNavigation };