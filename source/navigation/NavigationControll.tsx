import { RootStackParamList } from '../other/Types';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
    navigation: ProfileScreenNavigationProp;
};

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

export { NavigationFunctions };