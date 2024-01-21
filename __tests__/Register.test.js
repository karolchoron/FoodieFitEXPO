import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import alert from '../source/other/Alert';
import { RegisterUser } from '../source/applicationFunctionalities/accountManager/register/RegisterController';


jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    sendEmailVerification: jest.fn(),
}));

jest.mock('firebase/database', () => ({
    ref: jest.fn(),
    set: jest.fn(),
}));

jest.mock('../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: { /* Mocked auth object */ },
    FIREBASE_DATABASE: { /* Mocked database object */ },
}));

// Mock dla alertów i nawigacji
jest.mock('../source/other/Alert', () => jest.fn());
jest.mock('@react-navigation/stack', () => ({
    ...jest.requireActual('@react-navigation/stack'),
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('RegisterUser', () => {
    const mockNavigation = { navigate: jest.fn() };
    const mockSetUserLogged = jest.fn();
    const userEmail = 'test@example.com';
    const userPassword = 'password123';
    const userName = 'Test';
    const userLastName = 'User';
    const dietTypeSelectedValue = 'Klasyczna';

    beforeEach(() => {
        jest.clearAllMocks(); // Czyści mocki przed każdym testem
    });

    it('attempts to register a user with provided credentials', async () => {
        // Mock funkcji, które zwracają promise
        createUserWithEmailAndPassword.mockImplementation(() => Promise.resolve({
            user: {
                uid: '123',
            },
        }));
        sendEmailVerification.mockImplementation(() => Promise.resolve());

        await RegisterUser({ navigation: mockNavigation }, userEmail, userPassword, userName, userLastName, dietTypeSelectedValue, mockSetUserLogged);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), userEmail, userPassword);
        expect(sendEmailVerification).toHaveBeenCalled();
        expect(ref).toHaveBeenCalledWith(expect.anything(), 'users/123');
        expect(set).toHaveBeenCalled();
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
});