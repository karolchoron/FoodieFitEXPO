import alert from '../../sharedUtils/alert';
import { RootStackParamList } from '../../sharedUtils/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../data/FirebaseConfig';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

const UserLogin = ({ navigation }: Props, userEmail: string, userPassword: string, setUserLogged: any) => {
    signInWithEmailAndPassword(FIREBASE_AUTH, userEmail, userPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;
            if (user.emailVerified) {
                // Email jest potwierdzony, nastepuje zalogowanie
                setUserLogged(true);
                navigation.navigate('MealOfTheDayDrawerNavigation');

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

export { UserLogin, UserSingOut};