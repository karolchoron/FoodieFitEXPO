import alert from './alert';
import { RootStackParamList } from '../components/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../database/FirebaseConfig';
import { ref, remove, set, update } from 'firebase/database';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

const RegisterUser = ({ navigation }: Props, userEmail: string, userPassword: string, userName: string, userLastName: string, dietTypeSelectedValue: string, setUserLogged: any) => {
    if (userEmail != "" && userPassword != "" && userName != "") {
        createUserWithEmailAndPassword(FIREBASE_AUTH, userEmail, userPassword)
            .then((userCredential) => {

                const user = userCredential.user;
                const userId = user.uid;

                // Wysłanie e-maila weryfikujacego maila przy rejestracji
                sendEmailVerification(user)
                    .then(() => {
                        alert("Link weryfikacyjny został wysłany na Twój adres e-mail.", "Potwierdź rejestrację aby korzystać ze swoje konta.");
                    })
                    .catch((error) => {
                        alert("Błąd wysłania weryfikacyjnego maila", error);
                    });

                // dodanie do drugiej bazy danych o userze, takie jak Imie + typ diety
                set(ref(FIREBASE_DATABASE, 'users/' + userId), {
                    id: userId,
                    name: userName,
                    lastName: userLastName,
                    caloriesQuantity: 0, // Początkowo 0, po obliczeniu zapotrzebowania kalorycznego dana ta zostanie zmieniona
                    preferedTypeOfDiet: dietTypeSelectedValue,
                    dateOfGenerateTheDayDish: "", // poczatkowo puste
                    idOfGeneratedTheDayDish: "" // poczatkowo puste
                });
                // po zarejestrowaniu przenies na strone Home
                // potrzebne potwierdzenie maila aby przejsc do zalogowanej aplikacji (czyli do logged home) 
                navigation.navigate('Home');
            })
            .catch((error) => {
                const errorCode = error.code;

                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        alert("Podany adres e-mail jest już używany.");
                        break;

                    case 'auth/invalid-email':
                        alert("Podany adres e-mail jest nieprawidłowy.");
                        break;

                    case 'auth/operation-not-allowed':
                        alert("Rejestracja jest obecnie wyłączona.");
                        break;

                    case 'auth/weak-password':
                        alert("Hasło jest zbyt słabe", "Hasło musi zawierać minimum 6 znaków.");
                        break;

                    default:
                        alert("Wystąpił nieoczekiwany błąd.", "Proszę spróbować później");
                }
            });
    }
    else {
        alert('Wprowadź prawidłowe dane do rejestracji.')
    }
};

const UserLogin = ({ navigation }: Props, userEmail: string, userPassword: string, setUserLogged: any) => {
    signInWithEmailAndPassword(FIREBASE_AUTH, userEmail, userPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            // console.log("Zalogowano użytkownika: ", user.uid);
            // alert("Pomyślnie zalogowano");
            if (user.emailVerified) {
                // Email jest potwierdzony, nastepuje zalogowanie
                setUserLogged(true);
                // navigation.navigate('LoggedScreenTabNavigator');
                navigation.navigate('LoggedHomeDrawerNavigation');

            } else {
                // Email nie jest potwierdzony
                alert('Proszę potwierdzić swój adres e-mail.');
            }
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/invalid-login-credentials':
                    alert("Nieprawidłowe dane logowania.");
                    break;

                case 'auth/invalid-email':
                    alert("Nieprawidłowy adres email.");
                    break;

                case 'auth/user-disabled':
                    alert("To konto użytkownika zostało wyłączone.");
                    break;

                case 'auth/user-not-found':
                    alert("Nie znaleziono użytkownika z tym adresem email.");
                    break;

                case 'auth/wrong-password':
                    alert("Nieprawidłowe hasło.");
                    break;

                case 'auth/too-many-requests':
                    alert("Konto zostało tymczasowo zablokowane", "Zbyt wiele błędnych prób logowania");
                    break;

                default:
                    alert("Wystąpił błąd podczas logowania.");
            }
        });
};


const UserSingOut = ({ navigation }: Props, setUserLogged: any) => {
    FIREBASE_AUTH.signOut().then(() => alert("Pomyślnie wylogowano"));
    setUserLogged(false);
    navigation.navigate('Home');
};

const UserPasswordChange = (currentPassword: string, newPassword: string) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        const credential = EmailAuthProvider.credential(user.email as string, currentPassword);

        if (currentPassword == "" && newPassword == "") {
            alert("Pola zmiany hasła nie mogą być puste.");
            return;
        }

        reauthenticateWithCredential(user, credential).then(() => {
            if (currentPassword === newPassword) {
                alert("Nowe hasło nie może być takie samo jak obecne hasło.");
                return;
            }

            updatePassword(user, newPassword).then(() => {
                alert("Hasło zostało zmienione.");
            }).catch((error) => {
                alert("Wystąpił błąd podczas zmiany hasła.");
            });

        }).catch((error) => {
            alert("Błąd uwierzytelniania", "Sprawdź aktualne hasło.");
        });
    } else {
        alert("Nie można zmienić hasła", "użytkownik nie jest zalogowany.");
    }
};

const UserNameChange = (newName: string, newLastName: string) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        // Pobierz identyfikator użytkownika
        const userId = user.uid;

        // Sprawdź czy pola nie są puste
        if (newName == "" && newLastName == "") {
            alert("Imię i nazwisko nie mogą być puste.");
            return;
        }

        // Aktualizacja imienia i nazwiska w bazie danych
        const updates: { [key: string]: any } = {};
        updates['/users/' + userId + '/name'] = newName;
        updates['/users/' + userId + '/lastName'] = newLastName;

        // Wykonaj aktualizację
        update(ref(FIREBASE_DATABASE), updates).then(() => {
            alert("Imię i nazwisko zostały zmienione.");

        }).catch((error) => {
            alert("Wystąpił błąd podczas zmiany imienia i nazwiska.");
        });
    } else {
        alert("Nie można zmienić imienia i nazwiska", "Użytkownik nie jest zalogowany.");
    }
};


const UserDietTypeChange = (newDietTypeSelectedValue: string) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        // Pobierz identyfikator użytkownika
        const userId = user.uid;

        // Aktualizacja imienia i nazwiska w bazie danych
        const updates: { [key: string]: any } = {};
        updates['/users/' + userId + '/preferedTypeOfDiet'] = newDietTypeSelectedValue;

        // Wykonaj aktualizację
        update(ref(FIREBASE_DATABASE), updates).then(() => {
            alert("Preferowany typ diety został zmieniony");

        }).catch((error) => {
            alert("Wystąpił błąd podczas zmiany preferowanego typu diety.");
        });
    } else {
        alert("Nie można zmienić preferowanego typu diety", "Użytkownik nie jest zalogowany.");
    }
};

const DeleteAccount = ({ navigation }: Props, setUserLogged: any) => {

    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        const userId = user.uid;

        // Najpierw usun informacje o uzytkownika z bazy danych Realtime Databse Firebase
        remove(ref(FIREBASE_DATABASE, 'users/' + userId))
            .then(() => {
                // Następnie usun konto uzytkownika z Firebase Authentication
                deleteUser(user).then(() => {
                    alert("Konto zostało usunięte");
                    setUserLogged(false);
                    navigation.navigate('Home');

                }).catch((error) => {
                    alert("Wystąpił błąd podczas usuwania konta");
                });
            })
            .catch((error) => {
                alert("Wystąpił błąd podczas usuwania danych użytkownika z bazy danych");
            });
    } else {
        alert("Nie zalogowano użytkownika.");
    }
};

export { UserLogin, UserSingOut, RegisterUser, UserPasswordChange, UserNameChange, DeleteAccount, UserDietTypeChange };