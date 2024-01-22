import { UserLogin } from '../../source/applicationFunctionalities/accountManager/login/LoginController';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../source/data/FirebaseConfig';
import alert from '../../source/other/Alert';

// Mock nawigacji
jest.mock('@react-navigation/stack', () => ({
}));

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    },
}));

jest.mock('../../source/other/Alert', () => jest.fn());

describe('UserLogin', () => {

    // GIVEN
    const mockSetUserLogged = jest.fn();
    const mockNavigation = { navigate: jest.fn() };
    const userEmail = 'test@test.com';
    const userPassword = 'secretPassword';

    // Resetuje mocki przed kazdym testem
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('logs the user in and navigates on successful login with email verified', async () => {
        // Symulacja udanego logowania z zweryfikowanym emailem
        signInWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: '123',
                emailVerified: true,
            },
        });

        // WHEN
        await UserLogin({ navigation: mockNavigation }, userEmail, userPassword, mockSetUserLogged);


        // THEN
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(FIREBASE_AUTH, userEmail, userPassword);
        expect(mockSetUserLogged).toHaveBeenCalledWith(true);
        expect(mockNavigation.navigate).toHaveBeenCalledWith('MealOfTheDayDrawerNavigation');
    });

    it('shows an alert on login attempt with unverified email', async () => {
        // GIVEN
        // Symulacja logowania z nieweryfikowanym emailem
        signInWithEmailAndPassword.mockResolvedValue({
            user: {uid: '123',emailVerified: false,},});

        // WHEN
        await UserLogin({ navigation: mockNavigation }, userEmail, userPassword, mockSetUserLogged);

        // THEN
        expect(alert).toHaveBeenCalledWith('Proszę potwierdzić swój adres e-mail.');
    });
});