import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#f0f0eb',
      padding: 30,
  },
  headerText: {
      fontWeight: 'bold',
      fontSize: 25,
      color: '#000',
      marginBottom: 10,
      textAlign: 'center',
  },
  descriptionTextHeader: {
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
  },

  mealContainer: {
      padding: 10,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      borderWidth: 1,
      borderColor: 'grey',
      width: '90%',
  },
  mealTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
  },

  mealName: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
  },

  TextYourCalories: {
      fontSize: 16,
      textAlign: 'center',
      // fontWeight: 'bold',
      color: 'black',
  },

  mealDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: 'black',
  },

  mealDataFontDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
  },

  productDescription: {
      fontSize: 16,
      textAlign: 'center',
      color: 'black',
  },

  productTitle: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
  },

  mealsList: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
  },

  separator: {
      margin: 10,
      height: 2,
      width: "95%",
      backgroundColor: 'grey',
  },

  buttonView: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
  },
});

export default styles;