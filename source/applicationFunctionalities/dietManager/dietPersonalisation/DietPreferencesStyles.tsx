import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0eb',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },

  headerContentText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },

  contentText: {
    fontWeight: 'normal',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
  },

  buttonDelete: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 30,
    width: 'auto',
  },


  buttonDeleteText: {
    color: 'white',
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

  dataView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logOutAndDeleteView: {
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

  stylePicker: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
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
  productItem: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
  },
});

export default styles;