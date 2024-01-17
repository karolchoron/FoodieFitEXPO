import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import { RootStackParamList } from '../../../other/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import alert from '../../../other/Alert';
import { ref, set } from 'firebase/database';

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
                // potrzebne potwierdzenie maila aby przejsc do zalogowanej aplikacji (do logged home) 
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

export { RegisterUser };