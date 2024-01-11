import alert from '../../sharedUtils/alert';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../data/FirebaseConfig';
import { ref, update } from 'firebase/database';

const UserDietTypeChange = (newDietTypeSelectedValue: string) => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
        const userId = user.uid;

        // Aktualizacja preferowanego typu diety w bazie
        const updates: { [key: string]: any } = {};
        updates['/users/' + userId + '/preferedTypeOfDiet'] = newDietTypeSelectedValue;

        update(ref(FIREBASE_DATABASE), updates).then(() => {
            alert("Preferowany typ diety został zmieniony");

        }).catch((error) => {
            alert("Wystąpił błąd podczas zmiany preferowanego typu diety.");
        });
    } else {
        alert("Nie można zmienić preferowanego typu diety", "Użytkownik nie jest zalogowany.");
    }
};

export { UserDietTypeChange };