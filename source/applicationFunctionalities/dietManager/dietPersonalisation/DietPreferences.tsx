import React from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import '../../../interfaces/ProductInterface';
import styles from './DietPreferencesStyles';
import { DietPreferencesController } from './DietPreferencesController';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';

const DietPreferences = () => {

    const { dietTypeSelectedValue, setDietTypeSelectedValue, products, selectedProducts, renderProduct, UserDietTypeChange } = DietPreferencesController();
    // Wartosci do dropdown list
    const dietTypes = [
        { label: 'Klasyczna', value: 'Klasyczna' },
        { label: 'Wegetariańska', value: 'Wegetarianska' },
    ];

    return (
        <KeyboardAvoidingView style={styles.container}>
            <SafeAreaView>
                <View style={styles.dataView}>
                    <Text style={styles.contentText}>
                        Wprowadź zmiany w preferencji swojej diety
                    </Text>
                </View>
                <View style={styles.separator}></View>

                <View style={styles.dataView}>

                    <Text style={styles.contentText}>{'\n'}TYP DIETY</Text>
                    <SelectDropdown
                        data={dietTypes}
                        onSelect={(selectedItem, index) => {
                            setDietTypeSelectedValue(selectedItem.value);
                        }}
                        defaultButtonText={"Wybierz typ diety"}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item.label;
                          }}
                        />

                    <Text>{'\n'}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => UserDietTypeChange(dietTypeSelectedValue)}>
                        <Text style={styles.buttonText}>Zmień typ diety</Text>
                    </TouchableOpacity>
                    <Text>{'\n'}</Text>
                </View>
                <View style={styles.separator}></View>
            </SafeAreaView>
            <Text style={styles.contentText}>
                Wybierz składniki, które chcesz {'\n'}
                wykluczyć ze swoich posiłków: {"\n"}
            </Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                extraData={selectedProducts}
            />
        </KeyboardAvoidingView>
    );
};

export default DietPreferences;