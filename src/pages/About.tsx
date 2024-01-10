import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const About = () => (
<SafeAreaView style={styles.container}>
    <Text style={styles.headerText}>
      {'\n'}INFORMACJE O AUTORZE{'\n'}
    </Text>

    <Text style={styles.authorText}>
      Wojskowa Akademia Techniczna{'\n'}
      Wydział Cybernetyki{'\n'}{'\n'}
      Autor: Karol Choroń{'\n'}
      Grupa: WCY20IG1S1{'\n'}
      Numer albumu: 74982{'\n'}
    </Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f0f0eb',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  authorText: {
    fontWeight: 'normal',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
});

export default About;