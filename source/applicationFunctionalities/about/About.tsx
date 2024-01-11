import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AboutStyles';

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

export default About;