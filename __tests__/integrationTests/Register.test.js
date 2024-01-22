import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { RegisterUser } from '../../source/applicationFunctionalities/accountManager/register/RegisterController';

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    sendEmailVerification: jest.fn(),
}));

jest.mock('firebase/database', () => ({
    ref: jest.fn(),
    set: jest.fn(),
}));

jest.mock('../../source/data/FirebaseConfig', () => ({
    FIREBASE_AUTH: {},
    FIREBASE_DATABASE: {},
}));

// Mock dla alertow
jest.mock('../../source/other/Alert', () => jest.fn());

// Mock nawigacji
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

    // czyszczenie mockow przed kazdym testem
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('attempts to register a user with provided credentials', async () => {
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