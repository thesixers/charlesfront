// src/screens/ContactUs.js
import React from 'react';
import { View, Text, StyleSheet, Linking, Button } from 'react-native';

const ContactUs = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@mylaundryapp.com');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.content}>
        If you have any questions or concerns, feel free to reach out to us.
      </Text>
      <Button title="Email Us" onPress={handleEmailPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});

export default ContactUs;
