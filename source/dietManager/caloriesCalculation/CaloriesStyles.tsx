import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    height: '100%',
    width: '100%',
    margin: 0,
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
    // borderBottomWidth: 1,
    fontWeight: 'normal',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },

  button: {
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 12,
    borderRadius: 30,
    width: 'auto',
  },

  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  stylePicker: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
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

  buttonView: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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