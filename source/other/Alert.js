import { Alert, Platform } from 'react-native';

// komponent react native alert domyslnie nie dziala w Webowej apce.
// Uzyj alertPolyfill na platformie webowej, a domyslny Alert na platformach mobilnych
let alert;

if (Platform.OS === 'web') {
    const alertPolyfill = (title, description, options = []) => {
        const result = window.confirm([title, description].filter(Boolean).join('\n'));

        if (result) {
            // Znajdz i wykonaj funkcje onPress dla pierwszej opcji, ktora nie jest typu 'cancel'
            const confirmOption = options.find(({ style }) => style !== 'cancel');
            if (confirmOption && confirmOption.onPress) {
                confirmOption.onPress();
            }
        } else {
            // Znajdz i wykonaj funkcje onPress dla opcji 'cancel'
            const cancelOption = options.find(({ style }) => style === 'cancel');
            if (cancelOption && cancelOption.onPress) {
                cancelOption.onPress();
            }
        }
    };
    alert = alertPolyfill;
} else {
    alert = Alert.alert;
}

export default alert;