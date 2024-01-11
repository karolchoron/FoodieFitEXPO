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
      marginBottom: 20,
      textAlign: 'center',
  },
  descriptionTextHeader: {
      fontWeight: 'normal',
      fontSize: 20,
      color: '#000',
      textAlign: 'center',
  },

  descriptionDaysHeaderText: {
      fontWeight: '700',
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
      textAlign: 'center',
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
      fontSize: 17,
      fontWeight: 'bold',
      color: 'black',
  },

  mealName: {
      fontSize: 17,
      textAlign: 'center',
      // fontWeight: 'bold',
      color: 'black',
  },

  mealDescription: {
      fontSize: 20,
      textAlign: 'center',
      color: 'black',
  },

  mealDataFontDescription: {
      fontSize: 20,
      textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
  },

  productDescription: {
      fontSize: 18,
      textAlign: 'center',
      color: 'black',
  },

  productTitle: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
  },

  mealsList: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
  },

  horizontalLine: {
      width: '99%',
      height: 2,
      backgroundColor: 'black',
      marginVertical: 10,
  },

  buttonView: {
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
  },

  dayPlan: {
      marginBottom: 20,
  },
  dayTitle: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'black',
  },
  mealTypeText: {
      fontSize: 16,
      marginTop: 5,
      color: 'black',
      fontWeight: 'bold',
  },

  caloriesQuantityOfTheDayText: {
      textAlign: 'center',
      fontSize: 16,
      marginTop: 5,
      color: 'black',
  },

  mealText: {
      fontSize: 16,
      marginTop: 5,
      color: 'black',
  },

  separator: {
      margin: 10,
      height: 2,
      width: "95%",
      backgroundColor: 'grey',
  },
});

export default styles;