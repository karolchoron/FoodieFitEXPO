import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f0f0eb',
    },
    image: {
        width: 200,
        height: 200,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },

    button: {
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        margin: 10,
        padding: 12,
        borderRadius: 30,
        width: 'auto',
    },

    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },

    textInput: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        fontWeight: 'normal',
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },

    contentText: {
        fontWeight: 'normal',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    separator: {
        margin: 10,
        height: 2,
        width: "95%",
        backgroundColor: 'grey',
    },
});

export default styles;