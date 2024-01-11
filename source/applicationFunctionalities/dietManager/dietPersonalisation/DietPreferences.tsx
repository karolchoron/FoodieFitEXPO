import React from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import '../../interfaces/IngredientInterface';
import styles from './DietPreferencesStyles';
import { DietPreferencesController } from './DietPreferencesController'; 

const DietPreferences = () => {
    const { dietTypeSelectedValue, setDietTypeSelectedValue, ingredients, selectedIngredients, renderIngredient , UserDietTypeChange} = DietPreferencesController();

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View>
                <View style={styles.dataView}>
                    <Text style={styles.contentText}>
                        Wprowadź zmiany w preferencji swojej diety
                    </Text>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.dataView}>
                    <View>
                        <Text style={styles.contentText}>{'\n'}TYP DIETY</Text>
                        <Picker
                            mode="dropdown"
                            selectedValue={dietTypeSelectedValue}
                            style={styles.stylePicker}
                            onValueChange={(dietTypeValue, dietTypeIndex) => setDietTypeSelectedValue(dietTypeValue)}>
                            <Picker.Item label="Klasyczna" value="Klasyczna" />
                            <Picker.Item label="Wegetariańska" value="Wegetarianska" />
                        </Picker>
                    </View>
                    <Text>{'\n'}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => UserDietTypeChange(dietTypeSelectedValue)}>
                        <Text style={styles.buttonText}>Zmień typ diety</Text>
                    </TouchableOpacity>
                    <Text>{'\n'}</Text>
                </View>
                <View style={styles.separator}></View>
            </View>
            <Text style={styles.contentText}>
                Wybierz składniki, które chcesz {'\n'}
                wykluczyć ze swoich posiłków: {"\n"}
            </Text>
            <FlatList
                data={ingredients}
                renderItem={renderIngredient}
                keyExtractor={(item) => item.id}
                extraData={selectedIngredients}
            />
        </KeyboardAvoidingView>
    );
};

export default DietPreferences;