import React, { useEffect, useState, useContext } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CaloriesContext from '../../../other/CaloriesContext';
import { CountCalories } from './CaloriesController';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './CaloriesStyles';
import SelectDropdown from 'react-native-select-dropdown';

const CaloriesCalculation = () => {
  const [calories, setCalories] = useContext(CaloriesContext);

  // pobranie z bazy danych informacji o zapotrzebowaniu kalorycznym dla zalogowanego uzytkownika
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(FIREBASE_DATABASE, 'users/' + userId);

        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setCalories(userData.caloriesQuantity);
          } else {
            // console.log("Błąd, brak dostępnych danych");
            return null;
          }
        }).catch((error) => {
          console.error(error);
          return null;
        });
      } else {
        // console.log("Błąd, użytkownik nie jest zalogowany.");
        return null;
      }
    });
  }, []);

  const [textAge, setAgeText] = useState('');
  const [textWeight, setWeightText] = useState('');
  const [textGrowth, setGrowthText] = useState('');
  const [sexSelectedValue, sexSetSelectedValue] = useState("Kobieta");
  const [activitySelectedValue, activitySetSelectedValue] = useState("sredniaAktywnosc");
  const [dietPurposeSelectedValue, dietPurposeSetSelectedValue] = useState("utrzymacWage");

  // Wartosci do dropdown list
  const genders = [
    { value: 'Kobieta', label: 'Kobieta' },
    { value: 'Mezczyzna', label: 'Mężczyzna' },
  ];

  const activities = [
    { value: 'znikomaAktywnosc', label: 'Znikoma / Brak aktywności' },
    { value: 'niskaAktywnosc', label: 'Niska aktywność' },
    { value: 'sredniaAktywnosc', label: 'Średnia aktywność' },
    { value: 'wysokaAktywnosc', label: 'Wysoka aktywność' },
    { value: 'bardzoWysokaAktywnosc', label: 'Bardzo wysoka aktywność' },
  ];

  const dietPurposes = [
    { value: 'schudnac', label: 'Chcę schudnąć' },
    { value: 'utrzymacWage', label: 'Chcę utrzymać wagę' },
    { value: 'przytyc', label: 'Chcę przytyć' },
  ];

  // ukrycie tekstu po kliknieciu w texfield "wiek" "waga" "wzrost" 
  const [isAgeFocused, setAgeIsFocused] = useState(false);
  const ageHandleFocus = () => setAgeIsFocused(true);
  const ageHandleBlur = () => setAgeIsFocused(false);

  const [isWeightFocused, setWeightIsFocused] = useState(false);
  const weightHandleFocus = () => setWeightIsFocused(true);
  const weightHandleBlur = () => setWeightIsFocused(false);

  const [isGrowthFocused, setGrowthIsFocused] = useState(false);
  const growthHandleFocus = () => setGrowthIsFocused(true);
  const growthHandleBlur = () => setGrowthIsFocused(false);

  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.contentText}>
              {'\n'}Wprowadź swoje dane{'\n'}
              i oblicz zapotrzebowanie kaloryczne:
            </Text>
          </View>

          <View>
            <Text style={styles.contentText}>{'\n'}WIEK</Text>
            <TextInput
              value={textAge}
              onChangeText={setAgeText}
              onFocus={ageHandleFocus}
              onBlur={ageHandleBlur}
              placeholder="lat"
              keyboardType='numeric'
              style={styles.textInput}
              placeholderTextColor={isAgeFocused ? 'transparent' : 'grey'}
            />
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}WAGA</Text>
            <TextInput
              value={textWeight}
              onChangeText={setWeightText}
              onFocus={weightHandleFocus}
              onBlur={weightHandleBlur}
              placeholder="kg"
              keyboardType='numeric'
              style={styles.textInput}
              placeholderTextColor={isWeightFocused ? 'transparent' : 'grey'}
            />
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}WZROST</Text>
            <TextInput
              value={textGrowth}
              onChangeText={setGrowthText}
              onFocus={growthHandleFocus}
              onBlur={growthHandleBlur}
              placeholder="cm"
              keyboardType='numeric'
              style={styles.textInput}
              placeholderTextColor={isGrowthFocused ? 'transparent' : 'grey'}
            />
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}PŁEĆ</Text>
            <SelectDropdown
              data={genders}
              onSelect={(selectedItem, index) => {
                sexSetSelectedValue(selectedItem.value);
              }}
              defaultButtonText={"Wybierz płeć"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
            />
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}AKTYWNOŚĆ</Text>
            <SelectDropdown
              data={activities}
              onSelect={(selectedItem, index) => {
                activitySetSelectedValue(selectedItem.value);
              }}
              defaultButtonText={"Wybierz aktywność"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
            />
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}CEL DIETY</Text>
            <SelectDropdown
              data={dietPurposes}
              onSelect={(selectedItem, index) => {
                dietPurposeSetSelectedValue(selectedItem.value);
              }}

              defaultButtonText={"Wybierz cel diety"}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
            />
          </View>

          <View>
            <Text>{'\n'}</Text>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={() => CountCalories(textAge, textWeight, textGrowth, sexSelectedValue, activitySelectedValue, dietPurposeSelectedValue, setCalories)}>
              <Text style={styles.buttonText}>
                Oblicz zapotrzebowanie{'\n'}kaloryczne
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.contentText}>{'\n'}Twoje zapotrzebowanie kaloryczne to: {calories} kalorii</Text>
          </View>

          <View>
            <Text>{'\n'}{'\n'}{'\n'}</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CaloriesCalculation;