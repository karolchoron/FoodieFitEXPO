import React, { useEffect, useState, useContext } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CaloriesContext from '../../../other/CaloriesContext';
import { CountCalories } from './CaloriesController';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../../data/FirebaseConfig';
import { get, ref } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './CaloriesStyles';

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
            console.log("Błąd, brak dostępnych danych");
          }
        }).catch((error) => {
          console.error("Błąd pobierania danych: ", error);
        });
      } else {
        console.log("Błąd, użytkownik nie jest zalogowany.");
      }
    });
  }, []);

  const [textAge, setAgeText] = useState('');
  const [textWeight, setWeightText] = useState('');
  const [textGrowth, setGrowthText] = useState('');
  const [sexSelectedValue, sexSetSelectedValue] = useState("kobieta");
  const [activitySelectedValue, activitySetSelectedValue] = useState("sredniaAktywnosc");
  const [dietPurposeSelectedValue, dietPurposeSetSelectedValue] = useState("utrzymacWage");

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
            <Picker
              mode="dropdown"
              selectedValue={sexSelectedValue}
              style={styles.stylePicker}
              onValueChange={(sexValue, sexIndex) => sexSetSelectedValue(sexValue)}>
              <Picker.Item label="Kobieta" value="kobieta" />
              <Picker.Item label="Mężczyzna" value="mezczyzna" />
            </Picker>
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}AKTYWNOŚĆ  </Text>
            <Picker
              mode="dropdown"
              selectedValue={activitySelectedValue}
              style={styles.stylePicker}
              onValueChange={(activityValue, activityIndex) => activitySetSelectedValue(activityValue)}>
              <Picker.Item label="Znikoma / brak aktywności" value="znikomaAktywnosc" />
              <Picker.Item label="Niska aktywność" value="niskaAktywnosc" />
              <Picker.Item label="Średnia aktywność" value="sredniaAktywnosc" />
              <Picker.Item label="Wysoka aktywność" value="wysokaAktywnosc" />
              <Picker.Item label="Bardzo wysoka aktywność" value="bardzoWysokaAktywnosc" />
            </Picker>
          </View>

          <View style={styles.separator}></View>

          <View>
            <Text style={styles.contentText}>{'\n'}CEL DIETY</Text>
            <Picker
              mode="dropdown"
              selectedValue={dietPurposeSelectedValue}
              style={styles.stylePicker}
              onValueChange={(dietPurposeValue, dietPurposeIndex) => dietPurposeSetSelectedValue(dietPurposeValue)}>
              <Picker.Item label="Chcę schudnąć" value="schudnac" />
              <Picker.Item label="Chcę utrzymać wagę" value="utrzymacWage" />
              <Picker.Item label="Chcę przytyć" value="przytyc" />
            </Picker>
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