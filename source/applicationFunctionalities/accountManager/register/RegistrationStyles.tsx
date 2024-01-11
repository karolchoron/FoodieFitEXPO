import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0eb',
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },

    contentText: {
        fontWeight: 'normal',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
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

    mainViewStyles: {
        overflowY: 'scroll',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 0,
        margin: 0,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    stylePicker: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        // borderBottomWidth: 1,
        borderBottomColor: 'grey',
        width: 250,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        fontWeight: 'normal',
        fontSize: 20,
        backgroundColor: '#f0f0eb',
    },
    separator: {
        margin: 10,
        height: 2,
        width: "95%",
        backgroundColor: 'grey',
    },

});

export default styles;