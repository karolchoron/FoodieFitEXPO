import { Alert, Platform } from 'react-native';

const alertPolyfill = (title, description, options = []) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'));

    if (result) {
        // Znajdź i wykonaj funkcję onPress dla pierwszej opcji, która nie jest typu 'cancel'
        const confirmOption = options.find(({ style }) => style !== 'cancel');
        if (confirmOption && confirmOption.onPress) {
            confirmOption.onPress();
        }
    } else {
        // Znajdź i wykonaj funkcję onPress dla opcji 'cancel'
        const cancelOption = options.find(({ style }) => style === 'cancel');
        if (cancelOption && cancelOption.onPress) {
            cancelOption.onPress();
        }
    }
};

// Użyj alertPolyfill na platformie webowej, a domyślny Alert na innych platformach
const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert;

export default alert;
