import { UserLogin } from '../source/applicationFunctionalities/accountManager/login/LoginController';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../source/data/FirebaseConfig';
import alert from '../source/other/Alert';


jest.mock('@react-navigation/stack', () => ({
    // Mock dla useNavigation, jeśli jest używany gdzieś indziej w komponencie
}));

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    },
}));

jest.mock('../source/other/Alert', () => jest.fn());


describe('UserLogin', () => {
    const mockSetUserLogged = jest.fn();
    const mockNavigation = { navigate: jest.fn() };
    const userEmail = 'test@example.com';
    const invaildUserEmail = 'unvaildEmail@';
    const userPassword = 'secretPassword';

    beforeEach(() => {
        jest.clearAllMocks(); // Resetuje mocki przed każdym testem
    });

    it('logs the user in and navigates on successful login with email verified', async () => {
        // Symulacja udanego logowania z potwierdzonym emailem
        signInWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: '123',
                emailVerified: true,
            },
        });

        await UserLogin({ navigation: mockNavigation }, userEmail, userPassword, mockSetUserLogged);

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(FIREBASE_AUTH, userEmail, userPassword);
        expect(mockSetUserLogged).toHaveBeenCalledWith(true);
        expect(mockNavigation.navigate).toHaveBeenCalledWith('MealOfTheDayDrawerNavigation');
    });

    it('shows an alert on login attempt with unverified email', async () => {
        // Symulacja logowania z niepotwierdzonym emailem
        signInWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: '123',
                emailVerified: false,
            },
        });

        await UserLogin({ navigation: mockNavigation }, userEmail, userPassword, mockSetUserLogged);

        expect(alert).toHaveBeenCalledWith('Proszę potwierdzić swój adres e-mail.');
    });

    // it('shows an error alert on login failure', async () => {
    //     // Symulacja nieudanego logowania
    //     signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

    //     await UserLogin({ navigation: mockNavigation }, invaildUserEmail, userPassword, mockSetUserLogged);

    //     expect(alert).toHaveBeenCalledWith("Nieprawidłowy adres email.");
    // });
});
