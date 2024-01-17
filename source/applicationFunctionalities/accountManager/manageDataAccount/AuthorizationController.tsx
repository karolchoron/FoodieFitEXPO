import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import { RootStackParamList } from '../../../other/Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ref, remove, update } from 'firebase/database';
import alert from '../../../other/Alert';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

const UserPasswordChange = (currentPassword: string, newPassword: string) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        const credential = EmailAuthProvider.credential(user.email as string, currentPassword);

        if (currentPassword == "" || newPassword == "") {
            alert("Pola zmiany hasła nie mogą być puste.");
            return;
        }

        reauthenticateWithCredential(user, credential).then(() => {
            if (currentPassword === newPassword) {
                alert("aNowe hasło nie może być takie samo jak obecne hasło.");
                return;
            }

            updatePassword(user, newPassword).then(() => {
                alert("Hasło zostało zmienione.");
            }).catch((error) => {
                alert("Hasło nie spełnia wymagań bezpieczeństwa!", "Hasło powinno zawierać minimum 6 znaków");
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
        const userId = user.uid;

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

const UserSingOut = ({ navigation }: Props, setUserLogged: any) => {
    FIREBASE_AUTH.signOut().then(() => alert("Pomyślnie wylogowano"));
    setUserLogged(false);
    navigation.navigate('Home');
};

export { UserSingOut, UserPasswordChange, DeleteAccount, UserNameChange };